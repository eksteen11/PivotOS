-- Founder access for Pivot OS.
-- The first account becomes the founder and may open the front door.
-- Co-worker rows are allowed only when an invite exists. The app does not create invites yet.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'access_role') then
    create type public.access_role as enum ('founder', 'coworker');
  end if;
end $$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role public.access_role not null,
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_one_founder
  on public.profiles ((true))
  where role = 'founder';

create table if not exists public.access_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role public.access_role not null default 'coworker',
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  revoked_at timestamptz,
  constraint access_invites_not_founder check (role = 'coworker')
);

create unique index if not exists access_invites_open_email
  on public.access_invites (lower(email))
  where accepted_at is null and revoked_at is null;

alter table public.profiles enable row level security;
alter table public.access_invites enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.founder_seat_open()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (select 1 from public.profiles where role = 'founder');
$$;

revoke all on function public.founder_seat_open() from public;
grant execute on function public.founder_seat_open() to anon, authenticated;

create or replace function public.handle_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  founder_count int;
  invite_id uuid;
begin
  if exists (select 1 from public.profiles where user_id = new.id) then
    return new;
  end if;

  select count(*) into founder_count from public.profiles where role = 'founder';

  if founder_count = 0 then
    insert into public.profiles (user_id, email, role)
    values (new.id, coalesce(new.email, ''), 'founder');
    return new;
  end if;

  select id into invite_id
  from public.access_invites
  where lower(email) = lower(coalesce(new.email, ''))
    and accepted_at is null
    and revoked_at is null
  limit 1;

  if invite_id is not null then
    insert into public.profiles (user_id, email, role)
    values (new.id, coalesce(new.email, ''), 'coworker');
    update public.access_invites set accepted_at = now() where id = invite_id;
    return new;
  end if;

  raise exception 'Pivot OS is private. Invitations are not open.';
end;
$$;

drop trigger if exists on_auth_user_profile on auth.users;
create trigger on_auth_user_profile
  after insert on auth.users
  for each row execute function public.handle_auth_user_profile();
