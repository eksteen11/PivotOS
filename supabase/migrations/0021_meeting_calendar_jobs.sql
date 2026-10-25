begin;
create table public.meeting_calendar_jobs (
  meeting_id uuid primary key references public.items(id),
  owner_id uuid not null references auth.users(id),
  generation bigint not null default 1,
  state text not null default 'pending' check (state in ('pending','running','synced','blocked','conflict','failed')),
  lease_until timestamptz,
  lease_token uuid,
  next_attempt_at timestamptz not null default now(),
  attempts integer not null default 0,
  error text,
  synced_at timestamptz
);
create table public.meeting_calendar_links (
  meeting_id uuid not null references public.items(id),
  owner_id uuid not null references auth.users(id),
  company text not null,
  calendar_id text not null,
  event_id text not null,
  etag text not null,
  local_fingerprint text not null,
  deleted boolean not null default false,
  primary key (meeting_id,calendar_id)
);
alter table public.meeting_calendar_jobs enable row level security;
alter table public.meeting_calendar_links enable row level security;
revoke all on public.meeting_calendar_jobs,public.meeting_calendar_links from public,anon,authenticated;
grant all on public.meeting_calendar_jobs,public.meeting_calendar_links to service_role;

create function public.queue_meeting_calendar()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.type <> 'meeting' then return new; end if;
  if tg_op = 'UPDATE' and
    row(new.title,new.entity_id,new.deleted_at,new.meta #> '{meeting_core,schedule}',new.meta #> '{meeting_core,lifecycle}',new.meta #> '{meeting_core,company}',new.meta #> '{meeting_core,place}',new.meta #> '{meeting_core,link}')
    is not distinct from
    row(old.title,old.entity_id,old.deleted_at,old.meta #> '{meeting_core,schedule}',old.meta #> '{meeting_core,lifecycle}',old.meta #> '{meeting_core,company}',old.meta #> '{meeting_core,place}',old.meta #> '{meeting_core,link}') then return new; end if;
  insert into public.meeting_calendar_jobs(meeting_id,owner_id) values(new.id,new.user_id)
  on conflict(meeting_id) do update set generation = public.meeting_calendar_jobs.generation + 1,
    state='pending', next_attempt_at=now(), attempts=0, error=null;
  return new;
end;
$$;
create trigger queue_meeting_calendar after insert or update on public.items for each row execute function public.queue_meeting_calendar();
insert into public.meeting_calendar_jobs(meeting_id,owner_id) select id,user_id from public.items where type='meeting' and deleted_at is null;
revoke all on function public.queue_meeting_calendar() from public,anon,authenticated;
create index meeting_calendar_due on public.meeting_calendar_jobs(next_attempt_at);
commit;
