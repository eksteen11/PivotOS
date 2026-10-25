-- Private audio assets are separate from meeting JSON. No collaboration grants.
begin;
create table public.meeting_recordings (
  id uuid primary key,
  owner_id uuid not null references auth.users(id),
  meeting_id uuid not null references public.items(id),
  state text not null default 'capturing' check (state in ('capturing','complete','interrupted','deleting','deleted')),
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  duration_ms integer not null default 0 check (duration_ms between 0 and 7200000),
  first_approved_at timestamptz,
  expires_at timestamptz,
  deleted_at timestamptz,
  upload_lease_until timestamptz,
  constraint recording_retention check (
    (first_approved_at is null and expires_at is null) or
    (first_approved_at is not null and expires_at = first_approved_at + interval '30 days')
  )
);
create table public.meeting_recording_segments (
  recording_id uuid not null references public.meeting_recordings(id),
  sequence integer not null check (sequence between 0 and 719),
  duration_ms integer not null check (duration_ms between 1 and 120000),
  bytes integer not null check (bytes between 1 and 3145728),
  mime text not null check (mime in ('audio/webm','audio/mp4','audio/ogg')),
  sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
  storage_path text not null unique,
  uploaded boolean not null default false,
  transcript text,
  transcription_state text not null default 'pending' check (transcription_state in ('pending','running','complete','failed')),
  attempts integer not null default 0,
  lease_until timestamptz,
  last_error text,
  primary key (recording_id, sequence)
);
create table public.meeting_recording_deletions (
  recording_id uuid primary key references public.meeting_recordings(id),
  owner_id uuid not null references auth.users(id),
  deleted_at timestamptz not null default now(),
  reason text not null check (reason = 'approved_minutes_retention'),
  object_count integer not null
);
alter table public.meeting_recordings enable row level security;
alter table public.meeting_recording_segments enable row level security;
alter table public.meeting_recording_deletions enable row level security;
revoke all on public.meeting_recordings, public.meeting_recording_segments, public.meeting_recording_deletions from public, anon, authenticated;
grant select on public.meeting_recordings, public.meeting_recording_segments, public.meeting_recording_deletions to authenticated;
grant all on public.meeting_recordings, public.meeting_recording_segments, public.meeting_recording_deletions to service_role;
create policy recording_private_read on public.meeting_recordings for select to authenticated using (
  owner_id = (select auth.uid()) and exists (
    select 1 from public.items i join public.profiles p on p.user_id = i.user_id
    where i.id = meeting_id and i.user_id = (select auth.uid()) and i.type = 'meeting'
      and i.deleted_at is null and p.role = 'founder'
  )
);
create policy recording_segment_private_read on public.meeting_recording_segments for select to authenticated using (
  exists (select 1 from public.meeting_recordings r where r.id = recording_id)
);
create policy recording_deletion_private_read on public.meeting_recording_deletions for select to authenticated using (owner_id = (select auth.uid()));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('meeting-recordings','meeting-recordings',false,3145728,array['audio/webm','audio/mp4','audio/ogg']);
-- Deny direct access even if a legacy permissive policy covers all buckets.
-- The scoped server APIs use service_role; signed playback is short-lived.
create policy meeting_recordings_server_only on storage.objects as restrictive
for all to anon, authenticated
using (bucket_id <> 'meeting-recordings')
with check (bucket_id <> 'meeting-recordings');

create function public.guard_meeting_recording_insert()
returns trigger language plpgsql set search_path = '' as $$
declare meeting public.items;
begin
  select * into meeting from public.items where id = new.meeting_id for update;
  if not found or meeting.type <> 'meeting' or meeting.user_id <> new.owner_id or meeting.deleted_at is not null then
    raise exception 'Meeting not found';
  end if;
  if meeting.meta #>> '{meeting_core,approvedRevision}' is not null or meeting.meta #>> '{meeting_core,reviewClaim,phase}' = 'pending' then
    raise exception 'Start a new minutes review before adding another recording';
  end if;
  return new;
