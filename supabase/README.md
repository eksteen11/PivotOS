# Supabase setup (PivotOS V1)

## 1) Create project
- Create a Supabase project (any name) and keep it in the same region you prefer.

## 2) Run migrations
- In Supabase Dashboard → SQL Editor, run these files in order:
  - `supabase/migrations/0001_init.sql`
  - `supabase/migrations/0002_seed_new_user.sql`
  - `supabase/migrations/0003_outbox_on_item_change.sql`
  - `supabase/migrations/0004_entity_memberships_and_rls.sql`
  - `supabase/migrations/0005_seed_dj_werk_meetings.sql` — seeds realistic `meeting` items (DJ Werk 2026 sheet) per user; re-runnable.
  - `supabase/migrations/0006_workstreams_and_activities.sql` — adds the `workstreams` layer and universal Activity fields (`workstream_id`, `source`, `owner`, `value`) on `items`.
  - `supabase/migrations/0007_seed_real_structure.sql` — seeds the real entity/division/workstream taxonomy + sample activities per user; re-runnable.

Or locally: `supabase db push` from the `pivotos` folder if the Supabase CLI is linked to this project.

## 3) Get client env vars
- Project Settings → API:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Put them into a local `.env` (copy from `.env.example`).

