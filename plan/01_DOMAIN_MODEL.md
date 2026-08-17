# 01 — Canonical Domain Model

**Authority:** `CONSTITUTION.md` → this document → knowledge bases 001–011  
**Status:** v1.0, 2026-08-14  
**Purpose:** One object language for the whole Pivot OS estate. Every capability reuses these objects. No capability invents a parallel object with a different name for the same thing.

---

## 0. Why this exists

The knowledge bases describe roughly **380 distinct named objects** across eleven capabilities. Left unmanaged that becomes eleven separate databases with eleven vocabularies.

This document collapses them into **four layers**:

| Layer | Meaning | Count |
|---|---|---|
| **L0 — Platform** | Identity, tenancy, audit, permission | 10 objects |
| **L1 — Spine** | Present in every capability | 18 objects |
| **L2 — Commerce** | Present in every deal-making capability | 21 objects |
| **L3 — Lane** | Capability-specific specialisation | per lane |

**Rule:** an object is only allowed at L3 if it cannot be expressed as an L2 object plus a typed attribute set. Northpoint `Listing` and Livestock `Listing` are the **same** L2 object with different `listing_profile` payloads. Northpoint `OTP` and Property `OTP` are the **same** L2 `Agreement` with `agreement_type = otp`.

---

## 1. L0 — Platform layer

| Object | Key fields | Notes |
|---|---|---|
| `tenant` | id, name, owner_user_id, plan, status | DJ's estate is the first tenant; every future customer business is isolated in its own tenant |
| `user` | id, email, auth provider, mfa state | DJ first; invited colleagues added through scoped membership |
| `role` | id, name, scope | Viewer, Preparer, Approver, Releaser, Admin (from KB 009) |
| `permission_grant` | tenant, user, role, legal_entity, entity, capability, expiry | Least-privilege grant per tenant, entity and function |
| `legal_entity` | id, registered name, reg no, VAT status, FY end, accounting system | Digikraal (Pty) Ltd, DK Agri (Pty) Ltd, Farm Feed (Pty) Ltd, Northpoint context, Lebab, SPVs |
| `entity` (workspace) | id, slug, name, legal_entity_id, capability set | The operating workspace; may map many-to-one to legal entity |
| `capability` | id (001–011), name, owner, status | Registry of capabilities, their SoR and their lifecycle stage |
| `audit_event` | actor, role, entity, action, timestamp, source inputs, AI context (sanitised), proposal, checks, approval/rejection, payload, integration result, final state | **Immutable.** Fail-closed: if audit write fails, the operation is blocked |
| `integration_job` | idempotency key, correlation id, sync state, retries, last error | Every outbound/inbound sync |
| `migration_record` | source system, source row id, checksum, import batch, parsing version, links to normalised objects | Legacy row provenance, never deleted |

### L0 non-negotiables
1. Every operational object belongs to exactly one `tenant`; tenant isolation is enforced in RLS, search, AI memory, integrations and audit.
2. `legal_entity` and `entity` are **different things**. Consolidation never erases legal boundaries.
3. Founder-private records are owner-only by default; entity membership never grants them implicitly.
4. Every mutating action writes exactly one `audit_event`.
5. Audit failure blocks the write. It is never silently swallowed.
6. Migration never overwrites the source row; it links to it.

---

## 2. L1 — Founder spine (every capability uses these)

| Object | Key fields | Sourced from |
|---|---|---|
| `contact` | name, org, roles[], phone/WhatsApp, email, VAT no, location, relationship owner, consent state, confidentiality | 001,002,003,004,005,006,007 |
| `organisation` | legal name, type, VAT, registration, addresses | 003,004,005,006 |
| `relationship` | contact ↔ entity, role, trust signals (evidence-based only), history | 004,005 |
| `channel` | type (whatsapp/email/web/phone/facebook/form), account, direction | 002,003,004,005 |
| `thread` | channel, participants, subject, entity, capability, confidentiality | 002 |
| `message` | thread, direction, body, media, timestamp, external id | 002 |
| `inbox_item` | raw payload, source channel, capture time, classification, urgency, money risk, relationship risk, proposed conversions[], status | 002 (the heart of the product) |
| `classification` | entity, capability, domain tag, intent, urgency, confidence, model version, rationale | 002 |
| `conversion_proposal` | inbox_item, type, draft payload, confidence, requires_approval, accepted/rejected | 002 |
| `task` | title, owner, due, linked object, source event, status | 001,002,003 |
| `meeting` | series, occurrence, entity, participants, location/link, agenda, briefing pack, transcript, outcomes | 001 |
| `decision` | meeting/board/deal, decision maker, reasons, evidence considered, conditions, immutable | 001,008,010 |
| `goal` | horizon (day/week/month/year/5y), entity, metric, progress | 002,003 |
| `document` | title, category, storage ref, party, expiry, verification state, confidentiality | all |
| `document_requirement` | required-for stage, satisfied-by document, blocking? | 003,004,005,006,007 |
| `approval` | action type, payload, reason, risk level, required approvers, granted by, conditions, evidence, expiry | all |
| `activity_log` | human-readable event stream derived from audit_event | all |
| `memory` | kind, key, content, scope (entity/agent), source, expiry | 002 |

