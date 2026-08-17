# 02 — Reusable Engine Catalogue

**Authority:** `CONSTITUTION.md` → `plan/01_DOMAIN_MODEL.md` → this document  
**Status:** v1.0, 2026-08-14

Every knowledge base independently arrived at the same conclusion: *build reusable engines, not one-off copies of spreadsheets.* KB 003 names ten engines, KB 004 names eighteen, KB 005 names eleven. They overlap heavily.

This document defines **13 engines** that cover all of them. Each engine is built once, configured per lane.

---

## Engine index

| # | Engine | Built in phase | Used by |
|---|---|---|---|
| E1 | Capture & Classification | 2 | all |
| E2 | Completeness | 2 | 003,004,005,006,007 |
| E3 | Approval & Risk | 2 | all |
| E4 | Contact & Relationship | 2 | all |
| E5 | Document Checklist | 3 | 003,004,005,006,007,009 |
| E6 | Matching | 3 | 003,004,005,006 |
| E7 | Pipeline & Stage | 3 | 003,004,005,006,007,008,010,011 |
| E8 | Pricing & Landed Cost | 3 | 004,005,006 |
| E9 | Verification & Evidence | 3 | 003,004,005,006,007,008,010 |
| E10 | Settlement & Waterfall | 5 | 003,004,005,007,008 |
| E11 | Reconciliation | 5 | 007,009 |
| E12 | Obligation & Calendar | 4 | 003,006,009 |
| E13 | Learning & Outcome | 6 | all |

---

## E1 — Capture & Classification Engine

**Job:** turn any inbound signal into a structured, routed, proposal-bearing inbox item.

**Inputs:** WhatsApp forward/paste, Gmail, web form, marketplace webhook, voice note, document upload, manual capture.

**Pipeline:**
```
raw capture (preserved verbatim, immutable)
  → contact resolution
  → entity + capability routing
  → intent classification
  → urgency / money risk / relationship risk scoring
  → conversion proposals (1..n)
  → confidence + rationale
```

**Configuration per lane:** intent taxonomy. Farm Feed has 23 intents; Livestock has 16; Northpoint has 13; Founder Command Centre has 10 domain tags including family and church.

**Hard rules:**
- Raw payload is never modified by classification.
- Every classification stores model version and rationale.
- Low confidence surfaces as low confidence. It is never hidden.
- The founder sees exceptions, not the full stream.

**Output contract:** every proposal carries `{recommendation, reason, source_refs, confidence, risk, requires_approval, next_action}`.

---

## E2 — Completeness Engine

**Job:** know what information is missing, for which stage, and chase it conversationally.

**Model:** a `completeness_profile` is a set of field requirements keyed by `(lane, object_type, subtype, stage, channel)`.

Example — Livestock: fields required *before listing* differ from *before buyer presentation*, *before contract*, and *before loading*, and differ again by species.

**Behaviour:**
1. Detect missing fields for the target stage.
2. Draft one concise request asking only for the unresolved items.
3. Read the reply, update structured fields, preserve original wording.
4. Stop asking once the stage threshold is met.

**Hard rules:**
- Missing detail never blocks capture. It blocks stage progression.
- The engine never invents a value to fill a gap.
- "Unknown" stays visibly unknown; it never defaults to zero or to a plausible guess.

---

## E3 — Approval & Risk Engine

**Job:** decide whether a proposed action may execute, who must approve it, and prove afterwards that it was approved.

**Inputs:** action type, monetary value, counterparty, entity, risk flags, policy configuration.

**Outputs:** `required_approvers[]`, `approval_mode` (single / joint / unanimous board), `conditions[]`, `expiry`.

**Configuration is data, not code.** Thresholds change without a deploy.

**Modes observed across the knowledge bases:**

| Mode | Where | Rule |
|---|---|---|
| Single founder | 009 finance payments | One founder approval sufficient at any value, with enhanced anomaly warnings |
| One-of-N | 011 production release | Drikus OR Conrad OR Emma; approval must be identifiable and retained |
| Joint | 007 partner deals | Founder AND operating partner |
| Unanimous board | 008 capital release | All three shareholder groups |
| External non-replaceable | 003 OTP scrutiny | Northpoint head office — Pivot may never substitute |
| Emergency with retrospective | 011 hotfix | Act first, document immediately, obtain retrospective approval |

**Hard rules:**
- AI may prepare and recommend. AI never approves its own proposal.
- Preparer may not be sole approver where segregation applies (007, 008).
- Material change after approval forces re-approval.
- A WhatsApp message is evidence of a decision, never the decision record itself.
- Approval is stored with the exact payload approved. Payload drift invalidates it.

---

## E4 — Contact & Relationship Engine

**Job:** one person, one record, across every channel and entity.

