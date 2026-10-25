# Supabase setup (PivotOS)

## Pivot OS V3

Primary app: **Next.js** (`npm run dev` → http://localhost:3000)

The Vite prototype under `src/` is archive only and is not part of the production build.

### Current accounts and access

Confirmed project: `xikwbkcdbfscnijlfwjw` (owner-confirmed 2026-10-25). Pivot remains private, with team invitations deferred. Migration `0018_accounts_and_business_roles.sql` and the matching isolation checks are applied and verified. See [Accounts and access](../plan/auth/ACCOUNTS_AND_ACCESS.md) for live configuration, release status and remaining email-delivery setup. The historical migration walkthrough below predates the active front-door schema; do not replay prototype seed migrations into production.

`0011_seed_pivot_os_demo.sql` is a development seed. It must not be treated as production data.

### Env

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

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

