-- Keep RLS helper functions callable by policies but outside the exposed API schema.

create schema if not exists private;

alter function public.user_is_entity_member(uuid) set schema private;
alter function public.user_is_entity_admin(uuid) set schema private;

revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

revoke all on function private.user_is_entity_member(uuid) from public, anon;
revoke all on function private.user_is_entity_admin(uuid) from public, anon;
grant execute on function private.user_is_entity_member(uuid) to authenticated;
grant execute on function private.user_is_entity_admin(uuid) to authenticated;
