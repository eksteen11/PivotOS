# 07 — Execution Roadmap

**Authority:** `CONSTITUTION.md` → `MAMMOTH_PLAN.md` (phase intent) → this document (phase detail)  
**Status:** v1.0, 2026-08-14  
**First commercial lane:** Northpoint Realty (Capability 003)

This expands the eight Mammoth phases into work packages with hard gates. A phase does not start until the previous gate is signed.

---

## Phase 0 — Constitution lock ✅ COMPLETE

Constitution approved, Mammoth Plan approved, first lane locked to Northpoint, doc hierarchy established.

---

## Phase 1 — Clean product foundation

**Intent:** a trustworthy base with no demo theatre. Nothing new is added; dishonest things are removed or relabelled.

### Work packages

**1.1 Unblock the build**
- Fix the unused `Link` import in `app/(marketing)/register/page.tsx`
- Add `eslint-config-next`
- `npm run build` passes

**1.2 Honest information architecture**
- Navigation reduced to: Command Centre, Universal Inbox, Approvals, Meetings, Activity, Settings, and **Northpoint only**
- The other eight workspace routes are removed from navigation and either deleted or moved behind an explicit "not built yet" state
- `BusinessHealthGrid` stops presenting nine equally-real workspaces
- `/more`, `/contacts`, `/documents`, `/tools`, `/agents`, `/processes` reviewed: keep only what has real substance

**1.3 Honesty pass**
- Every simulated connector relabelled `simulated` per `plan/05_INTEGRATION_MATRIX.md` §3, or removed
- `simulateConnectorExecution` no longer produces a log that reads like a real send
- `ensureDemoMeetings()` removed from the production path
- Marketing landing page claims reduced to what exists
- Every empty state says the truth and offers the next action

**1.4 Data hygiene**
- `0008_import_dj_werk_full.sql` (hardcoded UUID, bulk rows) moved to `supabase/archive/`
- `0011_seed_pivot_os_demo.sql` disabled for production
- Remote migration state reconciled with local files; `0012` confirmed applied
- Schema mapped against `plan/01_DOMAIN_MODEL.md` L0 and L1; gaps documented

**1.5 Legacy quarantine**
- `/src` Vite app moved to `legacy/` or clearly marked archive
- `dev:vite` / `build:vite` scripts removed from `package.json`
- `VITE_*` env fallbacks removed from `lib/env.ts`
- Dexie sync either reconnected to the real read path or removed, so `SyncStatus` stops misleading

**1.6 Platform baseline**
- Environment variables and `.env.example` per `plan/06_PLATFORM_SPEC.md` §1
- CI gate: typecheck, lint, unit, build
- Error tracking wired
- Audit fail-closed implemented
- Tenant-aware schema baseline and explicit owner-private versus entity-shared visibility
- First cross-tenant, cross-user and cross-entity RLS isolation tests in CI

### Gate 1 — all must be true
- [ ] `npm run build` passes; CI gate green
- [ ] Navigation shows only real, substantive destinations
- [ ] No screen presents a simulated action as a real one
- [ ] No demo seed reaches production
- [ ] Legacy Vite app is not part of the production build
- [ ] Schema documented against L0 + L1
- [ ] Cross-tenant, cross-user and cross-entity RLS isolation tests pass in CI
- [ ] Audit write failure blocks the operation

---

## Phase 2 — Founder spine

**Intent:** Pivot becomes useful every single morning, before any deep commercial engine exists. This is the phase that decides whether the product survives.

### Work packages

**2.1 Universal Inbox (E1)**
- Capture: manual, voice note, document upload, **WhatsApp forward/paste as a first-class three-tap flow**
- Gmail OAuth read + classify
- Raw payload preserved immutably
- Classification: entity, capability, intent, urgency, money risk, relationship risk, confidence, rationale
- Conversion proposals: reply draft · task · meeting · deal stub · payment flag · archive
- Founder sees exceptions, not the stream

**2.2 Approval Centre (E3)**
- Approval modes `AUTO`, `SINGLE`, `ONE_OF_N` implemented
- Approve / edit / reject, each producing an audit record
- Payload-drift invalidation
- Prohibition list enforced at the action-dispatch layer, not in prompts

**2.3 Command Centre (002)**
- Three highest-leverage actions
- Waiting on you
- Risk and stalled
- What AI cleared overnight
- Money and deadlines that cannot wait
- No vanity metrics, no dashboard theatre

