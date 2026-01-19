-- Weekly quota usage (server-authoritative for FREE plan).
-- Reset window: Monday 00:00 UTC -> period_start stored as timestamptz (UTC).

create table if not exists public.quota_weekly_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start timestamptz not null,
  words_used integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, period_start)
);

alter table public.quota_weekly_usage enable row level security;

-- Users can read their own usage (optional: used for debugging/visibility).
drop policy if exists quota_weekly_usage_read_own on public.quota_weekly_usage;
create policy quota_weekly_usage_read_own
  on public.quota_weekly_usage
  for select
  using (auth.uid() = user_id);

-- No client-side writes; updates happen via Edge Functions using service role.
revoke insert, update, delete on public.quota_weekly_usage from anon, authenticated;

-- Atomic consume helper for Edge Functions (service_role only).
create or replace function public._quota_weekly_consume(
  p_user_id uuid,
  p_period_start timestamptz,
  p_words integer,
  p_limit integer
)
returns integer
language plpgsql
security definer
as $$
declare
  next_used integer;
  safe_words integer;
  safe_limit integer;
begin
  safe_words := greatest(coalesce(p_words, 0), 0);
  safe_limit := greatest(coalesce(p_limit, 0), 0);

  insert into public.quota_weekly_usage (user_id, period_start, words_used, updated_at)
  values (p_user_id, p_period_start, 0, now())
  on conflict (user_id, period_start) do nothing;

  update public.quota_weekly_usage
  set
    words_used = least(words_used + safe_words, safe_limit),
    updated_at = now()
  where user_id = p_user_id and period_start = p_period_start
  returning words_used into next_used;

  return coalesce(next_used, 0);
end;
$$;

revoke all on function public._quota_weekly_consume(uuid, timestamptz, integer, integer) from public;
grant execute on function public._quota_weekly_consume(uuid, timestamptz, integer, integer) to service_role;

