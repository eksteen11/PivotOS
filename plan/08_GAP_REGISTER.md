# 08 — Gap, Decision & Risk Register

**Status:** v1.0, 2026-08-14  
**Purpose:** everything still unanswered, everything that contradicted itself, and everything that could kill the programme. Nothing hidden.

---

## Part A — Open decisions the founder must make

Each has a **needed by** phase. Work up to that phase proceeds without it.

| ID | Decision | Options | Needed by | Default if unanswered |
|---|---|---|---|---|
| D-01 | WhatsApp access route | Meta Cloud API (verification + number + webhook) · approved BSP · permanent forward/paste | Phase 4 | Forward/paste stays a first-class feature |
| D-02 | Second commercial lane | Livestock (005) · Farm Feed (004) · Property (006) | Phase 4 | Livestock — highest volume, most WhatsApp-native, most matching-driven |
| D-03 | Property24 access | Feed · API · enquiry email parsing · manual publish checklist | Phase 3 | Manual publish checklist, honestly labelled |
| D-04 | Propverse access | API · scheduled export · manual | Phase 3 | Manual |
| D-05 | Google account ownership | Personal vs company Workspace for calendar, mail and Drive | Phase 2 | Ask before OAuth scopes are requested — this is a real blocker |
| D-06 | Meeting recording consent policy | Always ask · per meeting type · never record | Phase 2 | Do not record. Import transcripts only where consent is already established |
| D-07 | Bank-detail change control | Keep current (warn only) · add mandatory independent verification | Phase 5 | **Recommend adding verification.** Current policy plus permitted self-approval is the largest single fraud exposure in the estate |
| D-08 | Recording/transcript retention period | 30 / 90 / 365 days · indefinite | Phase 2 | 90 days, then summary only |
| D-09 | Sage integration route | API if available · structured export/import | Phase 5 | Export/import |
| D-10 | Payroll system | Unconfirmed in KB 009 | Phase 5 | Discovery required before any payroll work |
| D-11 | SAFEX price data source | Paid feed · broker statement · manual entry | Phase 6 | Manual entry with visible staleness |
| D-12 | Clark build sequencing | Inside this repo · separate product · defer | Phase 5 | Separate product; Pivot links to it |
| D-13 | Northpoint head-office approvers | Who exactly signs off listings, mandates and OTPs | Phase 3 | Track as `EXTERNAL`, name required before go-live |
| D-14 | DJ commission split rules | Exact percentages and referral treatment | Phase 3 | Required before commission forecasting is trusted |
| D-15 | Authoritative OTP and mandate templates | Which versions are current | Phase 3 | Required before document generation |
| D-16 | Ubuntu SME risk policy | Loss responsibility, insurance, enforcement | Phase 6 | **Capital release prohibited until approved** (KB 008 explicit) |
| D-17 | Stilfontein split | Papi 50 / Digikraal 25 / ITS 25 — unsigned | Phase 6 | Provisional. Must not be treated as final |
### Decisions locked 2026-08-16
- **Collaborators:** design and test scoped access now; DJ remains the only active user until a later pilot is approved.
- **Sharing:** entity + capability grants for the first version; founder-private records remain owner-only.
- **SaaS tenancy:** one isolated customer tenant may contain several related companies.
- **Operating Map:** open at company level, then drill into systems and processes in one combined layered map.

---

## Part B — Conflicts found across existing documents, and their resolution

The audit found nineteen contradictions between planning documents. All are resolved in favour of the Constitution.