**2.4 Meetings (001)**
- Google Calendar two-way sync
- Recurring series with exceptions and reschedule-without-losing-history
- Briefing pack assembly from real linked data
- Transcript import (not fabricated) → outcomes → proposed tasks → approval → tasks
- Nuts and Bolts (Tue) and Pacesetter (Thu) as real recurring series

**2.5 Contacts, threads and memory (E4)**
- Identity resolution across channels
- Deduplication with human confirmation
- Memory scoped per entity, feeding briefings and drafts

**2.6 Agents**
- Archetypes A1 Triage, A2 Intake, A4 Drafting, A8 Preparation
- Each with explicit `data_scope`, `action_grants`, `approval_policy`
- Output contract enforced by the platform
- Cost ceilings active

**2.7 Platform**
- Notification tiers and the obligation engine skeleton (E12)
- Search over contacts, threads, inbox, meetings
- Golden-set evaluation harness for classification
- Performance budgets measured

**2.8 Operating Map**
- Dedicated visual hierarchy: group/tenant → company → team/function → system → process → agent/tool
- Permission-filtered nodes and links; hidden areas reveal neither names nor record counts
- Drill down from structure to live status and responsible people without crowding the Command Centre

### Gate 2 — all must be true
- [ ] The founder uses Pivot every morning for two consecutive weeks without being asked to
- [ ] WhatsApp backlog measurably reduced
- [ ] Gmail read + draft + approved send working end to end
- [ ] No "sent" confirmation exists for anything not actually sent
- [ ] Every AI output carries reason, sources and confidence
- [ ] Approval → execution → audit chain proven by E2E test
- [ ] Rejected approvals demonstrably do not execute
- [ ] Classification acceptance rate measured and recorded
- [ ] Performance budgets met on the Command Centre

**Do not proceed to Phase 3 until Gate 2 is signed.** This is the single most important sequencing rule in the plan.

---

## Phase 3 — Northpoint to operational source of truth

**Intent:** one commercial lane becomes genuinely real. Not a workspace skin — the actual place the work happens.

### Work packages

**3.1 Data migration**
- Import the `3.NP` sheet per `plan/06_PLATFORM_SPEC.md` §20
- Contacts, properties, buyer requirements, seller pipeline
- Reconciliation report; every row classified by evidence status

**3.2 Commerce layer (L2)**
- `supply`, `demand`, `catalogue_item` + `item_profile`, `listing`, `match`, `enquiry`, `viewing`, `deal`, `deal_party`, `deal_stage_history`, `agreement`, `condition`, `document`, `verification`

**3.3 Northpoint specialisation (L3)**
- `property_segment` × `transaction_type` on every property and requirement
- 15-stage deal pipeline as configuration (E7)
- 11-stage listing lifecycle
- 14-stage buyer requirement lifecycle
- Mandate lifecycle with expiry and renewal reminders
- FICA case tracking
- Transfer tracking with attorney, conditions, lodgement, registration
- Commission forecast: gross → referral split → agent split → DJ share → VAT → invoice → received → variance
- **Head-office OTP scrutiny modelled as an `EXTERNAL` approval that Pivot tracks and never replaces**

**3.4 Engines**
- E5 Document Checklist with cross-field consistency (names, IDs, property references)
- E6 Matching, segment-aware, agricultural facts respected, explainability mandatory
- E9 Verification levels on every property claim
- E12 Obligations: mandate expiry, OTP conditions, transfer milestones, compliance deadlines

**3.5 Agents**
- A3 Completeness, A5 Matching, A7 Coordinator instantiated for Northpoint

**3.6 Integrations**
- Google Drive deal folders (link + metadata)
- Property24 and Propverse: whatever is genuinely available; manual publish checklist otherwise, honestly labelled

### Gate 3 — all must be true
- [ ] Real Northpoint pipeline data lives in Pivot, not in the sheet
- [ ] A deal can be run end to end in Pivot: lead → match → viewing → OTP → scrutiny → transfer → commission
- [ ] Every match shows what matched, what did not, what is missing
- [ ] Document checklist blocks stage progression on genuinely missing documents
- [ ] Commission forecast reconciles to reality on at least one closed deal
- [ ] Stage history is append-only and provably so
- [ ] Compliance deadlines surface in the Command Centre
- [ ] The founder prefers Pivot to the spreadsheet for this lane

---

## Phase 3.5 — Habit hardening

**Intent:** do not add a second lane while the first one is still fragile.

