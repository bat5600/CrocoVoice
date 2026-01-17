-- CrocoVoice schema (Supabase/Postgres)

create table if not exists public.history (
  id uuid primary key,
  user_id uuid not null,
  text text not null,
  raw_text text not null,
  language text not null,
  duration_ms integer,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.dictionary (
  id uuid primary key,
  user_id uuid not null,
  from_text text not null,
  to_text text not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.notes (
  id uuid primary key,
  user_id uuid not null,
  title text not null,
  text text not null,
  metadata jsonb,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.styles (
  id uuid primary key,
  user_id uuid not null,
  name text not null,
  prompt text not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.user_settings (
  id text primary key,
  user_id uuid not null,
  key text not null,
  value text not null,
  updated_at timestamptz not null
);

alter table public.history enable row level security;
alter table public.dictionary enable row level security;
alter table public.styles enable row level security;
alter table public.user_settings enable row level security;

alter table public.notes enable row level security;

create policy "History access" on public.history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Dictionary access" on public.dictionary
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Styles access" on public.styles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Notes access" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Settings access" on public.user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
