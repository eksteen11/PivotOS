-- Optional TOTP only becomes available in the UI after this protection is applied.
-- Existing accounts with no verified factor retain their current private access.
begin;
create schema if not exists private;
create or replace function private.account_assurance_ok()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((auth.jwt()->>'aal') = 'aal2', false)
    or not exists (
      select 1 from auth.mfa_factors f
      where f.user_id = (select auth.uid()) and f.status = 'verified'
    );
$$;
revoke all on function private.account_assurance_ok() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.account_assurance_ok() to authenticated;

-- Restrictive policies AND with the existing ownership policies, never widen them.
do $$
declare t record;
begin
  for t in select n.nspname, c.relname from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relrowsecurity and c.relkind in ('r', 'p')
      and (n.nspname = 'public' or (n.nspname = 'storage' and c.relname = 'objects'))
  loop
    execute format('drop policy if exists account_second_factor on %I.%I', t.nspname, t.relname);
    execute format('create policy account_second_factor on %I.%I as restrictive for all to authenticated using ((select private.account_assurance_ok())) with check ((select private.account_assurance_ok()))', t.nspname, t.relname);
  end loop;
end $$;

-- These two user-callable SECURITY DEFINER routines bypass RLS and need the same guard.
-- Keep their existing transaction logic, signatures and privileges.
do $$
declare signature text; definition text;
begin
  foreach signature in array array['public.resolve_my_approval(uuid,public.approval_status)', 'public.reset_my_pivot_os_demo()'] loop
    if to_regprocedure(signature) is not null then
      definition := pg_get_functiondef(to_regprocedure(signature));
      if position('private.account_assurance_ok()' in definition) = 0 then
        definition := regexp_replace(definition, '\mbegin\M', E'begin\n  if not private.account_assurance_ok() then\n    raise exception ''Second-factor verification required'' using errcode = ''42501'';\n  end if;', 'i');
        execute definition;
      end if;
    end if;
  end loop;
end $$;

create or replace function public.account_mfa_ready()
returns boolean language sql stable set search_path = '' as $$ select true $$;
revoke all on function public.account_mfa_ready() from public, anon;
grant execute on function public.account_mfa_ready() to authenticated;
commit;
