// Isolated PostgreSQL integration test. No production credentials or data.
// npm install --prefix /tmp/pivot-meeting-db-check @electric-sql/pglite
// PIVOT_TEST_PGLITE=/tmp/pivot-meeting-db-check/node_modules/@electric-sql/pglite/dist/index.js node scripts/test-meeting-recordings-db.mjs
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const { PGlite } = await import(process.env.PIVOT_TEST_PGLITE || '@electric-sql/pglite')
const db = new PGlite()
const owner = '11111111-1111-4111-8111-111111111111'
const other = '22222222-2222-4222-8222-222222222222'
const meeting = '33333333-3333-4333-8333-333333333333'
const recording = '44444444-4444-4444-8444-444444444444'
const digest = 'a'.repeat(64)
let assertions = 0
const check = (value, expected) => { assert.deepEqual(value, expected); assertions++ }
async function rejects(sql, values = []) { await assert.rejects(db.query(sql, values)); assertions++ }
await db.exec(`
  create role anon; create role authenticated; create role service_role bypassrls;
  create schema auth; create schema storage;
  create table auth.users(id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
  create table public.profiles(user_id uuid primary key, role text);
  create table public.items(id uuid primary key, user_id uuid, entity_id uuid, type text, deleted_at timestamptz, meta jsonb default '{}');
  create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
  create table storage.objects(bucket_id text,name text);
  alter table storage.objects enable row level security;
  create policy legacy_storage_all on storage.objects for all to anon,authenticated using (true) with check (true);
  grant usage on schema storage to anon,authenticated;
  grant select,insert on storage.objects to anon,authenticated;
  grant usage on schema public,auth to authenticated,service_role;
  grant select on public.items,public.profiles to authenticated;
  grant all on public.items,public.profiles to service_role;
`)
await db.exec(await readFile('supabase/migrations/0019_meeting_recordings.sql', 'utf8'))
await db.exec(await readFile('supabase/migrations/0020_meeting_connections.sql', 'utf8'))
await db.exec('alter table public.items add column title text;')
await db.exec(await readFile('supabase/migrations/0021_meeting_calendar_jobs.sql', 'utf8'))
await db.query('insert into auth.users values ($1),($2)', [owner, other])
await db.query("insert into profiles values ($1,'founder'),($2,'coworker')", [owner, other])
await db.query("insert into items(id,user_id,type) values ($1,$2,'meeting')", [meeting, owner])
const seededMeeting = '66666666-6666-4666-8666-666666666666'
await db.query(`insert into items(id,user_id,type,meta) values ($1,$2,'meeting','{"meeting_core":{"company":"digikraal","lifecycle":"scheduled","schedule":{"confirmed":true,"startAt":"2090-10-28T08:00","endAt":"2090-10-28T09:00"}}}')`, [seededMeeting, owner])
await db.exec(await readFile('supabase/migrations/0022_meeting_reminders.sql', 'utf8'))
check((await db.query('select count(*)::int as n from meeting_reminder_jobs where meeting_id=$1', [seededMeeting])).rows[0].n, 2)