### The one rule that defines the product

```
capture → inbox_item → classification → conversion_proposal
       → [approval if risky] → execution → audit_event → memory
```

Nothing in Pivot OS bypasses this chain. If a feature bypasses it, it belongs in Clark or the Marketplace, not Pivot.

---

## 3. L2 — Commerce layer (shared by 003, 004, 005, 006, 007)

This is the layer that makes Northpoint, Farm Feed, Livestock, Property and Partner Trading **one system instead of five**.

| Object | Meaning | Lane examples |
|---|---|---|
| `supply` | Something available to sell | Northpoint listing/mandate · Farm Feed VERKOOP · Livestock VERKOOP · Property opportunity |
| `demand` | Someone wanting something | Northpoint buyer requirement · Farm Feed SOEK · Livestock SOEK · Property investor mandate |
| `catalogue_item` | The normalised thing being traded | Property (erf/farm) · Commodity+grade+packaging · Livestock group · Investment property |
| `item_profile` | Typed attribute bundle for the catalogue item | agri property facts · SAFEX grade spec · livestock biology/health · property due diligence |
| `media_asset` | Photo, video, map, plan | all |
| `listing` | A published representation of supply | Property24/Propverse · Farm Feed website/Facebook · Digikraal marketplace |
| `listing_channel` | Where it was published and its state | per channel, with publication rules |
| `match` | supply ↔ demand with score and explanation | **explainability mandatory** |
| `enquiry` | Inbound interest against a listing | all |
| `viewing` | Physical inspection event | Northpoint viewing · Livestock "Gaan Kyk" · Property inspection |
| `verification` | Claim + evidence + verifier + level | seller-stated / agent-observed / vet-confirmed / document-confirmed / not verified |
| `deal` | The commercial envelope | all lanes; stable `deal_code` used across Pivot, Xero/Sage, Drive |
| `deal_party` | contact + role (buyer, seller, agent, attorney, transporter, funder) | all |
| `deal_stage_history` | append-only stage transitions with actor, timestamp, reason, evidence | all — **never overwritten** |
| `commercial_term` | price basis, quantity, VAT treatment, incoterm, payment structure | all |
| `cost_line` | forecast / approved / actual (three separate numbers) | all |
| `agreement` | mandate, OTP, lease, quote, LOI, contract, resolution | typed by `agreement_type` |
| `condition` | suspensive condition or condition precedent, deadline, owner, status | 003,006,008 |
| `logistics_job` | transport/loading/delivery with quantity reconciliation | 004,005,007 |
| `settlement` | who gets what, in what order | 003 commission · 004 profit split · 005 agent allocation · 007 waterfall |
| `money_event` | invoice, bill, receipt, payment, allocation, credit note | bridges to 009 |

### L2 design rules

1. **One deal_code, many systems.** The same code appears in Pivot, Xero/Sage, Drive folder, marketplace listing and settlement.
2. **Stage history is append-only.** Lanes may skip stages; they may not rewrite history.
3. **Forecast, approved and actual are three separate stored values.** Never one field that gets overwritten.
4. **Every claim carries a verification level.** "Seller says 200 head" and "vet certified 200 head" are not the same data.
5. **Every match carries an explanation.** What matched, what did not, what is assumed, what is missing, what the profit looks like.

---

## 4. L3 — Lane specialisations

Only the fields that genuinely cannot live at L2.

### 003 Northpoint Realty
`property_segment` (farm/residential/industrial/commercial) × `transaction_type` (sale/rental) drives everything: required due diligence, matching logic, document template set, deal stages.

Lane objects: `mandate` (as agreement), `fica_case`, `transfer`, `scrutiny_review` (head-office OTP review — cannot be automated), `commission_split`, `projected_turnover_line`.

Lane stages: 15-stage pipeline including `Northpoint scrutiny`, `Conditions outstanding`, `Transfer instructed`, `Registered`, `Commission due`, `Commission paid`.

