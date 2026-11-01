-- WhatsApp inbox product tables: contacts/teach memory, media, drafts, conversation read state.
-- Retention duration undecided: no automatic media deletion policy.
-- Groups under coexistence remain not-supported at product layer; rows may still be retained as evidence.
begin;

alter table public.whatsapp_messages
  add column if not exists group_id text,
  add column if not exists group_support text not null default 'n/a'
    check (group_support in ('supported', 'not-supported', 'n/a', 'unverified')),
  add column if not exists webhook_field text not null default 'messages';

alter table public.whatsapp_messages drop constraint if exists whatsapp_messages_direction_check;
alter table public.whatsapp_messages
  add constraint whatsapp_messages_direction_check
  check (direction in ('inbound', 'outbound', 'echo'));

create table if not exists public.whatsapp_conversations (
  id text primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('direct', 'group')),
  contact_key text not null,
  display_name text not null default '',
  group_id text,
  context text check (context is null or context in ('digikraal', 'farm-feed', 'northpoint', 'lebab', 'dj-eksteen')),
  privacy text not null check (privacy in ('founder-private', 'company-visible', 'needs-clarification')),
  unread_count integer not null default 0 check (unread_count >= 0),
  opened_at timestamptz,
  read_at timestamptz,
  group_support text not null default 'n/a'
    check (group_support in ('supported', 'not-supported', 'n/a', 'unverified')),
  sync_note text not null default '',
  updated_at timestamptz not null default now(),
  unique (owner_id, kind, contact_key)
);

create table if not exists public.whatsapp_teach_memory (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  contact_key text not null,
  context text check (context is null or context in ('digikraal', 'farm-feed', 'northpoint', 'lebab', 'dj-eksteen')),
  kind text not null check (kind in ('relationship', 'communication-preference', 'tone', 'handling-instruction', 'goal', 'fact')),
  body text not null,
  source text not null check (source in ('explicit-teaching', 'draft-correction', 'ai-suggestion')),
  confirmed boolean not null default false,
  active boolean not null default true,
  superseded_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists whatsapp_teach_memory_owner_contact_idx
  on public.whatsapp_teach_memory (owner_id, contact_key, active);

create table if not exists public.whatsapp_media (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  message_id uuid,
  contact_key text not null,
  mime_type text not null default 'application/octet-stream',
  kind text not null check (kind in ('image', 'audio', 'document', 'video', 'sticker', 'unknown')),
  storage_path text not null,
  bucket text not null default 'whatsapp-media' check (bucket = 'whatsapp-media'),
  privacy text not null default 'founder-private' check (privacy = 'founder-private'),
  retained_independently boolean not null default true check (retained_independently = true),
  drive_copy_status text not null default 'not-suggested'
    check (drive_copy_status in ('not-suggested', 'suggested', 'approved-pending-copy', 'copied', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.whatsapp_media_drafts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  media_id uuid not null references public.whatsapp_media (id) on delete cascade,
  kind text not null check (kind in ('livestock-listing', 'lead', 'deal', 'task')),
  title text not null,
  summary text not null,
  context text check (context is null or context in ('digikraal', 'farm-feed', 'northpoint', 'lebab', 'dj-eksteen')),
  module_hint text not null default 'general',
  status text not null default 'suggested' check (status in ('suggested', 'approved', 'rejected')),
  executes boolean not null default false check (executes = false),
  created_at timestamptz not null default now()
);

create table if not exists public.whatsapp_transcripts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  message_id text not null,
  original_language text not null default 'undetected',
  original_text text not null default '',
  summary text not null default '',
  uncertain boolean not null default true,
  status text not null check (status in ('pending', 'ready', 'failed', 'disconnected')),
  provider text not null default 'none',
  created_at timestamptz not null default now()
);

alter table public.whatsapp_conversations enable row level security;
alter table public.whatsapp_teach_memory enable row level security;
alter table public.whatsapp_media enable row level security;
alter table public.whatsapp_media_drafts enable row level security;
alter table public.whatsapp_transcripts enable row level security;

drop policy if exists whatsapp_conversations_owner on public.whatsapp_conversations;
create policy whatsapp_conversations_owner on public.whatsapp_conversations
for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists whatsapp_teach_memory_owner on public.whatsapp_teach_memory;
create policy whatsapp_teach_memory_owner on public.whatsapp_teach_memory
for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists whatsapp_media_owner on public.whatsapp_media;
create policy whatsapp_media_owner on public.whatsapp_media
for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists whatsapp_media_drafts_owner on public.whatsapp_media_drafts;
create policy whatsapp_media_drafts_owner on public.whatsapp_media_drafts
for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists whatsapp_transcripts_owner on public.whatsapp_transcripts;
create policy whatsapp_transcripts_owner on public.whatsapp_transcripts
for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

revoke all on public.whatsapp_conversations, public.whatsapp_teach_memory, public.whatsapp_media, public.whatsapp_media_drafts, public.whatsapp_transcripts from public, anon;
grant select, insert, update, delete on public.whatsapp_conversations, public.whatsapp_teach_memory, public.whatsapp_media, public.whatsapp_media_drafts, public.whatsapp_transcripts to authenticated;
grant all on public.whatsapp_conversations, public.whatsapp_teach_memory, public.whatsapp_media, public.whatsapp_media_drafts, public.whatsapp_transcripts to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'whatsapp-media',
  'whatsapp-media',
  false,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'audio/ogg', 'audio/mpeg', 'audio/mp4', 'video/mp4', 'application/pdf', 'application/octet-stream']
)
on conflict (id) do nothing;

drop policy if exists whatsapp_media_server_only on storage.objects;
create policy whatsapp_media_server_only on storage.objects as restrictive
for all to authenticated, anon
using (bucket_id <> 'whatsapp-media')
with check (bucket_id <> 'whatsapp-media');

commit;
