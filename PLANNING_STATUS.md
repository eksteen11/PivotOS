# Planning Status

**Current phase:** Phase 1 — Clean Product Foundation. Gate 1 not yet passed.

**Implementation checkpoint — 2026-10-20 (bounded):** landing + preview + protected desk/calendar interaction milestone was wired and verified locally (typecheck/lint/build + browser checks). This does **not** mark a phase gate complete and does not claim live channel integrations. Evidence is in `plan/BUILD_PROGRESS.md`.

**Founder updates — 2026-10-20:** layout exploration is active. Confirmed direction and decisions are in `plan/interviews/SHARED.md`: WhatsApp first; source-specific inboxes and company/section filters; Kraaldesk eventually owns agency operations; Pivot and linked apps replace Google Sheets; every work item is durably saved/tracked; continuous agent learning is a core requirement. See `plan/CONTINUOUS_LEARNING.md` and the cattle seller workflow draft. These are planning decisions, not completed features.

**Combined product proposal:** `plan/PRODUCT_BLUEPRINT.md` now consolidates the Monday and HubSpot findings into navigation, case UX, AI/context/learning behaviour, a staged 40-item feature log and acceptance criteria. `plan/HUBSPOT_RESEARCH_AND_PRODUCT_DIRECTION.md` records the additional evidence and account upgrade limits. Monday findings remain retained. These are proposed refinements, not completed features or final UX approval.

---

## Active authority

**Research added 2026-10-20:** `plan/MONDAY_RESEARCH_AND_PRODUCT_DIRECTION.md` proposes shared Table/Pipeline/Calendar views, a case workspace, contextual AI, versioned approval-aware workflows and agent operations/learning visibility. Research is complete within the documented access limits; final UX and build scope remain under review. No implementation or phase-gate completion is implied.

| Rank | Document |
|---|---|
| 1 | `CONSTITUTION.md` — approved 2026-08-14 |
| 2 | `MAMMOTH_PLAN.md` — approved 2026-08-14 |
| 3 | **`plan/00_MASTER_INDEX.md`** — start here for the detailed corpus |
| 4 | `TECH_STACK.md` · `DESIGN_RULES.md` |
| 5 | Knowledge Base 001–011 — domain detail |

**Start here:** `plan/00_MASTER_INDEX.md`

---

## Detailed planning corpus (added 2026-08-14)

| Document | Answers |
|---|---|
| `plan/01_DOMAIN_MODEL.md` | The object language — 4 layers across all 11 capabilities |
| `plan/02_ENGINE_CATALOGUE.md` | 13 reusable engines |
| `plan/03_AGENT_REGISTRY.md` | 12 agent archetypes, permissions, prohibitions |
| `plan/04_APPROVAL_MATRIX.md` | Every action requiring a human |
| `plan/05_INTEGRATION_MATRIX.md` | System-of-record map, auth methods, honesty contract |
| `plan/06_PLATFORM_SPEC.md` | Environments, security, testing, CI, DR, cost, retention, errors, search, notifications |
| `plan/07_ROADMAP.md` | 8 phases with hard gates |
| `plan/08_GAP_REGISTER.md` | 17 open decisions, 19 resolved conflicts, 17 risks |

---

## Decisions locked

- Founder approval: 2026-08-14 — "yes we go"
- First commercial lane: **Northpoint Realty (003)**
- Recommended second lane: Livestock Agency (005) — pending confirmation
- Rebuild stance: keep Supabase, OpenAI and the repo. Rebuild the product experience. No demo theatre.

---

## Superseded — historical reference only

`PROJECT_PLAN.md` · `BUILD_PLAN.md` · `MASTERPLAN.md` · `INTEGRATION_AND_AI_AGENT_BLUEPRINT.md` · `PIVOTOS_CLICKUP_FUSION_PLAN.md` · `UX_OPERATING_SYSTEM.md` · `WIREFRAME_LAYOUT_SYSTEM.md` · `Pivot_OS_Master_Context_v0.1.md`

These retain historical value. They carry no authority.

---

## Awaiting founder decision

Seventeen open decisions are listed in `plan/08_GAP_REGISTER.md` Part A. Two are needed soon:

- **D-05** Google account ownership (personal vs company Workspace) — blocks Phase 2 OAuth
- **D-06** Meeting recording consent policy — blocks Phase 2 meetings
