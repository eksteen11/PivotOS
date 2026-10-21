-- Door companies and the meeting record.
-- The live project only had founder access. Meetings need these tables.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'item_type') then
    create type public.item_type as enum ('task', 'goal', 'process', 'decision', 'problem', 'solution', 'meeting', 'deal', 'lead', 'note');
  end if;
  if not exists (select 1 from pg_type where typname = 'item_status') then
    create type public.item_status as enum ('inbox', 'planned', 'in_progress', 'waiting', 'done', 'cancelled');
  end if;
end $$;

create table if not exists public.entities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid references public.entities (id) on delete set null,
  type public.item_type not null default 'note',
  status public.item_status not null default 'inbox',
  title text,
  content text not null default '',
  due_at timestamptz,
  source text not null default 'manual',
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid references public.entities (id) on delete set null,
  agent_id uuid,
  process_id uuid,
  approval_id uuid,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.entities enable row level security;
alter table public.items enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists entities_rw on public.entities;
create policy entities_rw on public.entities
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists items_rw on public.items;
create policy items_rw on public.items
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists activity_logs_insert on public.activity_logs;
create policy activity_logs_insert on public.activity_logs
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists activity_logs_select on public.activity_logs;
create policy activity_logs_select on public.activity_logs
for select to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete on public.entities to authenticated;
grant select, insert, update, delete on public.items to authenticated;
grant select, insert on public.activity_logs to authenticated;

create or replace function public.seed_founder_door_companies()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'founder' then
    insert into public.entities (user_id, slug, name, sort_order)
    values
      (new.user_id, 'dj', 'Personal', 0),
      (new.user_id, 'digikraal', 'Digikraal', 1),
      (new.user_id, 'farm_feed', 'Farm Feed', 2),
      (new.user_id, 'northpoint', 'Northpoint', 3)
    on conflict (user_id, slug) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_seed_door_companies on public.profiles;
create trigger profiles_seed_door_companies
after insert on public.profiles
for each row execute function public.seed_founder_door_companies();

insert into public.entities (user_id, slug, name, sort_order)
select p.user_id, v.slug, v.name, v.sort_order
from public.profiles p
cross join (
  values
    ('dj', 'Personal', 0),
    ('digikraal', 'Digikraal', 1),
    ('farm_feed', 'Farm Feed', 2),
    ('northpoint', 'Northpoint', 3)
) as v(slug, name, sort_order)
where p.role = 'founder'
on conflict (user_id, slug) do nothing;
