# 09 — Schema baseline vs L0 / L1

**Status:** Phase 1 snapshot, 2026-08-16  
**Authority:** `plan/01_DOMAIN_MODEL.md`

This is the Gate 1 schema map. It does not invent new objects. It records what exists in Supabase today against the Constitution spine.

## Present now

| Domain object | Current table / shape | Notes |
|---|---|---|
| `user` | `auth.users` | Founder-first |
| `entity` | `entities` | DJ, Digikraal, Farm Feed, Northpoint |
| `legal_entity` | missing | Companies are `entities` only |
| `tenant` | missing | Single-tenant today. Isolation is `user_id` + `entity_id` |
| `agent` | `agents` | Present |
| `process` / steps | `processes`, `process_steps` | Present |
| `approval` | `approvals` | Present. Resolve via `resolve_my_approval` when applied |
| `audit_event` | `activity_logs` | Insert-only. App routes now fail closed if insert fails |
| `inbox item` | `items` where `status = inbox` | Classification lives in `meta` JSON |
| `meeting` | `items` where `type = meeting` | No calendar provider |
| `contact` | `contacts` | Thin directory |
| `document` | `documents` | Thin library |
| `tool` | `tools`, `tool_connections` | Catalogue + connection status. Live OAuth not configured |
| `memory` | `memories` | Present |
| `permission_grant` | `entity_members` helpers | Collaborator invites remain disabled |

## Explicit gaps (do not pretend they exist)

- No `tenant_id` column. Cross-tenant isolation is not testable until a tenant table exists.
- No first-class `thread`, `channel`, `classification`, or `conversion_proposal` tables. Those are JSON on `items.meta`.
- No `integration_job` or `migration_record` tables yet.
- `0008_import_dj_werk_full.sql` is a bulk import, not a spine object. Treat as archive data, not production schema.
- `0011_seed_pivot_os_demo.sql` seeds example workflows through `seed_pivot_os_demo()`. Settings labels this as development only.

## Rule until tenant baseline lands

Every operational write is scoped by authenticated `user_id` and, where shared, `entity_id`. Search, AI, integrations and audit must use the same resolved scope. Do not add a second customer tenant until this map is migrated.
