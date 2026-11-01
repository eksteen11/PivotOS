-- Run as database admin AFTER 0023. All changes are rolled back.
-- The synthetic factor is not a usable credential and never commits.
begin;
select set_config('request.jwt.claim.sub', (select user_id::text from public.profiles where role = 'founder' limit 1), true);
select set_config('request.jwt.claims', jsonb_build_object('sub', current_setting('request.jwt.claim.sub'), 'role', 'authenticated', 'aal', 'aal2')::text, true);

-- Verify every existing public RLS table has a restrictive gate.
do $$ begin
  if exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relrowsecurity and c.relkind in ('r','p')
      and not exists (select 1 from pg_policy p where p.polrelid = c.oid and p.polname = 'account_second_factor' and not p.polpermissive)) then
    raise exception 'A public RLS table is missing restrictive MFA enforcement';
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'account_second_factor' and permissive = 'RESTRICTIVE') then
    raise exception 'Storage MFA policy is missing';
  end if;
  -- These routines are absent on the current hosted database. Guard them only when present,
  -- matching 0023. A later create-or-replace would remove the guard and must be rechecked.
  if to_regprocedure('public.resolve_my_approval(uuid,public.approval_status)') is not null
     and position('private.account_assurance_ok()' in pg_get_functiondef('public.resolve_my_approval(uuid,public.approval_status)'::regprocedure)) = 0 then
    raise exception 'Approval routine is missing MFA guard';
  end if;
  if to_regprocedure('public.reset_my_pivot_os_demo()') is not null
     and position('private.account_assurance_ok()' in pg_get_functiondef('public.reset_my_pivot_os_demo()'::regprocedure)) = 0 then
    raise exception 'Demo routine is missing MFA guard';
  end if;
end $$;

insert into auth.mfa_factors(id, user_id, friendly_name, factor_type, status, secret, created_at, updated_at)
values (gen_random_uuid(), current_setting('request.jwt.claim.sub')::uuid, 'ROLLBACK_ONLY_NONFUNCTIONAL_TEST', 'totp', 'verified', 'NOT_A_USABLE_CREDENTIAL', now(), now());

set local role authenticated;
select set_config('request.jwt.claims', jsonb_build_object('sub', current_setting('request.jwt.claim.sub'), 'role', 'authenticated', 'aal', 'aal1')::text, true);
do $$ begin
  if private.account_assurance_ok() then raise exception 'A verified factor was bypassed at aal1'; end if;
  if exists (select 1 from public.items) or exists (select 1 from public.entities) or exists (select 1 from public.profiles) then
    raise exception 'aal1 can read protected records';
  end if;
  if to_regprocedure('public.reset_my_pivot_os_demo()') is not null then
    begin
      perform public.reset_my_pivot_os_demo();
      raise exception 'aal1 bypassed definer guard';
    exception when insufficient_privilege then null;
    end;
  end if;
end $$;

select set_config('request.jwt.claims', jsonb_build_object('sub', current_setting('request.jwt.claim.sub'), 'role', 'authenticated', 'aal', 'aal2')::text, true);
do $$ begin
  if not private.account_assurance_ok() then raise exception 'aal2 denied'; end if;
  if not exists (select 1 from public.profiles where user_id = auth.uid()) then raise exception 'aal2 owner access missing'; end if;
  if exists (select 1 from public.profiles where user_id <> auth.uid()) then raise exception 'aal2 widened ownership'; end if;
  if not public.account_mfa_ready() then raise exception 'MFA readiness missing'; end if;
end $$;
reset role;
rollback;
select 'PASS: MFA policy coverage, aal1 denial, definer guard, aal2 ownership; synthetic factor rolled back' as result;
