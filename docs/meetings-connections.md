# 001 Meetings: private recording and connection setup

This implementation is local until released. Passing synthetic tests does not
mean Google, WhatsApp, storage or the scheduler is connected in production.
The existing founder-only access model stays closed to collaborators.

## Architecture

The module lives under `lib/meetings`, with narrow host adapters for Pivot
identity, catalogue, items/tasks, Supabase storage and provider credentials.
Recording contracts, calendar projection/sync, and reminder state transitions
are separate from the workspace UI. A future standalone host must provide its
own tenant-aware identity and persistence adapters; this is not yet a standalone
SaaS authentication system. Never enable collaboration by simply relaxing an
owner check or storage policy.

Meeting workflow/minutes remain in Pivot. Calendar receives only the meeting
title, exact start/end and place/link. It never receives notes, transcripts,
minutes, audio, attendee lists, or other companies' availability. Automatic
Calendar operations use `sendUpdates=none`. Invitations require a separate
reviewed implementation and are not sent by these routes.

Each company binds to a different owner-controlled Google calendar. ACLs are
checked at binding and before publication: reject public, domain, group,
unapproved-user and anonymous free/busy access. Personal permits only the
connected owner. Binding never creates or changes sharing grants.

## Database and storage

Review/apply migrations in order, including the earlier account migration when
not already applied:

- `0018_accounts_and_business_roles.sql`
- `0019_meeting_recordings.sql`
- `0020_meeting_connections.sql`
- `0021_meeting_calendar_jobs.sql`
- `0022_meeting_reminders.sql`

No migration in this build has been applied to the live database by this chat.
Back up and review the target migration history before a release.

The recording bucket is private. Authenticated storage access is not granted;
scoped APIs verify the signed-in founder and meeting ownership before creating
a privileged storage client. Recording metadata/transcripts are founder-owned;
credentials, queues and provider links are service-only. Never expose the
service role key in a browser bundle. Secrets are not returned by status APIs.

Audio uses independently playable segments, stored outside meeting JSON.
Immutable hashes make upload retries safe. Completion requires a contiguous,
fully acknowledged manifest. A two-hour accumulated duration limit is enforced
in PostgreSQL. The browser uses IndexedDB and a per-account/meeting tab lock;
successful server receipts release local audio blobs. Pausing ends a segment;
resuming starts another. Tab navigation within the workspace keeps capture alive.

Keep the page/device awake. Browser/device suspension or a crash may lose the
current segment (normally at most 30 seconds while active). Oversized segments
after prolonged suspension are kept locally but cannot pass the 3 MB upload
limit; this recovery case still needs an export/import path. Mobile Safari and
actual two-hour device recordings require physical-device acceptance testing.

The first committed minutes approval anchors each recording's deletion deadline
at 30 days; reopening/reapproving minutes does not extend it. No approval means
no automatic expiry. A storage deletion worker records an audit only after
Storage API removal succeeds; database metadata alone is never treated as audio
deletion. A bounded upload lease prevents cleanup racing an in-flight upload.
Approved minutes/transcripts are retained. Browser recovery copies that never
reach the server require separate device retention work; server cleanup cannot
erase an offline browser's storage.

## Google setup

Set the server-only values shown in `.env.example`:

- Supabase URL, anon key and service role key.
- `MEETINGS_APP_ORIGIN`: exact app origin, HTTPS except localhost development.
- `MEETINGS_TOKEN_KEY`: base64 of 32 random bytes, stored securely and backed up.
- `MEETINGS_GOOGLE_CLIENT_ID` and `MEETINGS_GOOGLE_CLIENT_SECRET`.
- `MEETINGS_GOOGLE_ACCOUNT`: the account reviewed by the founder.

Create a Google web OAuth client with this exact redirect URI:
`<app-origin>/api/meetings/calendar/callback`. Enable Calendar API and configure
the consent screen/test user appropriately. The module asks for owned-event
access plus read-only calendar-list/ACL access, `openid` and email. OAuth uses
state, a short-lived HttpOnly cookie, PKCE and verified account identity. Only
encrypted refresh credentials are persisted; encryption is bound to the owner.

From a meeting's Overview, open **Calendar & reminders**, connect Google, then
choose the company calendar and explicitly review its existing readers.
Create any missing company calendars manually in Google first. Sharing changes
still need named recipients and permissions; this module does not grant them.

The worker persists event IDs/ETags and uses conditional updates. It imports
exact Google schedule changes when Pivot's event projection has not changed.
All-day events, concurrent edits and changed sharing block automatic writes.
Cancellation and company reassignment remove the old company event first.
Current-company schedule conflicts have a reviewed choice in Overview to keep
Pivot or Google time, guarded by the reviewed meeting revision and Google ETag.
A conflict involving a previous company still needs separate reconciliation;
do not reset receipts manually or bypass ETag checks. Binding
replacement also deliberately blocks pending an explicit reconciliation flow.

