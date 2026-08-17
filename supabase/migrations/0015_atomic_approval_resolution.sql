-- Resolve a founder approval and append its audit event in one transaction.

create or replace function public.resolve_my_approval(
  p_approval_id uuid,
  p_decision approval_status
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_approval public.approvals%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_decision not in ('approved', 'rejected') then
    raise exception 'Invalid approval decision' using errcode = '22023';
  end if;

  select * into v_approval
  from public.approvals
  where id = p_approval_id and user_id = v_user_id
  for update;

  if not found then raise exception 'Approval not found' using errcode = 'P0002'; end if;
  if v_approval.status <> 'pending' then
    raise exception 'Approval already resolved' using errcode = '23505';
  end if;

  update public.approvals
  set status = p_decision, resolved_by = v_user_id, resolved_at = now()
  where id = p_approval_id;

  insert into public.activity_logs (
    user_id, entity_id, agent_id, approval_id, action, payload
  ) values (
    v_user_id, v_approval.entity_id, v_approval.agent_id, v_approval.id,
    case when p_decision = 'approved' then 'approval.approved' else 'approval.rejected' end,
    jsonb_build_object('action_type', v_approval.action_type)
  );

  return jsonb_build_object('id', p_approval_id, 'status', p_decision);
end;
$$;

revoke all on function public.resolve_my_approval(uuid, approval_status) from public, anon;
grant execute on function public.resolve_my_approval(uuid, approval_status) to authenticated;
