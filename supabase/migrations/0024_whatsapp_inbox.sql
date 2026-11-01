-- Shared WhatsApp Business inbox for the founder number.
-- Applied on target project xikwbkcdbfscnijlfwjw as migration whatsapp_inbox (20261027160858) on 27 Oct 2026.
-- Sending stays blocked at the application layer; this schema stores inbound evidence.
begin;

create table if not exists public.whatsapp_connections (
  owner_id uuid primary key references auth.users (id) on delete cascade,
  display_e164 text not null check (display_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  phone_number_id text not null default '',
  waba_id text not null default '',
  provider_status text not null default 'not-connected'
    check (provider_status in ('not-connected', 'setup-incomplete', 'webhook-ready', 'awaiting-onboarding', 'connected')),
  coexistence_mode text not null default 'unverified'
    check (coexistence_mode in ('unverified', 'embedded-signup-v4', 'bsp-review-required')),
  sending_enabled boolean not null default false,
  configuration jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  check (sending_enabled = false)
);

create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  provider_message_id text not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  from_e164 text not null check (from_e164 ~ '^\+?[1-9][0-9]{7,14}$'),
  to_phone_number_id text not null default '',
  body text not null default '',
  media_kind text not null default 'none'
    check (media_kind in ('none', 'image', 'audio', 'document', 'video', 'sticker', 'unknown')),
  media_present boolean not null default false,
  extraction text not null default '',
  uncertain boolean not null default false,
  context text check (context is null or context in ('digikraal', 'farm-feed', 'northpoint', 'lebab', 'dj-eksteen')),
  company text check (company is null or company in ('personal', 'digikraal', 'farm-feed', 'northpoint')),
  privacy text not null check (privacy in ('founder-private', 'company-visible')),
  status text not null check (status in ('received', 'needs-context', 'linked', 'uncertain', 'approved-not-sent', 'blocked')),
  company_inferred boolean not null default false check (company_inferred = false),
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (owner_id, provider_message_id)
);

create index if not exists whatsapp_messages_owner_received_idx
  on public.whatsapp_messages (owner_id, received_at desc);

alter table public.whatsapp_connections enable row level security;
alter table public.whatsapp_messages enable row level security;

drop policy if exists whatsapp_connections_owner on public.whatsapp_connections;
create policy whatsapp_connections_owner on public.whatsapp_connections
for all to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists whatsapp_messages_owner on public.whatsapp_messages;
create policy whatsapp_messages_owner on public.whatsapp_messages
for all to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

revoke all on public.whatsapp_connections, public.whatsapp_messages from public, anon;
grant select, insert, update, delete on public.whatsapp_connections to authenticated;
grant select, insert, update, delete on public.whatsapp_messages to authenticated;
grant all on public.whatsapp_connections, public.whatsapp_messages to service_role;

commit;
