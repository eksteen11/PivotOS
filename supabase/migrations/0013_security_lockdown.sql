-- Lock down privileged functions and make the inbox view obey caller RLS.

alter function public.set_updated_at() set search_path = public;

revoke all on function public.enqueue_item_outbox_event() from public, anon, authenticated;
revoke all on function public.handle_new_user_seed() from public, anon, authenticated;
revoke all on function public.seed_dj_werk_meetings(uuid) from public, anon, authenticated;
revoke all on function public.seed_pivot_os_demo(uuid) from public, anon, authenticated;

revoke all on function public.user_is_entity_member(uuid) from public, anon;
revoke all on function public.user_is_entity_admin(uuid) from public, anon;
grant execute on function public.user_is_entity_member(uuid) to authenticated;
grant execute on function public.user_is_entity_admin(uuid) to authenticated;

create or replace view public.inbox_items
with (security_invoker = true)
as
select
  i.*,
  coalesce(i.meta->>'suggested_process', '') as suggested_process,
  coalesce(i.meta->>'suggested_agent', '') as suggested_agent,
  coalesce(i.meta->>'urgency', 'normal') as urgency
from public.items i
where i.status = 'inbox' and i.deleted_at is null;

revoke all on public.inbox_items from public, anon;
grant select on public.inbox_items to authenticated;
