-- Secure, user-scoped reset for the Pivot OS cloud demo.

revoke all on function public.seed_pivot_os_demo(uuid) from public, anon, authenticated;

create or replace function public.reset_my_pivot_os_demo()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  delete from public.activity_logs
  where user_id = v_user_id
    and action = 'agent.suggested_action'
    and payload->>'process' = 'lead';

  delete from public.approvals
  where user_id = v_user_id
    and reason in (
      'Sales Agent drafted follow-up email for Rohan Rule 72 lead.',
      'Finance Agent proposes debtor reminder via WhatsApp.',
      'Executive Assistant proposes calendar block for trust remittance.'
    );

  delete from public.items
  where user_id = v_user_id
    and meta->>'seed_batch' = 'pivot_os_demo';

  delete from public.processes
  where user_id = v_user_id
    and title in (
      'Rohan Rule 72 — platform build lead',
      'Hartebeesfontein listing',
      'Maize quote — Western Cape',
      'Invoice follow-up batch',
      'Church trust remittance'
    );

  delete from public.memories
  where user_id = v_user_id
    and key = 'invoice_follow_ups';

  perform public.seed_pivot_os_demo(v_user_id);
end;
$$;

revoke all on function public.reset_my_pivot_os_demo() from public, anon;
grant execute on function public.reset_my_pivot_os_demo() to authenticated;
