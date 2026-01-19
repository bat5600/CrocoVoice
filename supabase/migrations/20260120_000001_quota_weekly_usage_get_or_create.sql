-- Helper RPC to read weekly usage (and create the row if missing) without mutating words_used.

create or replace function public._quota_weekly_get_or_create(
  p_user_id uuid,
  p_period_start timestamptz
)
returns integer
language plpgsql
security definer
as $$
declare
  current_used integer;
begin
  insert into public.quota_weekly_usage (user_id, period_start, words_used, updated_at)
  values (p_user_id, p_period_start, 0, now())
  on conflict (user_id, period_start) do nothing;

  select words_used
  into current_used
  from public.quota_weekly_usage
  where user_id = p_user_id and period_start = p_period_start;

  return coalesce(current_used, 0);
end;
$$;

revoke all on function public._quota_weekly_get_or_create(uuid, timestamptz) from public;
grant execute on function public._quota_weekly_get_or_create(uuid, timestamptz) to service_role;

