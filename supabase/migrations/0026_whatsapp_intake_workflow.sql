-- Dedicated intake workflow (prepared; do NOT treat as applied until reviewed).
-- Dual connection: shared 1:1 (+27827721220 later) vs dedicated intake number (SIM TBD).
-- Unknown senders rejected at application layer; owner RLS everywhere.
-- No automatic media retention deletion. No live send implied.
begin;

create table if not exists public.whatsapp_intake_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  connection_role text not null default 'dedicated-intake' check (connection_role = 'dedicated-intake'),
  provider_message_id text not null,
  from_e164 text not null,
  to_phone_number_id text not null,
  body text not null default '',
  media_present boolean not null default false,
  provenance jsonb not null default '{"claimedForward":false,"originalGroupName":null,"originalSenderName":null,"originalSenderE164":null,"invented":false,"notes":""}'::jsonb,
  context text check (context is null or context in ('digikraal', 'farm-feed', 'northpoint', 'lebab', 'dj-eksteen')),
  context_status text not null default 'missing' check (context_status in ('missing', 'suggested', 'approved')),
  suggested_context text check (suggested_context is null or suggested_context in ('digikraal', 'farm-feed', 'northpoint', 'lebab', 'dj-eksteen')),
  missing_details text[] not null default '{}',
  needs_action boolean not null default true,
  needs_action_completed_at timestamptz,
  read_at timestamptz,
  clarification_id uuid,
  linked_item_ids uuid[] not null default '{}',
  suggestions jsonb not null default '[]'::jsonb,
  status text not null check (status in ('arrived', 'awaiting-clarification', 'ready-for-review', 'completed', 'rejected-unknown-sender')),
  received_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (owner_id, provider_message_id)
);

create table if not exists public.whatsapp_clarifications (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  intake_item_id uuid not null references public.whatsapp_intake_items (id) on delete cascade,
  to_e164 text not null,
  questions jsonb not null default '[]'::jsonb,
  status text not null check (status in ('open', 'resolved')),
  outbound_provider_message_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_outbox (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind = 'founder-clarification'),
  to_e164 text not null,
  body text not null,
  clarification_id uuid references public.whatsapp_clarifications (id) on delete set null,
  intake_item_id uuid references public.whatsapp_intake_items (id) on delete set null,
  status text not null check (status in ('queued', 'unavailable', 'blocked')),
  executes boolean not null default false check (executes = false),
  eligibility jsonb not null default '{}'::jsonb,
  provider_message_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.whatsapp_group_reply_drafts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  intake_item_id uuid not null references public.whatsapp_intake_items (id) on delete cascade,
  target_group_label text not null,
  body text not null,
  status text not null check (status in ('draft', 'copied', 'confirmed-sent')),
  copied_at timestamptz,
  confirmed_sent_at timestamptz,
  executes boolean not null default false check (executes = false),
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists whatsapp_intake_items_owner_received_idx
  on public.whatsapp_intake_items (owner_id, received_at desc);
create index if not exists whatsapp_intake_items_owner_needs_action_idx
  on public.whatsapp_intake_items (owner_id, needs_action);

alter table public.whatsapp_intake_items enable row level security;
alter table public.whatsapp_clarifications enable row level security;
alter table public.whatsapp_outbox enable row level security;
alter table public.whatsapp_group_reply_drafts enable row level security;

drop policy if exists whatsapp_intake_items_owner on public.whatsapp_intake_items;
create policy whatsapp_intake_items_owner on public.whatsapp_intake_items
for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists whatsapp_clarifications_owner on public.whatsapp_clarifications;
create policy whatsapp_clarifications_owner on public.whatsapp_clarifications
for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists whatsapp_outbox_owner on public.whatsapp_outbox;
create policy whatsapp_outbox_owner on public.whatsapp_outbox
for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists whatsapp_group_reply_drafts_owner on public.whatsapp_group_reply_drafts;
create policy whatsapp_group_reply_drafts_owner on public.whatsapp_group_reply_drafts
for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

revoke all on public.whatsapp_intake_items, public.whatsapp_clarifications, public.whatsapp_outbox, public.whatsapp_group_reply_drafts from public, anon;
grant select, insert, update, delete on public.whatsapp_intake_items, public.whatsapp_clarifications, public.whatsapp_outbox, public.whatsapp_group_reply_drafts to authenticated;
grant all on public.whatsapp_intake_items, public.whatsapp_clarifications, public.whatsapp_outbox, public.whatsapp_group_reply_drafts to service_role;

commit;
