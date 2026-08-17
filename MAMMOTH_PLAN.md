# Pivot OS Mammoth Plan

**Version:** 1.0  
**Status:** Approved 2026-08-14 — active rebuild plan  
**Depends on:** `CONSTITUTION.md`  
**First commercial lane:** Northpoint Realty (003)  
**Rebuild stance:** Brownfield infrastructure · Greenfield product experience  

---

## 0. Purpose of This Plan

This is the plan for rebuilding Pivot OS properly against Knowledge Base 001–011.

It replaces the previous demo-oriented sequencing in `PROJECT_PLAN.md` and `BUILD_PLAN.md` as the active build authority once approved.

The goal is not “all workspaces look populated.”  
The goal is a **serious Founder OS spine** and **one real commercial operating lane**, then expansion without rework.

---

## 1. Current Reality (Baseline)

### What is true now
- Supabase project is connected and healthy (MCP works).
- OpenAI API is connected.
- Next.js app exists as a navigable **demo shell**.
- Knowledge Base 001–011 is unusually complete domain documentation.

### What is not true yet
- Workspaces are not production operating systems.
- Matching, money, and channel depth are mostly specified, not built.
- Current UI should be treated as disposable prototype for product experience.

### Decision locked by Constitution
Keep repo + Supabase + OpenAI + auth foundation.  
Rewrite the product experience cleanly.  
Do not open a separate greenfield repo unless blocked by irreversible technical debt (not the case today).

---

## 2. Execution Rules

Constitution + this plan are approved.

Execute phase by phase with a Definition of Done gate before the next phase starts.  
No demo theater. No fake-complete workspaces. No Phase 3 depth until Phase 2 spine DoD is met.

---

## 3. Mammoth Structure Overview

```text
Phase 0  Constitution lock + SoR + slice choice
Phase 1  Clean product foundation (auth, shell, schema reshape)
Phase 2  Founder spine production (Command Centre, Inbox, Approvals, Meetings)
Phase 3  One commercial vertical to operational source of truth
Phase 2/3 habit loop hardening
Phase 4  Second commercial vertical by reuse (not rewrite)
Phase 5  Money carefully (Partner events / finance exceptions; Clark parallel)
Phase 6  Capital, Opportunity Lab, Product delivery visibility
Phase 7  Broader depth + real integrations expansion
```

---

## 4. Phase 0 — Constitution Lock (Docs Only)

### Deliverables
- Approved `CONSTITUTION.md`
- Approved this `MAMMOTH_PLAN.md`
- Chosen first commercial lane: **Northpoint (003)** or **Livestock (005)**
- One-page SoR confirmation for that lane
- Acceptance scenarios list for Phase 2 and Phase 3 (from KB MVP sections)

### Exit criteria
DJ signs off in writing: “Constitution + Mammoth Plan approved. First lane = ___.”

### No coding in Phase 0.

---

## 5. Phase 1 — Clean Product Foundation

### Intent
Create a trustworthy rebuild base without demo theater.

### Work
1. Declare current Next demo UI as legacy prototype (quarantine or replace routes deliberately).  
2. Establish clean App Router information architecture:
   - `/today` Command Centre
   - `/inbox`
   - `/approvals`
   - `/meetings`
   - `/activity`
   - `/settings`
   - one commercial workspace route only for the chosen lane
3. Keep Supabase; reshape schema only where Constitution spine objects require it.  
4. Preserve tenant and entity isolation; DJ is the only active user initially, while scoped collaborator access is designed and tested but invitations remain disabled.  
5. Remove or hide fake-complete workspace navigation for unbuilt verticals.  
6. Keep OpenAI behind one AI service interface (live + safe fallback).  
7. Freeze legacy Vite app as archive (not dual primary product).

### Definition of Done
- App shell matches Constitution navigation (no nine fake OS’s)
- Auth works against live Supabase
- Empty/loading/error states are honest
- Schema map documented against spine objects
- Production build passes

