# Supabase setup (PivotOS V1)

## 1) Create project
- Create a Supabase project (any name) and keep it in the same region you prefer.

## 2) Run migrations
- In Supabase Dashboard → SQL Editor, run these files in order:
  - `supabase/migrations/0001_init.sql`
  - `supabase/migrations/0002_seed_new_user.sql`
  - `supabase/migrations/0003_outbox_on_item_change.sql`

## 3) Get client env vars
- Project Settings → API:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Put them into a local `.env` (copy from `.env.example`).

