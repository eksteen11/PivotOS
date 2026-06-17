-- PivotOS V2: Workstream layer + universal Activity fields on items.
-- Extends the existing items model (does not rewrite it). Safe to re-run.

-- 1) Broaden item_type into the universal Activity vocabulary.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'item_type') then
    create type item_type as enum ('task','goal','process','decision','problem','solution','meeting','deal','lead','note');
  end if;
end $$;

alter type item_type add value if not exists 'opportunity';
alter type item_type add value if not exists 'idea';
alter type item_type add value if not exists 'follow_up';
alter type item_type add value if not exists 'call';
alter type item_type add value if not exists 'email';
alter type item_type add value if not exists 'message';
alter type item_type add value if not exists 'payment';
alter type item_type add value if not exists 'invoice';
alter type item_type add value if not exists 'expense';
alter type item_type add value if not exists 'sale';
alter type item_type add value if not exists 'listing';
alter type item_type add value if not exists 'project';
alter type item_type add value if not exists 'contact';
alter type item_type add value if not exists 'company';

-- 2) Workstreams: third level under entity -> division -> workstream.
create table if not exists public.workstreams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete cascade,
  division_id uuid references public.divisions (id) on delete set null,
  slug text not null,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entity_id, slug)
);

-- 3) Universal Activity fields on items.
alter table public.items add column if not exists workstream_id uuid references public.workstreams (id) on delete set null;
alter table public.items add column if not exists source text not null default 'manual';
alter table public.items add column if not exists owner text;
alter table public.items add column if not exists value numeric;

drop trigger if exists workstreams_set_updated_at on public.workstreams;
create trigger workstreams_set_updated_at
before update on public.workstreams
for each row execute function public.set_updated_at();

create index if not exists idx_workstreams_entity on public.workstreams (user_id, entity_id, sort_order);
create index if not exists idx_items_workstream on public.items (user_id, workstream_id);
create index if not exists idx_items_type on public.items (user_id, type);

alter table public.workstreams enable row level security;

drop policy if exists workstreams_rw on public.workstreams;
create policy workstreams_rw on public.workstreams
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