---

## 6. Phase 2 — Founder Spine (Highest Leverage)

### Intent
Make Pivot useful every morning even before deep commercial engines exist.

### Scope (Capability 002 + 001 + shared spine)
1. **Universal Inbox**
   - Sources: email (real OAuth when ready), WhatsApp (manual forward/paste until Business API confirmed), notes, meeting outcomes, docs
   - AI classify: entity, urgency, suggested conversion
   - Conversions: reply draft, task, meeting, deal/opportunity stub, archive
2. **Approval Centre**
   - Enforce Constitution approval matrix
   - Edit / approve / reject
   - Activity log for every resolution
3. **Founder Command Centre**
   - Top 3 leverage moves
   - Needs-you queue
   - Risks / stalled
   - Overnight AI cleared count
   - No vanity dashboards
4. **Meetings**
   - Create / list / prep pack
   - Transcript upload or simulated provider behind interface
   - Decisions → approved tasks/processes
5. **Activity Log**
   - End-to-end audit trail
6. **Operating Map**
   - Permission-filtered visual path from group/company to systems, processes, agents and tools
   - Drill-down detail on demand; never add density to the daily Command Centre

### Integration policy in Phase 2
- Prefer **Gmail read + draft** before WhatsApp live send
- WhatsApp may start as controlled capture (forward/paste) with honest UI labelling
- No fake “message sent” unless connector truly sent

### Definition of Done
- DJ can clear a real morning queue in Pivot
- Classification + draft + approval path works end-to-end
- No approval bypass possible in UI/API
- Entity privacy holds under test
- Time-to-clarity on Today < 3 seconds for seeded/live queue

---

## 7. Phase 3 — One Commercial Vertical to Operational Truth

### Intent
Prove the mammoth pattern: spine + one deep lane beats nine shallow skins.

### Choose one lane before starting

#### Option A — Northpoint (003)
- Sellers / properties / buyers / viewings
- Mandate → listing checklist → offer/OTP pipeline (ops view)
- Matching v1: buyer requirements ↔ properties
- Documents checklist
- Propverse/Property24 as orchestrated externals (manual/API as available)

#### Option B — Livestock Agency (005)
- VERKOOP / SOEK intake
- Missing-information workflow
- Listing preparation
- Offer / viewing / payment-variant awareness
- Website/marketplace events consumed, not rebuilt

### Shared Phase 3 requirements
1. Import real historical/operational data for that lane (Sheets/Airtable/exports)  
2. Canonical records in Supabase (not regex boards)  
3. Stage model with history  
4. Matching v1 with explainable scores  
5. Document checklist  
6. Founder exceptions surface in Command Centre  
7. No claim of replacing external CRMs/ledgers  

### Definition of Done
- Lane has a trustworthy operational source of truth in Pivot
- DJ can run daily work for that lane without spreadsheets as primary
- Matching produces useful shortlists
- Spine objects remain shared (no lane-specific inbox fork)
- Migration reconciliation report exists (counts, gaps, known dirt)

---

## 8. Phase 4 — Reuse Engine to Second Vertical

### Intent
Copy the pattern, not the codebase chaos.

### Work
- Add second commercial lane (the one not chosen in Phase 3, or Farm Feed if data-ready)
- Reuse matching / pipeline / document / approval patterns
- Only add domain fields and stage semantics that differ

### Definition of Done
- Second lane live on same spine
- Cross-entity leak tests still pass
- Shared components remain dominant (>70% reuse target for pipeline UX)

---

## 9. Phase 5 — Money Carefully

### Intent
Introduce money systems without destroying trust.

### Workstreams
1. **Pivot finance exceptions** from Constitution 009 boundary  
2. **Clark** as parallel product program (separate roadmap, shared identity model where needed)  
3. **Partner Farming event model (007)** only after commercial ops truth exists  
4. Xero/Sage connectors: read/reconcile first; write only with approvals and reversible drafts  