## WhatsApp setup

The optional adapter targets Meta Cloud API. No sender number was migrated,
registered, purchased or reconfigured by this build. Verify provider eligibility,
Business App coexistence and sender ownership before using a real number.
The Meta adapter must pass live contract tests before activation.

Configure the corresponding server variables in `.env.example`, including the
exact host owner ID. Use a supported Graph API version and approved utility
templates for preparation/start reminders. Each template must accept exactly
three body text parameters: company, meeting title, local start time. Template
approval/shape must be checked with the provider during setup; the adapter does
not yet query template approval automatically.

Configure the provider webhook as:
`<app-origin>/api/meetings/reminders/webhook`, using the server verification
token and app secret. POST payloads require the provider HMAC signature.

In Overview enter the founder's own WhatsApp number and select **Verify my
reminder number**. The server verifies the configured business sender, then
issues a short-lived code. Send that code from the proposed recipient number to
the business sender. Only the signed inbound webhook activates that exact
recipient. Merely entering a number or clicking a checkbox cannot activate it.
No outbound verification message is sent by setup.

Reminders default to one day and 30 minutes before the meeting. Adjust them in
meeting details or a clarification reply. Schedule changes replace pending
jobs; delivered receipts are preserved. Outgoing sends are founder-only and
use approved templates. Provider acceptance is not displayed as delivery.
Signed delivery receipts reconcile accepted/uncertain sends. Unknown send
outcomes are not automatically resent, preventing duplicate messages after a
worker/network interruption. Failed/uncertain delivery currently needs operator
review; an explicit reviewed retry UI remains to build.

## Durable scheduler

Set a strong, independent `MEETINGS_JOB_SECRET`. Provision a real authenticated
scheduler to call each endpoint with `Authorization: Bearer <secret>`:

- `/api/meetings/calendar/jobs`: approximately once a minute; one meeting per run,
  synced meetings reconcile Google approximately every five minutes.
- `/api/meetings/reminders/jobs`: at least once a minute; one send per run.
- `/api/meetings/recordings/jobs`: approximately once a minute; one audio
  transcription segment plus bounded expired-audio cleanup per run.

No scheduler is provisioned by this build. Size worker frequency/concurrency to
queue volume, provider limits and the deployment runtime. One audio segment per
minute is slower than real-time capture and can leave a transcription backlog;
production throughput/load testing and worker concurrency need verification.
Multiple workers use persistent claims/leases; jobs survive browser closure.
Reminders more than five minutes late expire rather than sending stale alerts.
Monitor failed/blocked/uncertain jobs; do not claim delivery or deletion merely
because a cron definition exists. Recording transcription retries at most three
times before requiring the explicit retry control.

## Verification before release

Automated local coverage includes synthetic MediaRecorder capture, pause/resume,
view switching, failed upload and reload recovery; four-company calendar
privacy projections; encryption ownership; sync/reschedule/cancel/conflicts;
verified-recipient restrictions; and isolated PostgreSQL RLS/queue/retention
checks. The SQL checks use a temporary PGlite runtime and are reproducible via
the instructions in `scripts/test-meeting-recordings-db.mjs`.

Still required with real configured services:

1. Apply migrations to a safe test project; test actual Storage upload, signed
   playback, interrupted uploads and refusal from a second account.
2. Record up to two hours on supported physical phones/desktops. Test denied mic,
   device lock/suspension, quota exhaustion, interruption, recovery and playback.
3. Run actual segment transcription, inspect the full source text and typed
   corrections, then review minutes/actions and resulting work.
4. Connect Google; verify all four dedicated calendars and ACL rejection, create,
   reschedule, remote reschedule, cancellation, conflicts and company moves.
5. Verify the WhatsApp recipient with a signed inbound message; schedule and
   observe actual delivered/failed receipts, including a dropped send response.
6. Prove scheduler execution without an open browser, lease recovery, throughput
   and deletion at the approval-based deadline; inspect the deletion audit.
7. Review/release only the intended meeting files, preserve private plans and
   unrelated local changes, then run production acceptance. Do not label all of
   001 complete until those checks and the remaining workflow scope pass.

Reference contracts: [Google OAuth](https://developers.google.com/identity/protocols/oauth2/web-server),
[Calendar scopes](https://developers.google.com/workspace/calendar/api/auth),
[Calendar event writes](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert),
[Supabase Storage access](https://supabase.com/docs/guides/storage/security/access-control),
[MediaRecorder segments](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API),
[Meta webhook signature contract](https://whatsapp.github.io/WhatsApp-Nodejs-SDK/api-reference/webhooks/start/).
