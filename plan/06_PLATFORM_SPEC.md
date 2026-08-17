# 06 — Platform Specification

**Authority:** `CONSTITUTION.md` → `TECH_STACK.md` → this document  
**Status:** v1.0, 2026-08-14  
**Purpose:** the engineering concerns that no previous planning document covered. The audit found eight topics entirely absent and twenty-two covered only in passing. This is that gap closed.

---

## 1. Environments

| Environment | Supabase project | Deploy | Data | Who |
|---|---|---|---|---|
| `local` | Supabase local stack or a dedicated dev project | `npm run dev` | Synthetic seed only | Developer |
| `preview` | Dev project, per-branch | Vercel preview | Synthetic seed only | PR review |
| `production` | `vntcdfzumwjgefyxhkie` | Vercel production | Real operational data | Founder |

**Rules**
- Production credentials never appear in a preview environment.
- Real operational data is never copied into local or preview. If realistic data is needed, it is generated or anonymised.
- Environment name is displayed in the UI outside production.
- `.env.local` is never committed. `.env.example` documents every required variable.

**Required variables**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY        # publishable
SUPABASE_SERVICE_ROLE_KEY            # server only, never NEXT_PUBLIC_
OPENAI_API_KEY                       # server only
PIVOT_ENV                            # local | preview | production
```

**Immediate cleanup:** `lib/env.ts` currently accepts legacy `VITE_*` variables. Remove once the Vite app is archived.

---

## 2. Database, migrations and schema governance

**Current state:** 13 local migration files; `0008_import_dj_werk_full.sql` contains a hardcoded user UUID and thousands of spreadsheet rows; `0011` seeds demo agents, processes and approvals; `0012` secures the demo reset RPC. The remote project may not have `0012` applied.

**Standards going forward**
- Every schema change is a versioned migration. No manual production DDL.
- Migrations are forward-only. Corrections are new migrations.
- Destructive migrations require a rehearsal on a restored copy plus a verified backup plus explicit approval.
- Seed data lives in migrations named `*_seed_*` and is **never** applied to production.
- No migration contains a hardcoded personal UUID. `0008_import_dj_werk_full.sql` is quarantined into `supabase/archive/` in Phase 1.

**Schema conventions**
- `snake_case`; `id uuid primary key default gen_random_uuid()`; `created_at`/`updated_at` with the `set_updated_at` trigger.
- Every business table carries `tenant_id`; owner-private tables also carry `user_id`, and company-scoped tables carry `entity_id`.
- Money is `numeric(18,2)` with an explicit currency column. Never floating point.
- Quantities are `numeric` with an explicit unit column. Never a bare number.
- Enumerations are Postgres enums where the set is stable, lookup tables where it is configurable.

---

## 3. Security and RLS model

**Posture:** deny by default. A table with RLS enabled and no policy is correctly inaccessible.

**Policy pattern**

| Table class | Read | Write |
|---|---|---|
| Owner-private (`items`, `memories`, `documents`) | matching tenant **and** `user_id = auth.uid()` | owner only |
| Entity-shared (`processes`, `approvals`, `agents`) | matching tenant and scoped entity member via `user_is_entity_member()` | owner or entity admin |
| Global catalogue (`tools`) | any authenticated | none (service role only) |
| Audit (`activity_logs`, `audit_event`) | owner/member read | insert only; **no update or delete policy exists for any role** |
| Governance (`entity_members`, `entity_invites`) | member read | `user_is_entity_admin()` only |

**Additional controls**
- Service role key is used only in server code paths that have already authenticated the user and resolved their scope.
- Tenant isolation is checked before entity or record permissions. Search, AI retrieval, integrations, exports and logs use the same resolved tenant scope.
- Partner and investor isolation (KB 007/008): a partner may never see another partner's deals, balances or settlements. This is enforced by RLS, not by hiding UI.
- Confidentiality levels on contacts, properties and family-domain data restrict read access independently of entity membership.
- MFA required for any privileged account once multi-user arrives.
- Secrets are never committed. A secret register records where each secret lives, who can access it, how it rotates and how it is revoked.

**RLS test requirement:** every phase gate includes an automated test proving cross-entity and cross-user isolation. A phase does not pass without it.

---

## 4. Testing strategy

| Layer | Tool | Coverage target |
|---|---|---|
| Unit | Vitest | Every deterministic calculation: landed cost, margin, commission, waterfall, interest, VAT, ageing, stock balance, cash equation. **100% of the calculation library** |
| Contract | Vitest | Agent output contract, approval record shape, connector state machine |
| Database | pgTAP or SQL test harness | RLS isolation, constraint enforcement, trigger behaviour |
| Integration | Vitest + mocked providers | Idempotency, retry, webhook signature, token refresh |
| End-to-end | Playwright | Critical journeys only (below) |
| AI evaluation | Custom harness | Classification and drafting against a golden set (§9) |

**Critical journeys that must have E2E tests**
1. Sign in → Command Centre loads with real data
2. Capture an item → classify → accept a proposal → task created → audit entry written
3. Risky action proposed → appears in approvals → approve → executes → audit entry written
4. Risky action proposed → reject → does **not** execute
5. Payload changes after approval → execution is blocked
6. Entity scope switch → no data from another entity appears
7. Second user (when multi-user arrives) → cannot see the first user's data

**Rule:** a calculation without a unit test does not ship. A money-touching path without an E2E test does not ship.

---

## 5. CI/CD and release process

**Branching:** `work branch → PR → main`. Preview deploy per PR. `main` deploys to production.

**PR gate (must all pass):**
```
typecheck  →  lint  →  unit tests  →  db tests  →  build  →  E2E on preview
```

**PR description must state:** what changed, why, migration impact, config impact, tests performed, rollback method, known limitations.

**Release checklist**
- [ ] Migrations reviewed and rehearsed
- [ ] Backup verified if the change is destructive
- [ ] Preview smoke test passed
- [ ] Rollback path documented
- [ ] Deploy
- [ ] Production smoke test
- [ ] Monitor for the agreed window

**Immediate fix required:** `npm run build` currently fails on an unused import in `app/(marketing)/register/page.tsx`, and `eslint-config-next` is not configured. Both are Phase 1, day one.

---

## 6. Observability and monitoring

| Concern | Approach |
|---|---|
| Application errors | Error tracking service (Sentry or equivalent) with environment and user context, PII scrubbed |
| Structured logs | JSON logs with correlation id, user id, entity id, action; **never message bodies, ID numbers, bank details or FICA content** |
| Integration health | Per-connector: last success, last failure, stale age, queue depth. Displayed in the app, not just in a dashboard |
| AI health | Per agent: call count, cost, latency, confidence distribution, rejection rate |
| Uptime | External check on the signed-in home route |
| Alerts | Integration failure, audit write failure, cost ceiling breach, RLS test failure in CI, backup failure |

**Audit fail-closed:** if the audit write fails, the operation is rejected. This is a monitored alert, not a silent log line.

---

## 7. Backup and disaster recovery

| Item | Standard |
|---|---|
| Database backup | Supabase automated daily; verify it is enabled and retained |
| Retention | 30 days daily minimum; monthly points retained 12 months |
| Off-platform copy | At least one encrypted export outside Supabase |
| Storage/documents | Backed up on the same schedule as the database |
| Restore test | **Quarterly**, into a non-production environment, with time-to-restore and completeness recorded |
| Pre-risk backup | Verified backup before any destructive migration or bulk data change |

> **A backup is not considered reliable until a restoration has been demonstrated.** — KB 011 §36. This applies to Pivot, not only to the marketplace.

**Recovery objectives (initial, to be ratified):** money, approval and audit data — RPO 24 h, RTO 4 h. Everything else — RPO 24 h, RTO 24 h.

---

## 8. AI cost, rate limits and model policy

| Control | Value |
|---|---|
| Model for classification and extraction | Small/cheap tier |
| Model for drafting, analysis and briefing | Stronger tier |
| Calculations | **Never a model.** Deterministic code only |
| Per-agent daily cost ceiling | Configured; breach pauses the agent and raises an exception |
| Per-workspace monthly ceiling | Configured; breach pauses non-essential agents and notifies the founder |
| Token budget per call | Capped; oversized inputs are chunked or truncated with the truncation disclosed |
| Provider rate limit | Queued with backoff; sustained pressure raises an exception |
| Pivot API rate limit | Per-user limits on capture, classify and generate endpoints to prevent runaway loops |
| Caching | Classification of identical raw payloads is cached; briefing packs are cached until source data changes |

Every AI call records model, prompt version, token counts and cost against the agent and the entity. Cost is a first-class metric, not a surprise at month end.

---

## 9. Prompt management and evaluation

- Prompts are files in the repository, versioned, referenced by id. An agent pins a version.
- Changing a prompt is a code change and goes through the PR gate.
- A **golden set** of real (anonymised) inbox items with expected classifications and expected proposal types is maintained per lane.
- Any prompt or model change runs against the golden set. Regression beyond the agreed threshold blocks the merge.
- Evaluation results are stored so quality over time is visible.

---

## 10. AI failure and hallucination handling

| Failure | Handling |
|---|---|
| Asserted fact with no `source_ref` | Output blocked by the platform. This is validated, not trusted |
| Confidence below floor | Routed to "needs your eyes"; never auto-converted |
| Contradictory sources | Exception raised with both shown; no silent choice |
| Model unavailable or erroring | Deterministic fallback, explicitly labelled as reduced capability |
| Repeated failure for one agent | Agent paused, founder notified, audit entry written |
| Output fails the contract shape | Rejected before reaching the UI |

**Never:** a fabricated number, quote, valuation, veterinary conclusion, legal position or claim of having sent something.

---

## 11. Error taxonomy

| Code class | Meaning | User-facing behaviour |
|---|---|---|
| `AUTH_*` | Not signed in, session expired, insufficient permission | Clear message with the exact next step |
| `SCOPE_*` | Wrong entity, confidentiality restriction | "You don't have access to this" — never a blank page |
| `VALIDATION_*` | Missing or invalid input | Field-level, plain language |
| `POLICY_*` | Blocked by an approval or prohibition rule | State which rule and who can approve |
| `EVIDENCE_*` | Required document or verification missing | List exactly what is missing |
| `INTEGRATION_*` | External system failed | Name the system, the state, and whether it will retry |
| `AI_*` | Model failure, low confidence, contract violation | Say what happened and offer the manual path |
| `SYSTEM_*` | Unexpected | Generic message, full detail logged with a reference id shown to the user |

**Kind error states are law** (`DESIGN_RULES.md` §13): every error says what happened, what it means, and what to do next. No stack traces, no "something went wrong".

---

## 12. Notifications and reminders

**Tiers**

| Tier | Examples | Delivery |
|---|---|---|
| `critical` | Payment deadline today, auction today, OTP condition expiring, capital gate breached, security event | Immediate, breaks through |
| `important` | Approval waiting, stalled deal, overdue document, mandate expiring in 7 days | Command Centre + daily digest |
| `informational` | Overnight AI activity, listing performance, routine sync | Digest only |

**Engine rules**
- Notifications derive from `obligation` records (E12), never from ad-hoc duplicated rows.
- Deduplication: one obligation produces one notification thread, escalating rather than repeating.
- Quiet hours configurable; `critical` overrides.
- Every notification links to the action that resolves it. A notification with no resolving action is a design defect.
- Delivery channels: in-app first; email for `critical` and the daily digest; push later.

---

## 13. Search

**Scope:** contacts, threads and messages, inbox items, deals, listings, documents (title, summary and extracted text), meetings and outcomes, tasks, activity.

**Approach:** Postgres full-text search with `tsvector` columns and GIN indexes as the baseline. Vector/semantic search is added only where keyword search demonstrably fails, and only after Phase 3.

**Rules**
- Search results respect RLS and confidentiality levels. Nothing appears in results that the user cannot open.
- Every result shows its entity and type. Cross-entity confusion is a defect.
- The command bar searches; it does not act on its own.

---

## 14. Documents, storage and OCR

| Concern | Standard |
|---|---|
| Storage | Supabase Storage for Pivot-native documents; Google Drive links for existing deal folders |
| Metadata | Always in Pivot: category, party, deal, stage requirement, expiry, verification level, confidentiality |
| Extraction | Text extraction for PDFs; OCR for scanned documents from Phase 4, used to populate proposals, never to auto-confirm facts |
| Verification | An extracted value is verification level 2 at most until a human or a professional confirms it |
| Immutability | Signed documents are never modified. Corrections create a new version with the prior version retained |
| Access | FICA, ID documents and financial statements are restricted; access is logged |

---

## 15. Offline and mobile

- First delivery is an installable Next.js web app with a manifest, app icons and a minimal service worker.
- Phone is the primary interaction target; desktop exposes the same core workflows with a labelled sidebar and wider layouts.
- Offline is scoped to **capture only** (Dexie). A note, voice memo or forwarded message captured offline syncs when connectivity returns.
- Reading operational data, approving anything, or executing anything requires connectivity. There is no offline approval.
- Sync conflicts on captured items resolve last-write-wins on the local draft with the server copy preserved; nothing is silently lost.
- Full workflow parity across desktop, tablet and mobile for everything except bulk data work.
- **Current defect:** `SyncRunner` syncs Dexie `items` while the app pages read directly from Supabase, so the sync status indicator can mislead. Phase 1 either reconnects or removes it.

---

## 16. Data retention and POPIA

| Data | Retention | Notes |
|---|---|---|
| Audit and approval records | Indefinite | Immutable; required for governance |
| Financial records | 7 years minimum | SA statutory |
| FICA documents | 5 years after relationship ends | Restricted access throughout |
| Meeting recordings and transcripts | **Open decision** — see gap register D-08 | Consent policy must be settled first |
| Inbox raw payloads | 24 months, then archive | Classification and derived records persist |
| Personal and family domain data | Founder-scoped, restricted, never surfaced in company dashboards | |
| Rejected and parked ideas | Indefinite | Learning is retained deliberately |

**POPIA obligations to implement:** purpose limitation on classification and marketing · minimum necessary collection · consent capture and opt-out honouring on outbound · restricted access to personal identifiers (never in ordinary dashboards) · secure transmission and storage · logging that does not leak personal data · a data-subject request process · a processing register naming each purpose and legal basis.

---

## 17. Performance budgets

| Metric | Budget |
|---|---|
| Command Centre time to meaningful content | < 1.5 s on a normal connection |
| Any list view | < 1 s |
| Capture submit acknowledgement | < 300 ms (optimistic) |
| Classification result | < 8 s, with visible progress |
| API p95 | < 500 ms excluding model calls |
| Initial JS payload | < 250 kB gzipped |

The Constitution's "morning clarity in three seconds" is a product promise. These are the engineering numbers that make it true.

---

## 18. Analytics on Pivot itself

Instrument the product so E13 has something to learn from:

capture events by channel · classification accepted / edited / rejected · proposal conversion rate by type · approval turnaround time · time from capture to resolution · agent acceptance rate · search usage and zero-result queries · route usage (which screens are actually used) · session frequency and morning-open rate.

Privacy-respecting, self-hosted or first-party. No third-party marketing pixels in the signed-in application.

---

## 19. Onboarding a new business or entity

A repeatable runbook, because this will happen again:

1. Create `legal_entity` and `entity` records; record VAT status, financial year end and accounting system.
2. Write or import the capability knowledge base.
3. Configure lane specialisation: completeness profiles, pipeline stages, document requirements, approval thresholds.
4. Import contacts and historical data via the migration process (§20).
5. Instantiate agents from archetypes with explicit scopes and grants.
6. Connect integrations, or declare them `manual` honestly.
7. Run the phase gate checklist for that lane.

If onboarding a new entity requires new code rather than new configuration, the engines are wrong.

---

## 20. Migration and backfill strategy

Applies to Airtable (≈5,948 livestock deal rows, 546 transaction records with 154 fields, ≈2,900 Farm Feed deals), Google Sheets (DJ Werk, 3.NP, R_Calc) and historical WhatsApp.

**Six phases, from KB 007, generalised**

1. **Preserve** — import source rows verbatim into `migration_record` with file, row number, checksum and timestamp. Immutable.
2. **Profile** — measure completeness, duplicates, contradictions, orphans. Report before touching anything.
3. **Map** — define field mappings to canonical objects. Reviewed and approved before execution.
4. **Reconcile** — establish a signed-off opening position (stock, cash, balances). Classify each row: verified · probable · unallocated · unsupported · contradictory · unexplained variance.
5. **Import** — create normalised objects linked back to their source rows.
6. **Archive** — source system becomes read-only reference. It is never a production backend.

**Prohibitions**
- Never a blind full-table copy. A 154-field transaction row decomposes into many linked events; importing it as one transaction double-counts stock and money.
- Never invent an allocation to force a balance to zero.
- Never delete the source row.
- Rollback plan required before any import batch runs.

---

## 21. Demo data versus real data

| Rule | Detail |
|---|---|
| Production carries **no** demo seed | `0011_seed_pivot_os_demo.sql` and `ensureDemoMeetings()` are removed from production paths in Phase 1 |
| Demo data, if it exists at all, is visibly labelled | And lives in a separate environment |
| Empty is honest | An empty inbox says "nothing captured yet" with a capture action. It does not fabricate items to look busy |
| Imported real data is marked with its provenance | Source system and import batch visible on the record |
| Reset affects demo environments only | Never production operational data |

---

## 22. Multi-user, privacy and SaaS tenancy

DJ is the first tenant owner and primary user. Invited workers and colleagues may access selected company entities and capabilities before broad SaaS launch; founder-private areas remain inaccessible.

Already present: `entity_members`, `entity_invites`, `entity_role`, membership-based RLS helpers.

Required foundation now: top-level tenant ownership · owner-private versus entity-shared visibility · role-to-capability grants · scoped invitations · expiring delegation · audited permission changes · tenant-aware search, agents, tools and integrations.

Initial rollout decision (2026-08-16): DJ remains the only active user. Invitation capability is designed and tested, but no colleague is invited until a later pilot is explicitly approved. First-version sharing is by entity and capability; individual record sharing is deferred, except founder-private records which remain owner-only.

SaaS launch later: one isolated customer tenant may contain several related companies · self-service tenant onboarding · subscription and entitlement controls · customer admin controls · tenant export/deletion · support access with explicit, time-limited consent.

Invitation defaults: no access until accepted · no inherited access to other entities · least privilege · owner can revoke immediately · permission changes are approval-gated and audited.

Clark arrives before multi-user Pivot. Shared company finance records live in Clark and must never depend on DJ's personal Pivot workspace to exist.
