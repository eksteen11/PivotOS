begin;
create table public.meeting_reminder_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  meeting_id uuid not null references public.items(id),
  kind text not null check (kind in ('preparation','start')),
  meeting_start timestamptz not null,
  due_at timestamptz not null,
  state text not null default 'pending' check (state in ('pending','unavailable','sending','accepted','delivered','failed','uncertain','cancelled','expired')),
  attempts integer not null default 0,
  lease_until timestamptz,
  provider_message_id text unique,
  sender_id text,
  recipient text,
  error text,
  delivered_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(meeting_id,kind,meeting_start)
);
alter table public.meeting_reminder_jobs enable row level security;
revoke all on public.meeting_reminder_jobs from public,anon,authenticated;
grant all on public.meeting_reminder_jobs to service_role;
create function public.queue_meeting_reminders()
returns trigger language plpgsql security definer set search_path = '' as $$
declare starts timestamptz;
begin
  if new.type <> 'meeting' then return new; end if;
  if tg_op = 'UPDATE' and
    row(new.deleted_at,new.meta #> '{meeting_core,schedule}',new.meta #> '{meeting_core,reminders}',new.meta #> '{meeting_core,company}',new.meta #>> '{meeting_core,lifecycle}' in ('cancelled','to_arrange','closed'))
    is not distinct from
    row(old.deleted_at,old.meta #> '{meeting_core,schedule}',old.meta #> '{meeting_core,reminders}',old.meta #> '{meeting_core,company}',old.meta #>> '{meeting_core,lifecycle}' in ('cancelled','to_arrange','closed')) then return new; end if;
  update public.meeting_reminder_jobs set state='cancelled', updated_at=now()
  where meeting_id=new.id and state in ('pending','unavailable','failed');
  if new.deleted_at is not null or new.meta #>> '{meeting_core,lifecycle}' in ('cancelled','to_arrange','closed')
    or new.meta #>> '{meeting_core,schedule,confirmed}' is distinct from 'true' then return new; end if;
  begin
    starts := (new.meta #>> '{meeting_core,schedule,startAt}')::timestamp at time zone 'Africa/Johannesburg';
  exception when others then return new;
  end;
  if starts is null then return new; end if;
  insert into public.meeting_reminder_jobs(owner_id,meeting_id,kind,meeting_start,due_at)
  values(new.user_id,new.id,'preparation',starts,starts - coalesce((new.meta #>> '{meeting_core,reminders,preparationMinutes}')::integer,1440) * interval '1 minute'),
        (new.user_id,new.id,'start',starts,starts - coalesce((new.meta #>> '{meeting_core,reminders,startMinutes}')::integer,30) * interval '1 minute')
  on conflict(meeting_id,kind,meeting_start) do update set state='pending', attempts=0, due_at=excluded.due_at, error=null, updated_at=now()
    where public.meeting_reminder_jobs.state='cancelled';
  return new;
end;
$$;
create trigger queue_meeting_reminders after insert or update on public.items for each row execute function public.queue_meeting_reminders();
revoke all on function public.queue_meeting_reminders() from public,anon,authenticated;
create index meeting_reminder_due on public.meeting_reminder_jobs(due_at) where state in ('pending','unavailable','sending');
-- Preserve existing meetings: upcoming confirmed schedules also receive jobs.
do $$
declare meeting record; starts timestamptz;
begin
  for meeting in select id,user_id,meta from public.items where type='meeting' and deleted_at is null
    and meta #>> '{meeting_core,schedule,confirmed}' = 'true'
    and meta #>> '{meeting_core,lifecycle}' not in ('cancelled','to_arrange','closed') loop
    begin
      starts := (meeting.meta #>> '{meeting_core,schedule,startAt}')::timestamp at time zone 'Africa/Johannesburg';
    exception when others then continue;
    end;
    if starts is null or starts <= now() then continue; end if;
    insert into public.meeting_reminder_jobs(owner_id,meeting_id,kind,meeting_start,due_at)
    values(meeting.user_id,meeting.id,'preparation',starts,starts - interval '1 day'),
          (meeting.user_id,meeting.id,'start',starts,starts - interval '30 minutes')
    on conflict(meeting_id,kind,meeting_start) do nothing;
  end loop;
end;
$$;
commit;