await db.query('insert into meeting_recordings(id,owner_id,meeting_id) values ($1,$2,$3)', [recording, owner, meeting])
await db.query("select set_config('request.jwt.claim.sub',$1,false)", [owner])
await db.exec("insert into storage.objects values ('meeting-recordings','private-audio'),('unrelated-bucket','other-file'); set role authenticated")
check((await db.query('select id from meeting_recordings')).rows.length, 1)
check((await db.query('select name from storage.objects')).rows, [{ name: 'other-file' }])
await rejects("insert into storage.objects values ('meeting-recordings','blocked-upload')")
await rejects('insert into meeting_recordings(id,owner_id,meeting_id) values (gen_random_uuid(),$1,$2)', [owner, meeting])
await rejects('select public.reserve_meeting_recording_segment($1,$2,0,30000,100,\'audio/webm\',$3)', [recording, owner, digest])
await rejects('select * from meeting_connections')
await db.query("select set_config('request.jwt.claim.sub',$1,false)", [other])
check((await db.query('select id from meeting_recordings')).rows.length, 0)
check((await db.query('select * from meeting_recording_segments')).rows.length, 0)
await db.exec('reset role')
await rejects('insert into meeting_recordings(id,owner_id,meeting_id) values (gen_random_uuid(),$1,$2)', [other, meeting])
await db.exec('set role service_role')
const reserve = (seq, duration = 30_000, hash = digest) => db.query('select * from public.reserve_meeting_recording_segment($1,$2,$3,$4,100,\'audio/webm\',$5)', [recording, owner, seq, duration, hash])
await reserve(0)
await reserve(0)
check((await db.query('select duration_ms from meeting_recordings where id=$1', [recording])).rows[0].duration_ms, 30_000)
await assert.rejects(reserve(0, 30_000, 'b'.repeat(64))); assertions++
await rejects('select * from public.reserve_meeting_recording_segment($1,$2,1,30000,100,\'audio/webm\',$3)', [recording, other, digest])
await reserve(2)
await db.query('update meeting_recording_segments set uploaded=true where recording_id=$1', [recording])
await rejects('select public.finish_meeting_recording($1,$2,2)', [recording, owner])
await reserve(1)
await db.query('update meeting_recording_segments set uploaded=true where recording_id=$1', [recording])
await db.query('select public.finish_meeting_recording($1,$2,3)', [recording, owner])
await db.query('select public.finish_meeting_recording($1,$2,3)', [recording, owner])
check((await db.query('select state from meeting_recordings where id=$1', [recording])).rows[0].state, 'complete')
await assert.rejects(reserve(3)); assertions++
await db.query(`update items set meta='{"meeting_core":{"approvedRevision":1,"reviewClaim":{"phase":"committed"}}}' where id=$1`, [meeting])
const first = (await db.query('select first_approved_at,expires_at from meeting_recordings where id=$1', [recording])).rows[0]
check(new Date(first.expires_at) - new Date(first.first_approved_at), 30 * 86400_000)
await db.query(`update items set meta='{"meeting_core":{"approvedRevision":null}}' where id=$1`, [meeting])
await db.query(`update items set meta='{"meeting_core":{"approvedRevision":2,"reviewClaim":{"phase":"committed"}}}' where id=$1`, [meeting])
check((await db.query('select first_approved_at,expires_at from meeting_recordings where id=$1', [recording])).rows[0], first)
await rejects('insert into meeting_recordings(id,owner_id,meeting_id) values (gen_random_uuid(),$1,$2)', [owner, meeting])
await db.query('update items set meta=\'{}\' where id=$1', [meeting])
const long = '55555555-5555-4555-8555-555555555555'
await db.query('insert into meeting_recordings(id,owner_id,meeting_id) values ($1,$2,$3)', [long, owner, meeting])
for (let seq = 0; seq < 60; seq++) await db.query('select public.reserve_meeting_recording_segment($1,$2,$3,120000,100,\'audio/webm\',$4)', [long, owner, seq, digest])
check((await db.query('select duration_ms from meeting_recordings where id=$1', [long])).rows[0].duration_ms, 7_200_000)
await rejects('select public.reserve_meeting_recording_segment($1,$2,60,1,100,\'audio/webm\',$3)', [long, owner, digest])
check((await db.query('select expires_at from meeting_recordings where id=$1', [long])).rows[0].expires_at, null)
// The same meeting drives durable calendar and reminder queues.
await db.query(`update items set meta='{"meeting_core":{"company":"digikraal","lifecycle":"scheduled","schedule":{"confirmed":true,"startAt":"2030-10-28T08:00","endAt":"2030-10-28T09:00"}}}' where id=$1`, [meeting])
const generation = (await db.query('select generation from meeting_calendar_jobs where meeting_id=$1', [meeting])).rows[0].generation
const scheduled = (await db.query('select kind,meeting_start,due_at,state from meeting_reminder_jobs where meeting_id=$1 order by kind', [meeting])).rows
check(scheduled.length, 2)
check(scheduled.map(row => new Date(row.meeting_start) - new Date(row.due_at)), [86400_000, 1800_000])
await db.query(`update items set meta=jsonb_set(meta,'{meeting_core,liveNotes}','"Private note"'::jsonb) where id=$1`, [meeting])
check((await db.query('select generation from meeting_calendar_jobs where meeting_id=$1', [meeting])).rows[0].generation, generation)
check((await db.query('select count(*)::int as n from meeting_reminder_jobs where meeting_id=$1', [meeting])).rows[0].n, 2)
await db.query(`update items set meta=jsonb_set(meta,'{meeting_core,lifecycle}','"cancelled"'::jsonb) where id=$1`, [meeting])
check((await db.query('select distinct state from meeting_reminder_jobs where meeting_id=$1', [meeting])).rows, [{ state: 'cancelled' }])
await db.query(`update items set meta=jsonb_set(meta,'{meeting_core,lifecycle}','"scheduled"'::jsonb) where id=$1`, [meeting])
check((await db.query('select distinct state from meeting_reminder_jobs where meeting_id=$1', [meeting])).rows, [{ state: 'pending' }])
await db.query("update meeting_reminder_jobs set state='delivered' where meeting_id=$1 and kind='start'", [meeting])
await db.query(`update items set meta=jsonb_set(meta,'{meeting_core,lifecycle}','"cancelled"'::jsonb) where id=$1`, [meeting])
await db.query(`update items set meta=jsonb_set(meta,'{meeting_core,lifecycle}','"scheduled"'::jsonb) where id=$1`, [meeting])
check((await db.query("select state from meeting_reminder_jobs where meeting_id=$1 and kind='start'", [meeting])).rows[0].state, 'delivered')
await db.query(`update items set meta=jsonb_set(meta,'{meeting_core,reminders}','{"preparationMinutes":2880,"startMinutes":60}'::jsonb) where id=$1`, [meeting])
check((await db.query("select extract(epoch from (meeting_start-due_at))::int as seconds from meeting_reminder_jobs where meeting_id=$1 and kind='preparation'", [meeting])).rows[0].seconds, 172800)
await db.exec('reset role; set role anon')
await rejects('select * from meeting_recordings')
check((await db.query('select name from storage.objects')).rows, [{ name: 'other-file' }])
await db.exec('reset role')
check((await db.query("select public from storage.buckets where id='meeting-recordings'")).rows[0].public, false)
console.log(`Recording database checks passed (${assertions} assertions): ownership, privileges, duplicate uploads, missing segments, two-hour limit, retention and private storage.`)
await db.close()
