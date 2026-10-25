begin;
create table public.meeting_connections (
  owner_id uuid not null references auth.users(id),
  provider text not null check (provider in ('google_calendar','whatsapp')),
  account_email text,
  encrypted_credentials text not null,
  configuration jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (owner_id,provider)
);
create table public.meeting_calendar_bindings (
  owner_id uuid not null references auth.users(id),
  company text not null check (company in ('personal','digikraal','farm-feed','northpoint')),
  calendar_id text not null,
  approved_readers text[] not null default '{}',
  reviewed_at timestamptz not null default now(),
  primary key (owner_id,company),
  unique (owner_id,calendar_id),
  check (company <> 'personal' or cardinality(approved_readers) = 0)
);
alter table public.meeting_connections enable row level security;
alter table public.meeting_calendar_bindings enable row level security;
-- Even the authenticated owner cannot fetch credential ciphertext directly.
revoke all on public.meeting_connections,public.meeting_calendar_bindings from public,anon,authenticated;
grant all on public.meeting_connections,public.meeting_calendar_bindings to service_role;
commit;
