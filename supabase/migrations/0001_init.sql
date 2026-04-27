-- PivotOS V1 core schema (single-user safe, multi-user ready)

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'item_type') then
    create type item_type as enum (
      'task',
      'goal',
      'process',
      'decision',
      'problem',
      'solution',
      'meeting',
      'deal',
      'lead',
      'note'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'item_status') then
    create type item_status as enum (
      'inbox',
      'planned',
      'in_progress',
      'waiting',
      'done',
      'cancelled'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'outbox_status') then
    create type outbox_status as enum ('pending', 'sent', 'failed');
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

create table if not exists public.divisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete cascade,
  slug text not null,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entity_id, slug)
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid references public.entities (id) on delete set null,
  division_id uuid references public.divisions (id) on delete set null,

  type item_type not null default 'note',
  status item_status not null default 'inbox',
  priority smallint not null default 2,

  title text,
  content text not null default '',
  due_at timestamptz,
  scheduled_blocks jsonb not null default '[]'::jsonb,
  meta jsonb not null default '{}'::jsonb,

  client_updated_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.item_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  from_item_id uuid not null references public.items (id) on delete cascade,
  to_item_id uuid not null references public.items (id) on delete cascade,
  kind text not null default 'relates_to',
  created_at timestamptz not null default now(),
  unique (user_id, from_item_id, to_item_id, kind)
);

create table if not exists public.sync_outbox (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id uuid references public.items (id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status outbox_status not null default 'pending',
  attempts int not null default 0,
  next_attempt_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists entities_set_updated_at on public.entities;
create trigger entities_set_updated_at
before update on public.entities
for each row execute function public.set_updated_at();

drop trigger if exists divisions_set_updated_at on public.divisions;
create trigger divisions_set_updated_at
before update on public.divisions
for each row execute function public.set_updated_at();

drop trigger if exists items_set_updated_at on public.items;
create trigger items_set_updated_at
before update on public.items
for each row execute function public.set_updated_at();

drop trigger if exists sync_outbox_set_updated_at on public.sync_outbox;
create trigger sync_outbox_set_updated_at
before update on public.sync_outbox
for each row execute function public.set_updated_at();

create index if not exists idx_entities_user on public.entities (user_id, sort_order);
create index if not exists idx_divisions_entity on public.divisions (user_id, entity_id, sort_order);
create index if not exists idx_items_user_updated on public.items (user_id, updated_at desc);
create index if not exists idx_items_due on public.items (user_id, due_at);
create index if not exists idx_outbox_pending on public.sync_outbox (user_id, status, next_attempt_at);

alter table public.entities enable row level security;
alter table public.divisions enable row level security;
alter table public.items enable row level security;
alter table public.item_links enable row level security;
alter table public.sync_outbox enable row level security;

drop policy if exists entities_rw on public.entities;
create policy entities_rw on public.entities
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists divisions_rw on public.divisions;
create policy divisions_rw on public.divisions
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists items_rw on public.items;
create policy items_rw on public.items
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists item_links_rw on public.item_links;
create policy item_links_rw on public.item_links
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists outbox_rw on public.sync_outbox;
create policy outbox_rw on public.sync_outbox
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