| Conflict | Losing position | Resolution |
|---|---|---|
| Product identity | MASTERPLAN: generic multi-user "AI Business Operating System" with companies and departments | **Pivot is DJ's Founder OS.** Founder-first. Clark is the shared company product |
| Build goal | PROJECT_PLAN / BUILD_PLAN: fully navigable demo of every workflow | **Founder spine + one real lane.** No demo theatre |
| Workspace exposure | BUILD_PLAN: nine workspaces in one phase | **One lane at a time**, others hidden until real |
| Navigation | MASTERPLAN: Today, Inbox, Processes, Agents, More · WIREFRAME: no Approvals | **Command Centre, Inbox, Approvals, Meetings, Activity, Settings + active lane.** Approvals is not optional; it is the product |
| Home screen naming | UX_OPERATING_SYSTEM: separate "Global Command Centre" and "Today View" | **One home. Command Centre at `/today`** |
| Agent strategy | INTEGRATION blueprint: 18 named agents · MASTERPLAN: Agent Factory as MVP | **12 archetypes, instantiated per lane.** No factory until data is trustworthy |
| Data model | MASTERPLAN object model with divisions and workstreams as core | **`plan/01_DOMAIN_MODEL.md` L0–L3** |
| Finance | PROJECT_PLAN: Finance workspace inside Pivot | **Clark owns finance.** Pivot shows DJ's exceptions |
| Marketplace | PROJECT_PLAN: Digital Product workspace inside Pivot | **Jira and GitHub own delivery.** Pivot shows read-only status |
| Design tokens | UX_OPERATING_SYSTEM: dark base, green accent | **`DESIGN_RULES.md`: Manrope, soft neutrals, one strong accent** |
| Offline | CLICKUP_FUSION: offline-first PWA | **Offline capture only.** No offline approval |
| Multi-user | Earlier plans alternated between team invites and founder-only through Phase 5 | **Founder-first with scoped collaborators.** Private founder areas remain owner-only; SaaS customers are isolated tenants |
| Legacy Vite | MASTERPLAN: keep until feature parity | **Archive it.** No dual primary product |
| Progress claims | BUILD_PLAN: "Phase 1–2 complete, nine workspaces" | **Not true against the Constitution's definition.** Reset to Phase 1 |
| Phase count | MASTERPLAN / blueprint: 18 phases · 90-day roadmap | **8 phases, gate-driven, not date-driven** |

**Action:** stale documents get a supersede header rather than deletion. History has value; authority does not transfer with it.

---

## Part C — Coverage gaps now closed

The audit checked thirty planning topics. Eight were entirely absent, twenty-two were partial, none were complete.

| Topic | Was | Now |
|---|---|---|
| Domain model / ERD | Partial | `plan/01_DOMAIN_MODEL.md` |
| Agent roster & permissions | Partial | `plan/03_AGENT_REGISTRY.md` |
| Approval matrix | Present, fragmented | `plan/04_APPROVAL_MATRIX.md`, unified across three products |
| Integration matrix with auth | Partial | `plan/05_INTEGRATION_MATRIX.md` §2 |
| System-of-record map | Present | `plan/05_INTEGRATION_MATRIX.md` §1, extended to Clark and Propverse |
| Migration / backfill | Partial | `plan/06_PLATFORM_SPEC.md` §20 |
| Ingestion & normalisation | Partial | `plan/02_ENGINE_CATALOGUE.md` E1 |
| Notification engine | **Absent** | `plan/06_PLATFORM_SPEC.md` §12 |
| Search | **Absent** | `plan/06_PLATFORM_SPEC.md` §13 |
| Documents & OCR | Partial | `plan/06_PLATFORM_SPEC.md` §14 |
| Audit log spec | Partial | `plan/01_DOMAIN_MODEL.md` L0 + fail-closed rule |
| RLS / security model | Partial | `plan/06_PLATFORM_SPEC.md` §3 |
| Testing strategy | Partial | `plan/06_PLATFORM_SPEC.md` §4 |
| Demo vs real data policy | Partial | `plan/06_PLATFORM_SPEC.md` §21 |
| Environments | Partial | `plan/06_PLATFORM_SPEC.md` §1 |
| Backup & DR | Partial | `plan/06_PLATFORM_SPEC.md` §7 |
| Observability | Partial | `plan/06_PLATFORM_SPEC.md` §6 |
| Cost model | **Absent** | `plan/06_PLATFORM_SPEC.md` §8 |
| Performance budgets | **Absent** | `plan/06_PLATFORM_SPEC.md` §17 |
| Offline / mobile | Partial | `plan/06_PLATFORM_SPEC.md` §15 |
| Multi-user / delegation | Partial | `plan/06_PLATFORM_SPEC.md` §22 |
| Onboarding a new entity | **Absent** | `plan/06_PLATFORM_SPEC.md` §19 |
| Error taxonomy | **Absent** | `plan/06_PLATFORM_SPEC.md` §11 |
| Release process / CI | **Absent** | `plan/06_PLATFORM_SPEC.md` §5 |
| Analytics instrumentation | Partial | `plan/06_PLATFORM_SPEC.md` §18 |
| POPIA handling | Partial | `plan/06_PLATFORM_SPEC.md` §16 |
| Prompt management & eval | **Absent** | `plan/06_PLATFORM_SPEC.md` §9 |
| AI failure / hallucination | **Absent** | `plan/06_PLATFORM_SPEC.md` §10 |
| Rate limits | Partial | `plan/06_PLATFORM_SPEC.md` §8 |
| Data retention | Partial | `plan/06_PLATFORM_SPEC.md` §16 |

---

## Part D — Risk register