end;
$$;
create trigger guard_meeting_recording_insert before insert on public.meeting_recordings
for each row execute function public.guard_meeting_recording_insert();

create function public.anchor_meeting_recording_retention()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.type = 'meeting' and new.meta #>> '{meeting_core,approvedRevision}' is not null
    and new.meta #>> '{meeting_core,reviewClaim,phase}' = 'committed' then
    update public.meeting_recordings set first_approved_at = now(), expires_at = now() + interval '30 days'
    where meeting_id = new.id and owner_id = new.user_id and first_approved_at is null;
  end if;
  return new;
end;
$$;
create trigger anchor_meeting_recording_retention after update of meta on public.items
for each row execute function public.anchor_meeting_recording_retention();

create function public.reserve_meeting_recording_segment(
  recording uuid, owner uuid, seq integer, duration integer, size_bytes integer, content_mime text, digest text
) returns public.meeting_recording_segments language plpgsql set search_path = '' as $$
declare r public.meeting_recordings; existing public.meeting_recording_segments; result public.meeting_recording_segments;
begin
  select * into r from public.meeting_recordings where id = recording and owner_id = owner for update;
  if not found or r.state <> 'capturing' or (r.expires_at is not null and r.expires_at <= now()) then raise exception 'Recording is not open'; end if;
  select * into existing from public.meeting_recording_segments where recording_id = recording and sequence = seq;
  if found then
    update public.meeting_recordings set upload_lease_until = now() + interval '2 minutes' where id = recording;
    if existing.sha256 <> digest or existing.duration_ms <> duration or existing.bytes <> size_bytes or existing.mime <> content_mime then
      raise exception 'A different segment is already saved';
    end if;
    return existing;
  end if;
  if r.duration_ms + duration > 7200000 then raise exception 'Two hour recording limit reached'; end if;
  insert into public.meeting_recording_segments(recording_id,sequence,duration_ms,bytes,mime,sha256,storage_path)
  values(recording,seq,duration,size_bytes,content_mime,digest,owner::text || '/' || r.meeting_id::text || '/' || recording::text || '/' || seq::text)
  returning * into result;
  update public.meeting_recordings set duration_ms = duration_ms + duration, upload_lease_until = now() + interval '2 minutes' where id = recording;
  return result;
end;
$$;
create function public.finish_meeting_recording(recording uuid, owner uuid, segment_count integer)
returns void language plpgsql set search_path = '' as $$
declare r public.meeting_recordings; n integer; max_seq integer;
begin
  select * into r from public.meeting_recordings where id = recording and owner_id = owner for update;
  if not found or r.state in ('deleting','deleted') then raise exception 'Recording not found'; end if;
  select count(*), max(sequence) into n,max_seq from public.meeting_recording_segments where recording_id = recording and uploaded;
  if segment_count < 1 or n <> segment_count or max_seq <> segment_count - 1
    or exists (select 1 from public.meeting_recording_segments where recording_id = recording and not uploaded) then
    raise exception 'Recording still has missing segments';
  end if;
  update public.meeting_recordings set state = 'complete' where id = recording;
end;
$$;
revoke all on function public.guard_meeting_recording_insert(), public.anchor_meeting_recording_retention(),
  public.reserve_meeting_recording_segment(uuid,uuid,integer,integer,integer,text,text), public.finish_meeting_recording(uuid,uuid,integer) from public, anon, authenticated;
grant execute on function public.reserve_meeting_recording_segment(uuid,uuid,integer,integer,integer,text,text),
  public.finish_meeting_recording(uuid,uuid,integer) to service_role;
create index meeting_recordings_retention on public.meeting_recordings(expires_at) where deleted_at is null;
create index meeting_recording_pending on public.meeting_recording_segments(transcription_state,lease_until) where uploaded;
commit;
