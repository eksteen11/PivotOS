-- Run as the project database administrator after migration 0018.
-- Uses existing owner records; all test context is rolled back. No users created.
begin;
do $$ begin
  perform set_config('request.jwt.claim.sub', (select user_id::text from public.profiles where role = 'founder' limit 1), true);
end $$;
set local role authenticated;
do $$ begin
  if not exists (select 1 from public.profiles where user_id = auth.uid()) then raise exception 'Owner cannot read their profile'; end if;
  if not exists (select 1 from public.entities where user_id = auth.uid()) then raise exception 'Owner cannot read businesses'; end if;
  if not exists (select 1 from public.entity_members where user_id = auth.uid() and role = 'owner') then raise exception 'Owner memberships missing'; end if;
  if public.account_registration_open() then raise exception 'Public registration unexpectedly open'; end if;
  begin
    update public.profiles set role = 'coworker' where user_id = auth.uid();
    raise exception 'Client changed profile role';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.entity_members set role = 'admin' where user_id = auth.uid();
    raise exception 'Client changed membership role';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
do $$ begin perform set_config('request.jwt.claim.sub', gen_random_uuid()::text, true); end $$;
set local role authenticated;
do $$ begin
  if exists (select 1 from public.profiles) then raise exception 'Another identity can read profiles'; end if;
  if exists (select 1 from public.entities) then raise exception 'Another identity can read businesses'; end if;
  if exists (select 1 from public.items) then raise exception 'Another identity can read saved work'; end if;
  if exists (select 1 from public.entity_members) then raise exception 'Another identity can read memberships'; end if;
end $$;
reset role;
rollback;
select 'PASS' as isolation_and_role_escalation_checks, (select count(*) from public.profiles) as accounts, (select count(*) from public.entities) as businesses, (select count(*) from public.items) as saved_records, (select count(*) from public.entity_members where role='owner') as owner_memberships, public.account_registration_open() as public_registration_open;