Ranked by what actually kills the programme.

| # | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-01 | **Scope gravity** — eleven capabilities pull the build in eleven directions and nothing reaches depth | Fatal | High | Phase gates. One lane. Object budgets. No phase starts before the previous gate signs |
| R-02 | **Demo theatre returns** — screens look complete, nothing is real, trust collapses | Fatal | High | Honesty contract in `05` §3. Gate 1 removes it. Every empty state tells the truth |
| R-03 | **Spine never becomes habit** — beautiful verticals on an unused foundation | Fatal | Medium | Gate 2 requires two weeks of unprompted daily use before any lane depth |
| R-04 | **WhatsApp never lands** — the dominant channel stays outside the system | Severe | Medium | Forward/paste designed as a permanent first-class path, not a stopgap |
| R-05 | **Money without evidence** — a payout or settlement is wrong and trust in the numbers dies | Severe | Medium | Phase 5 gates: cash-backed only, segregation, reconciliation, evidence ladder |
| R-06 | **Bank-detail fraud** — self-approval permitted plus no independent verification of changed beneficiary details | Severe | Medium | D-07. Strong recommendation to add verification before Phase 5 |
| R-07 | **AI fabrication reaches a counterparty** — an invented fact goes out under DJ's name | Severe | Medium | Source-ref validation, approval gates, prohibition list enforced in code |
| R-08 | **Dual truth drift** — Pivot and Xero/Sage disagree and nobody notices | Severe | Medium | No silent overwrite. Differences open exceptions. Reconciliation is work, not a report |
| R-09 | **Migration double-counts** — a 154-field row imported as one transaction inflates stock and money | Severe | Medium | Six-phase migration. Never a blind copy. Signed-off opening position |
| R-10 | **Capital released on a simulation** — an attractive model rather than satisfied conditions unlocks money | Severe | Low | Unanimous approval, conditions precedent, automatic funding stop, SME risk gate |
| R-11 | **Bid ceiling breached at auction** | Severe | Low | Hard enforcement; ceiling changes require a new approval record |
| R-12 | **POPIA exposure** — family, FICA and ID data in ordinary views or logs | Serious | Medium | Confidentiality levels, restricted access, log scrubbing, retention schedule |
| R-13 | **OpenAI cost runaway** | Serious | Medium | Per-agent and per-workspace ceilings that pause rather than surprise |
| R-14 | **Key-person concentration** — architecture lives in one contractor's head (Ryan, KB 011) | Serious | Medium | Documentation requirement; knowledge may not live only in private messages |
| R-15 | **Two codebases** — Vite and Next diverge and effort splits | Moderate | High | Gate 1 archives the Vite app |
| R-16 | **Regulated credit accidentally** — the Ubuntu buy-back product may trigger consumer-credit obligations | Serious | Medium | Blocked by the SME risk policy gate. Legal review before launch |
| R-17 | **Scraping a portal** — Property24 or Propverse terms breached | Moderate | Low | Explicit prohibition; manual checklist is an acceptable answer |

---

## Part E — The five things most likely to have been missed, now named

The founder's instinct that "something is missing in the planning" was correct. These are the five:

1. **There was no single object language.** Eleven knowledge bases, roughly 380 named objects, no map from one to another. Without it, every lane would have become a separate application. Now: four layers, one vocabulary.

2. **There was no engine plan.** Every knowledge base said "build reusable engines" and none of them said which engines. The lists overlapped but never converged. Now: thirteen engines, each built once, configured per lane.

3. **The agent count was unbounded.** Roughly 140 agents named across the documents, no consolidation, and the Constitution's own warning about factory sprawl unheeded by the older plans. Now: twelve archetypes with a hard cap and a phased rollout.

4. **Almost every engineering discipline was absent.** No CI, no test strategy, no backup or restore proof, no observability, no cost control, no error taxonomy, no search, no notification engine, no prompt governance, no hallucination handling, no retention schedule, no onboarding runbook. Eight of these were entirely missing; twenty-two were mentioned but never specified. Now: `plan/06_PLATFORM_SPEC.md`.

5. **The documents contradicted each other nineteen times** on identity, scope, navigation, agents, offline, multi-user and phasing — while three of them claimed the build was further along than the Constitution's own definition allows. Now: every conflict resolved in favour of the Constitution, stale documents marked, and the build reset honestly to Phase 1.

---

## Part F — Review cadence

- This register is reviewed at every phase gate.
- A decision moves from Part A to a Constitution amendment or a spec update when answered.
- A risk moves to closed only when its mitigation is demonstrated, never when it merely feels less likely.