### 004 Farm Feed
Lane objects: `price_observation` (SAFEX reference + basis + formula + staleness), `delivered_cost_model`, `export_shipment` + `export_document_set`, `sample`, `weighbridge_record`, `credit_instrument` (LC, guarantee, documentary collection, escrow).

Lane stages: 24-stage canonical pipeline; separate 14-stage loading lifecycle; separate 20-stage export lifecycle.

### 005 Digikraal Livestock Agency
Lane objects: `livestock_group` (species, breed, sex/type, age/tooth class, weight, pregnancy, sire, wool, dressing %), `veterinary_record` (BM/TB, heartwater, redwater), `movement_permit`, `brand_mark`, `payment_flow` (typed: buyer-pays-DK, commission-only, trust/attorney, principal, deposit+balance), `agent_allocation`.

Lane stages: 10-stage pipeline. Separate `completeness_profile` per species/stage/channel.

### 006 Digikraal Property
Lane objects: `underwriting_case` (10 stages, versioned), `property_intelligence_report` (LOOM/Lightstone), `comparable` + `comparable_adjustment` + `evidence_grade`, `valuation_range`, `investment_scenario`, `cash_requirement` (6 timing phases), `auction` + `bid` + `bid_ceiling`, `spv`, `municipal_case`, `hoa_case`, `compliance_certificate`, `renovation_project`, `payout_statement`.

**Hardest rule in the estate:** the bid ceiling may never be raised autonomously, and unknown costs may never silently default to zero.

### 007 Partner Farming & Trading
Lane objects: `operating_partnership`, `purchase_batch`, `stock_movement` (11 types), `stock_count`, `cash_register` (append-only), `custody_handover` (dual acknowledgement), `funding_facility` + `drawdown` + `allocation`, `capital_interest` (immutable formula versions), `profit_waterfall`, `container_asset`.

**Hardest rule:** profit is only payable when it is cash-backed, reconciled, verified by someone who did not prepare it, and jointly approved.

### 008 Strategic Growth & Capital
Lane objects: `shareholder` + `share_class` + `shareholding_event`, `board`, `resolution`, `reserved_matter`, `venture` (14 stages), `business_case` + `scenario`, `portfolio_score` (12 weighted dimensions), `spv`, `capital_allocation` (11 capital states), `funding_tranche` + `condition_precedent`, `debt_obligation`, `ubuntu_participant` (Types A–D), `distribution`.

**Hardest rule:** capital release requires unanimous board approval, all conditions precedent satisfied, and stops automatically when reporting is overdue.

### 009 Finance, Treasury & Corporate Administration
Lane objects: `chart_account` + `account_mapping`, `tax_code`, `customer_invoice`, `supplier_bill`, `payment_instruction`, `bank_release`, `bank_line`, `allocation`, `journal`, `vat_period`, `payroll_period`, `loan`, `intercompany_account`, `elimination_entry`, `fixed_asset`, `insurance_policy`, `subscription`, `corporate_filing`, `close_task`, `cash_forecast_line`.

**Boundary:** these live in **Clark**, not Pivot. Pivot holds only DJ's decision queue and links.

### 010 Opportunity Lab
Lane objects: `idea`, `opportunity_brief`, `evidence` (levels 0–5), `experiment`, `project_economics`, `capability_route`, `parking_trigger`, `rejection_record`, `handover` (requires receiving-owner acceptance), `lesson`.

### 011 Digital Product & Marketplace
Lane objects: `work_item` (14 types), `release_approval`, `deployment_record`, `incident`, `feature_flag`, `public_metric_definition`, `analytics_event`.

**Boundary:** these live in **Jira/GitHub**, not Pivot. Pivot shows read-only delivery status.

---

## 5. Object count discipline

| Phase | Objects implemented | Rule |
|---|---|---|
| Phase 1 | L0 (9) | Foundation only |
| Phase 2 | + L1 (18) = 27 | Founder spine complete |
| Phase 3 | + L2 (21) + Northpoint L3 (~8) = 56 | One lane to real operational truth |
| Phase 4 | + second lane L3 only (~8) = ~64 | Reuse proves the model |
| Phase 5+ | money and capital layers | Only after operational truth is trustworthy |

If a phase needs more objects than budgeted, the scope is wrong, not the budget.

---

## 6. Naming law

- `snake_case` in database, `camelCase` in TypeScript, human labels in UI.
- Afrikaans operational terms (VERKOOP, SOEK, Gaan Kyk, Laai, Klaar Gelaai) are **UI labels**, never column names.
- The canonical value is stored; the original free text is preserved alongside it in every case. Original wording is never destroyed by normalisation.