**Capabilities:** identity resolution across phone/WhatsApp/email/marketplace account; deduplication with human confirmation; role assignment per entity; consent and communication preference tracking; evidence-based reliability signals.

**Hard rules:**
- Reliability signals are evidence-based. No defamatory or speculative labels.
- Relationship data is internally scoped and never exposed externally.
- Consent state governs outbound. POPIA purpose limitation applies.

---

## E5 — Document Checklist Engine

**Job:** know which documents a transaction needs, at which stage, whether they exist, whether they are consistent, and whether they are verified.

**Model:** `document_requirement` records keyed by `(lane, transaction_type, subtype, stage)`, satisfied by `document` records.

**Cross-checks:** names, ID numbers, property/erf references, quantities and amounts must agree across documents in the same deal.

**Lane examples:**
- Northpoint: Mandate, Annexure B, Annexure E, OTP (per segment), buyer FICA, seller FICA, Property Condition Report.
- Farm Feed export: BOL, commercial invoice, packing list, certificate of origin, phytosanitary, fumigation, FBO registration.
- Livestock: veterinary certificates, pregnancy certificates, movement permits, brand/ear tag records, weighbridge slips, FICA.
- Property: title deed, zoning, servitudes, rates clearance, levy clearance, electrical COC, plumbing, beetle, gas, guarantees.

**Hard rules:**
- Signed documents are immutable. Corrections create new versions.
- AI may select templates, populate drafts, detect gaps and compare fields. AI may never issue legal advice, alter a signed document, send a final legal document unreviewed, or state that a deal is legally complete.

---

## E6 — Matching Engine

**Job:** connect supply to demand with a score and an explanation.

**Inputs:** supply record, demand record, catalogue profiles, distance/transport model, price model, verification levels.

**Outputs:**
```
{ score, hard_matches[], compromises[], hard_mismatches[],
  missing_information[], distance_and_transport_impact,
  estimated_delivered_cost, estimated_margin,
  risks[], recommended_action, draft_messages{buyer, seller} }
```

**Lane configuration:**
- Northpoint: segment-aware; agricultural matching must use specialist facts (water rights, zoning, servitudes, infrastructure), never residential logic.
- Farm Feed: grade substitution, packaging alternatives, partial quantity, multi-supplier fulfilment, reverse matching, delivered-cost profitability.
- Livestock: species/breed/sex/age/weight/pregnancy/health plus transport economics.
- Property: comparable selection with similarity score and evidence grade.

**Hard rules:**
- **Explainability is mandatory.** Every match states what matched, what did not, what was assumed, what is missing.
- Sourcing never simply returns the cheapest option; delivered cost, reliability, quality, timing and documentation all count.
- Confidential and off-market supply is access-controlled and may not leak into a match shown to an unauthorised party.
- Counterparty identity may be masked where the commercial structure requires it.
- Every recommendation is later measured against the actual outcome (feeds E13).

---

## E7 — Pipeline & Stage Engine

**Job:** run any lifecycle as data, not as hardcoded screens.

**Per stage configuration:** required information · required documents · owner · due date · approval rule · entry and exit timestamps · stalled threshold · next-best action.

**Lifecycles it must run:** Northpoint 15-stage deal + 11-stage listing + 14-stage buyer requirement · Farm Feed 24-stage deal + 14-stage loading + 20-stage export · Livestock 10-stage deal + 15-stage listing · Property 23-stage deal + 16-stage transfer + 10-stage underwriting · Partner 15-stage deal · Venture 14-stage · Idea 8-stage · Product 15-stage.

**Hard rules:**
- Stage history is append-only with actor, timestamp, reason and evidence.
- A lane may skip an irrelevant stage; it may not delete the record of having done so.
- Stalled detection is a first-class output, not a report someone has to run.

---

## E8 — Pricing & Landed Cost Engine

**Job:** compute what something really costs delivered, and what margin remains.

**Core formula (Farm Feed §16.3):**
```
delivered_cost = acquisition + loading + transport + storage/handling
               + agent_commission + insurance + finance_cost
               + export/shipping + other
expected_gross_profit = selling_revenue − delivered_cost
```
Per-unit and total both required.

**Market reference:** `price_observation` stores the referenced contract/market price, the plus/minus basis, the formula, the source, the timestamp and a staleness flag. Stale prices are flagged and require human confirmation before external quoting.

**Property variant (KB 006):** works *backwards* from required profit, ROCI and margin of safety to a maximum safe bid, across cash-timing phases.

**Hard rules:**
- Unknown cost components remain visibly unknown. They never default to zero.
- Formula versions (transfer duty, sheriff fees, attorney costs, VAT rates, interest conventions) are versioned, configurable and reviewed before transaction approval.
- Best case, expected case and worst case are all shown before a margin decision.
- Deals below the margin threshold or with incomplete cost data require explicit human decision.