Reliability, speed, mobile polish, notification tuning, classification accuracy improvement from real acceptance data, removal of anything unused. Measure: is the founder still using it daily after the novelty has gone?

### Gate 3.5
- [ ] Four consecutive weeks of daily use
- [ ] Classification acceptance rate improving, not flat
- [ ] Zero known cases of a fabricated fact reaching the founder
- [ ] Error rate and integration staleness inside agreed thresholds

---

## Phase 4 — Second lane by reuse

**Intent:** prove the engines are engines. Livestock Agency (005) is the recommended second lane — highest volume, most WhatsApp-native, most matching-driven.

**The measure of success is the ratio.** If the second lane needs more new code than new configuration, the engines failed and the correct response is to fix the engines rather than to fork them.

### Work packages
- `livestock_group` profile, species-conditional completeness, veterinary and permit checklist
- Listing lifecycle and marketplace event ingestion (no duplicate re-entry)
- Payment-flow typing
- Agent allocations
- A6 Pricing, A9 Intelligence archetypes

### Gate 4
- [ ] Second lane live on the same engines
- [ ] New lane-specific code under the agreed ratio
- [ ] Marketplace events flow in without re-entry
- [ ] Both lanes usable in the same morning without confusion

---

## Phase 5 — Money, carefully

**Intent:** the highest-risk phase. Nothing here ships without segregation, evidence and reconciliation.

- E10 Settlement and waterfall: commission, profit splits, partner waterfall with interest recovered before split
- E11 Reconciliation: bank lines, cash equations, stock equations, attorney payout statements
- Cash custody chain with dual-acknowledged handovers (007)
- Profit recognition ladder: forecast → invoiced → accrued → cash-backed → settlement-ready → approved → paid
- Xero read integration; approved writes with idempotency
- Sage bridge for Farm Feed
- Clark relationship established: Clark owns shared finance, Pivot shows DJ's exceptions

### Gate 5
- [ ] Every money figure traces to evidence
- [ ] Preparer ≠ approver enforced where required
- [ ] Only cash-backed profit is payable
- [ ] No silent overwrite between Pivot and Xero/Sage in either direction
- [ ] Bank release remains outside the application
- [ ] Intercompany balances reconcile on both sides

---

## Phase 6 — Capital, ideas and delivery visibility

- 008 governance: shareholders, board, resolutions, reserved matters, venture pipeline, capital states, tranches with conditions precedent, automatic funding stop
- 010 Opportunity Lab: idea register, evidence levels, experiments, routing, handover with acceptance
- 011 read-only delivery status from Jira and GitHub
- 006 Property underwriting: comparables with evidence grades, investment calculator, bid ceiling enforcement
- A12 Executive archetype

### Gate 6
- [ ] Capital release cannot occur without unanimous approval and satisfied conditions
- [ ] Bid ceiling provably cannot be exceeded or raised autonomously
- [ ] Ideas cannot silently become commitments
- [ ] Delivery status is read-only and clearly sourced from Jira/GitHub

---

## Phase 7 — Depth, expansion and hardening

Remaining lanes as configuration. WhatsApp Business API if approved. Real portal integrations where permission exists. Multi-user and Clark rollout. Full backup, DR and restore drills. Performance and cost optimisation. E13 Learning engine closing the loop.

### Gate 7
- [ ] Restore test demonstrated
- [ ] Multi-user isolation proven under test
- [ ] AI recommendations measured against actual outcomes
- [ ] Every capability either live, honestly deferred, or explicitly retired

---

## Sequencing rules that override everything

1. **No phase starts before the previous gate is signed.**
2. **No lane gets depth before the spine is habitual.** A beautiful vertical on top of an unused spine is a demo.
3. **No money feature ships without evidence, segregation and reconciliation.**
4. **No new agent archetype without a Constitution amendment.**
5. **No integration ships as "connected" unless it genuinely is.**
6. **If a phase needs objects beyond its budget in `plan/01_DOMAIN_MODEL.md` §5, the scope is wrong.**

---

## What "done" looks like for the whole programme

The founder opens Pivot in the morning. Overnight, AI has read and classified everything that arrived. It has drafted replies, prepared documents, spotted the stalled deal, flagged the expiring mandate and calculated the margin. He sees three things worth his judgement, approves or edits them, and the day starts.

Nothing was sent that he did not approve. Nothing was claimed that was not evidenced. Every number traces to a source. Every decision left a record.

That is the product. Everything in these documents exists to make that morning real.
