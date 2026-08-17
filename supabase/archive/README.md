# Archive

Bulk imports and demo seeds that must not be treated as live product schema.

- `0008_import_dj_werk_full.sql` remains in `supabase/migrations/` only because it may already be applied. Do not re-run it against production. Copy here before any new environment is created from scratch.
- `0011_seed_pivot_os_demo.sql` is a development helper (`seed_pivot_os_demo`). The Settings restore button is labelled development-only.