---

## E9 — Verification & Evidence Engine

**Job:** never let a claim masquerade as a fact.

**Verification levels (livestock/property/general):**
```
0 not verified · 1 stated by counterparty · 2 observed by agent
3 document-confirmed · 4 professional-confirmed (vet/valuer/attorney)
5 legally registered / audited
```

**Evidence grades for valuation (KB 006 §11):** registered transfer · signed transaction evidence · active asking price · agent opinion · automated estimate · municipal valuation · auction marketing claim · internal assumption.

**Evidence levels for ideas (KB 010 §18):** conversation · initial indication · external validation · commercial evidence · pilot evidence · investment ready.

**Hard rules:**
- An asking price may never be presented as an achieved sale price.
- AI may not conclude health, pregnancy or condition from appearance.
- The exact wording of veterinary and professional statements is preserved verbatim.
- A conversation is not a commitment; a named partner is not a contracted partner; a funding conversation is not available cash.

---

## E10 — Settlement & Waterfall Engine

**Job:** work out who gets paid what, in what order, and prove it.

**Generic model:**
```
verified proceeds received and reconciled
− refunds / disputed receipts
− allocated acquisition capital
− approved direct and shared costs
− approved capital interest
= distributable result
→ ordered distribution by configured waterfall
→ per-party settlement balance
```

**Lane configurations:**
- Northpoint commission: deal value → commission % → gross → referral split → agent split → DJ share → VAT → invoice → due → received → variance vs forecast.
- Farm Feed: Farm Feed / DJB / Valor / external agent shares.
- Livestock: external buyer and seller agents, then internal shares.
- Partner Trading: interest recovered *before* the 50/50 split; investor return deducted from Digikraal's share only.
- Ventures: per-SPV configurable payout / reserve / debt-reduction percentages, never hardcoded across the portfolio.

**Profit recognition ladder — a single stored state, not a label:**
```
forecast → invoiced → accrued → cash-backed → settlement-ready → approved → paid
```

**Hard rules:**
- Only cash-backed, reconciled and approved profit becomes payable.
- The preparer of a payout may not be its sole approver.
- Waterfall percentages live in configuration per agreement.
- Distribution is blocked if it would breach law, funding covenants, solvency, liquidity, tax obligations or minimum reserves.

---

## E11 — Reconciliation Engine

**Job:** match reality to records and make every difference visible work.

**Domains:** bank lines ↔ invoices/bills/receipts · physical cash counts ↔ cash register · physical stock counts ↔ movement ledger · attorney payout statements ↔ cost forecast · intercompany balances ↔ counterpart entity · Pivot operational events ↔ Xero/Sage postings.

**Daily equations (KB 007):**
```
cash:  opening + received − expenses − purchases − handovers − deposits = expected close
       physical count − expected close = variance

stock: opening + purchases + transfers in − deliveries − transfers out
       − verified mortality/theft/use/write-off = expected close
       physical count − expected close = variance
```

**Hard rules:**
- Matches are append-only and reversible. Nothing is silently amended.
- High-confidence exact matches may be auto-prepared; ambiguous matches require a human.
- An unexplained variance stays assigned to the last acknowledged custodian until evidence resolves it.
- Neither Pivot nor the accounting system may silently overwrite the other. Differences open a reconciliation exception.
- An exception is never closed by deleting the underlying evidence.

---

## E12 — Obligation & Calendar Engine

**Job:** one real obligation, many views, no duplicate task rows.

An insurance renewal appears simultaneously in the corporate register, the payment queue, the cash forecast, the document checklist, the accounting posting schedule, the renewal calendar and the founder's decision queue — all pointing to **one** canonical obligation.

**Covers:** mandate expiry · OTP condition deadlines · transfer milestones · compliance certificate expiry · VAT and payroll periods · CIPC filings · insurance and subscription renewals · funding drawdown and repayment dates · auction and bid deadlines · parked-idea review triggers · listing expiry.

**Hard rules:**
- Every deadline has an owner and an escalation path.
- Material compliance risk escalates into the Founder Command Centre.
- The same obligation is never copied into unrelated task rows.

---

## E13 — Learning & Outcome Engine

**Job:** close the loop the Master Context demands: Collect → Measure → Analyse → Recommend → Approve → Implement → Compare → Learn.

**Measures:** which AI recommendations were accepted · which accepted recommendations produced revenue · match acceptance rate and realised margin · draft reply acceptance rate · which lead sources convert · which document gaps delay transactions · which meetings move pipeline · predicted vs achieved sale price, rent, renovation cost and bid accuracy.

**Hard rule:** every recommendation is stored with its prediction so it can later be compared to the actual outcome. A recommendation with no measurable outcome is a defect in the design, not an acceptable state.