### Definition of Done
- DJ sees money exceptions that matter
- No silent ledger overwrite
- Payment prepare → approve → external release boundary is explicit
- Clark scope is not faked inside Pivot

---

## 10. Phase 6 — Capital, Ideas, Product Ops

### Intent
Governance and invention after daily ops are stable.

1. Opportunity Lab (010) shared idea register + DJ decision queue  
2. Strategic Growth & Capital (008) board/capital tranche visibility  
3. Digital Product (011) delivery/release dashboard links to Jira/GitHub/staging/prod  

### Definition of Done
- Ideas route cleanly without becoming accidental companies
- Capital decisions have audit trail
- Marketplace releases are visible and gated, not operated blindly from Pivot

---

## 11. Phase 7 — Expansion & Hardening

- Remaining vertical depth (006 property investment, 004/005/003 leftovers)
- WhatsApp Business API production path
- Banking read models
- Advanced agents only where data truth is proven
- Performance, security audit, backup/restore drills
- Multi-device polish (desktop/tablet/mobile parity)

---

## 12. Clean Rebuild Execution Method

### For each phase
1. Write phase acceptance scenarios (from KB)  
2. Implement smallest vertical slice  
3. Test on desktop + mobile  
4. Compare against Constitution  
5. Only then expand  

### Coding rules
- Smallest change that advances the phase DoD  
- No workspace skins for unbuilt capabilities  
- No new architectural pattern without Constitution update  
- AI always approval-safe  
- Prefer honest empty states over fake completeness  

### Data rules
- Prefer imported real data for the active lane  
- Mark simulated connectors clearly  
- Keep seed/reset for demo areas separate from production operational data  

---

## 13. First Serious Production Slice (Summary DoD)

**In**
- Secure founder Pivot
- Command Centre + Inbox + Approvals + Meetings
- One commercial SoR lane with real imported pipeline
- Activity/audit trail
- Live OpenAI classification/drafting behind service interface
- Simulated externals only where labelled

**Out**
- Nine deep OS’s
- Clark multi-user complete product
- Autonomous sends/payments
- Marketplace replacement
- Fake live integration claims

**Success metrics**
- Morning clarity < 3 seconds
- Backlog age of WhatsApp/email down week over week
- % inbox items classified without founder manual filing
- Zero approval bypass
- Zero cross-entity leaks in tests

---

## 14. Doc Map After Approval

| Doc | Role |
|---|---|
| `CONSTITUTION.md` | Product law |
| `MAMMOTH_PLAN.md` | Rebuild sequencing |
| KB 001–011 | Domain detail bible |
| `TECH_STACK.md` | Update after approval to match clean rebuild |
| `DESIGN_RULES.md` | Update after approval for Founder OS visual law |
| `PROJECT_PLAN.md` / `BUILD_PLAN.md` | Mark superseded or rewrite to point here |
| `MASTERPLAN.md` | Historical / archive unless reconciled |

---

## 15. Founder Approval Checklist

Approve only if you agree with all of the following:

- [ ] Pivot is founder OS; Clark is shared finance; marketplace stays 011  
- [ ] Clean rebuild of product experience; keep Supabase/OpenAI/repo  
- [ ] First depth lane is one commercial vertical, not all  
- [ ] Spine before agent sprawl  
- [ ] No coding until this approval  
- [ ] First commercial lane choice: `Northpoint` / `Livestock` / `Other: ________`

**Approval line (to reply in chat):**

> Approved. Constitution v1 + Mammoth Plan v1. First lane = ________.

---

## 16. Immediate Next Step After Approval

1. Update `TECH_STACK.md` and `DESIGN_RULES.md` to match Constitution  
2. Mark old demo plans superseded  
3. Start Phase 1 clean foundation  
4. No Phase 3 depth until Phase 2 spine DoD is met  
