-- Snippets table for offline-first sync.

create table if not exists public.snippets (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  cue text not null,
  cue_norm text not null,
  template text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_snippets_user_updated_at on public.snippets (user_id, updated_at);
create index if not exists idx_snippets_user_cue_norm on public.snippets (user_id, cue_norm);

alter table public.snippets enable row level security;

drop policy if exists snippets_select_own on public.snippets;
create policy snippets_select_own
  on public.snippets
  for select
  using (auth.uid() = user_id);

drop policy if exists snippets_insert_own on public.snippets;
create policy snippets_insert_own
  on public.snippets
  for insert
  with check (auth.uid() = user_id);

drop policy if exists snippets_update_own on public.snippets;
create policy snippets_update_own
  on public.snippets
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists snippets_delete_own on public.snippets;
create policy snippets_delete_own
  on public.snippets
  for delete
  using (auth.uid() = user_id);
