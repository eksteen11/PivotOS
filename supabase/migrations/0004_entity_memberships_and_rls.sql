-- Phase 1: entity memberships, roles, invites, and membership-aware RLS

do $$
begin
  if not exists (select 1 from pg_type where typname = 'entity_role') then
    create type entity_role as enum ('owner', 'admin', 'member', 'viewer');
  end if;
end $$;

create table if not exists public.entity_members (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role entity_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entity_id, user_id)
);

create table if not exists public.entity_invites (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities (id) on delete cascade,
  invited_by uuid not null references auth.users (id) on delete cascade,
  email text not null,
  role entity_role not null default 'member',
  token text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_entity_members_user on public.entity_members (user_id, entity_id);
create index if not exists idx_entity_members_entity on public.entity_members (entity_id, role);
create index if not exists idx_entity_invites_entity on public.entity_invites (entity_id, created_at desc);
create index if not exists idx_entity_invites_email on public.entity_invites (lower(email));

-- Backfill owner memberships for existing entities
insert into public.entity_members (entity_id, user_id, role)
select e.id, e.user_id, 'owner'::entity_role
from public.entities e
on conflict (entity_id, user_id) do nothing;

-- Keep updated_at in sync
drop trigger if exists entity_members_set_updated_at on public.entity_members;
create trigger entity_members_set_updated_at
before update on public.entity_members
for each row execute function public.set_updated_at();

drop trigger if exists entity_invites_set_updated_at on public.entity_invites;
create trigger entity_invites_set_updated_at
before update on public.entity_invites
for each row execute function public.set_updated_at();

alter table public.entity_members enable row level security;
alter table public.entity_invites enable row level security;

drop policy if exists entity_members_select on public.entity_members;
create policy entity_members_select on public.entity_members
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.entity_members em2
    where em2.entity_id = entity_members.entity_id
      and em2.user_id = auth.uid()
      and em2.role in ('owner', 'admin')
  )
);

drop policy if exists entity_members_insert on public.entity_members;
create policy entity_members_insert on public.entity_members
for insert
to authenticated
with check (
  exists (
    select 1
    from public.entity_members em2
    where em2.entity_id = entity_members.entity_id
      and em2.user_id = auth.uid()
      and em2.role in ('owner', 'admin')
  )
);

drop policy if exists entity_members_update on public.entity_members;
create policy entity_members_update on public.entity_members
for update
to authenticated
using (
  exists (
    select 1
    from public.entity_members em2
    where em2.entity_id = entity_members.entity_id
      and em2.user_id = auth.uid()
      and em2.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.entity_members em2
    where em2.entity_id = entity_members.entity_id
      and em2.user_id = auth.uid()
      and em2.role in ('owner', 'admin')
  )
);

drop policy if exists entity_members_delete on public.entity_members;
create policy entity_members_delete on public.entity_members
for delete
to authenticated
using (
  exists (
    select 1
    from public.entity_members em2
    where em2.entity_id = entity_members.entity_id
      and em2.user_id = auth.uid()
      and em2.role in ('owner', 'admin')
  )
);

drop policy if exists entity_invites_select on public.entity_invites;
create policy entity_invites_select on public.entity_invites
for select
to authenticated
using (
  exists (
    select 1
    from public.entity_members em
    where em.entity_id = entity_invites.entity_id
      and em.user_id = auth.uid()
      and em.role in ('owner', 'admin')
  )
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

drop policy if exists entity_invites_insert on public.entity_invites;
create policy entity_invites_insert on public.entity_invites
for insert
to authenticated
with check (
  invited_by = auth.uid()
  and exists (
    select 1
    from public.entity_members em
    where em.entity_id = entity_invites.entity_id
      and em.user_id = auth.uid()
      and em.role in ('owner', 'admin')
  )
);

drop policy if exists entity_invites_update on public.entity_invites;
create policy entity_invites_update on public.entity_invites
for update
to authenticated
using (
  exists (
    select 1
    from public.entity_members em
    where em.entity_id = entity_invites.entity_id
      and em.user_id = auth.uid()
      and em.role in ('owner', 'admin')
  )
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
)
with check (
  exists (
    select 1
    from public.entity_members em
    where em.entity_id = entity_invites.entity_id
      and em.user_id = auth.uid()
      and em.role in ('owner', 'admin')
  )
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

-- Membership-aware policies for core tables
drop policy if exists entities_rw on public.entities;
create policy entities_rw on public.entities
for all
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.entity_members em
    where em.entity_id = entities.id
      and em.user_id = auth.uid()
  )
)
with check (auth.uid() = user_id);

drop policy if exists divisions_rw on public.divisions;
create policy divisions_rw on public.divisions
for all
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.entity_members em
    where em.entity_id = divisions.entity_id
      and em.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  or exists (
    select 1
    from public.entity_members em
    where em.entity_id = divisions.entity_id
      and em.user_id = auth.uid()
      and em.role in ('owner', 'admin')
  )
);

drop policy if exists items_rw on public.items;
create policy items_rw on public.items
for all
to authenticated
using (
  auth.uid() = user_id
  or (
    items.entity_id is not null
    and exists (
      select 1
      from public.entity_members em
      where em.entity_id = items.entity_id
        and em.user_id = auth.uid()
    )
  )
)
with check (
  auth.uid() = user_id
  and (
    items.entity_id is null
    or exists (
      select 1
      from public.entity_members em
      where em.entity_id = items.entity_id
        and em.user_id = auth.uid()
    )
  )
);

drop policy if exists item_links_rw on public.item_links;
create policy item_links_rw on public.item_links
for all
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.items i
    join public.entity_members em on em.entity_id = i.entity_id
    where i.id = item_links.from_item_id
      and em.user_id = auth.uid()
  )
)
with check (auth.uid() = user_id);

drop policy if exists outbox_rw on public.sync_outbox;
create policy outbox_rw on public.sync_outbox
for all
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.items i
    join public.entity_members em on em.entity_id = i.entity_id
    where i.id = sync_outbox.item_id
      and em.user_id = auth.uid()
  )
)
with check (auth.uid() = user_id);

-- Keep seed function aligned with memberships
create or replace function public.handle_new_user_seed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  digikraal_id uuid;
begin
  insert into public.entities (user_id, slug, name, sort_order)
  values
    (new.id, 'dj', 'DJ Eksteen', 0),
    (new.id, 'digikraal', 'Digikraal', 1),
    (new.id, 'farm_feed', 'Farm Feed', 2),
    (new.id, 'northpoint', 'Northpoint', 3)
  on conflict (user_id, slug) do nothing;

  insert into public.entity_members (entity_id, user_id, role)
  select e.id, new.id, 'owner'::entity_role
  from public.entities e
  where e.user_id = new.id
  on conflict (entity_id, user_id) do nothing;

  select id into digikraal_id
  from public.entities
  where user_id = new.id and slug = 'digikraal'
  limit 1;

  if digikraal_id is not null then
    insert into public.divisions (user_id, entity_id, slug, name, sort_order)
    values
      (new.id, digikraal_id, 'dk_agency', 'DK Agency', 0),
      (new.id, digikraal_id, 'dk_tech', 'DK Tech', 1),
      (new.id, digikraal_id, 'dk_property', 'DK Property', 2),
      (new.id, digikraal_id, 'dk_agri', 'DK Agri', 3)
    on conflict (user_id, entity_id, slug) do nothing;
  end if;

  return new;
end;
$$;

