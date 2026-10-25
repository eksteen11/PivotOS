-- Prepare account and business-role infrastructure while keeping registration
-- and collaboration private. No teammate receives access from this migration.
begin;

-- Account creation remains private until the owner explicitly enables it.
create or replace function public.account_registration_open()
returns boolean language sql stable security definer set search_path = '' as $$
  select not exists (select 1 from public.profiles where role = 'founder');
$$;
revoke all on function public.account_registration_open() from public;
grant execute on function public.account_registration_open() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.access_invites enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated
using (user_id = (select auth.uid()));
revoke all on public.access_invites from anon, authenticated;

do $$ begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace where t.typname = 'entity_role' and n.nspname = 'public') then
    create type public.entity_role as enum ('owner', 'admin', 'member', 'viewer');
  end if;
end $$;
create table if not exists public.entity_members (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.entity_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(entity_id, user_id)
);
alter table public.entity_members enable row level security;

-- Initial release supports only owner memberships. Clients cannot grant roles.
-- Existing policies from the archived prototype are replaced deliberately.
do $$ declare p record; begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'entity_members' loop
    execute format('drop policy %I on public.entity_members', p.policyname);
  end loop;
end $$;
create policy entity_members_read_own on public.entity_members for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.entity_members from anon, authenticated;
grant select on public.entity_members to authenticated;

insert into public.entity_members(entity_id,user_id,role)
select id,user_id,'owner'::public.entity_role from public.entities
on conflict(entity_id,user_id) do nothing;

create or replace function public.seed_entity_owner_membership()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.entity_members(entity_id,user_id,role)
  values (new.id,new.user_id,'owner') on conflict(entity_id,user_id) do nothing;
  return new;
end;
$$;
revoke all on function public.seed_entity_owner_membership() from public, anon, authenticated;
drop trigger if exists entities_seed_owner_membership on public.entities;
create trigger entities_seed_owner_membership after insert on public.entities
for each row execute function public.seed_entity_owner_membership();

-- Enforce isolation even if older membership-aware prototype policies exist.
-- No account can read/write another account's work by changing a membership.
drop policy if exists entities_rw on public.entities;
create policy entities_rw on public.entities for all to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists items_rw on public.items;
create policy items_rw on public.items for all to authenticated
using (user_id = (select auth.uid())) with check (
  user_id = (select auth.uid()) and (entity_id is null or exists (
    select 1 from public.entities e where e.id = items.entity_id and e.user_id = (select auth.uid())
  ))
);

-- Keep sign-in email in the profile synchronized. Clients cannot edit roles.
create or replace function public.sync_profile_email()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles set email = coalesce(new.email,'') where user_id = new.id;
  return new;
end;
$$;
revoke all on function public.sync_profile_email() from public, anon, authenticated;
drop trigger if exists auth_user_sync_profile_email on auth.users;
create trigger auth_user_sync_profile_email after update of email on auth.users
for each row execute function public.sync_profile_email();
commit;
