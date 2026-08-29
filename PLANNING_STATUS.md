# Planning Status

**Current phase:** Phase 1 — Clean Product Foundation. Gate 1 not yet passed.

## Ready to go?

**No — not as the daily system of record.** You can sign in, capture inbox items, save meeting notes, and approve or reject queued work. You cannot yet treat Pivot as the live operating system.

| Question | Answer |
|---|---|
| Can DJ log in and capture work? | Yes, if Supabase env is set |
| Is Gate 1 signed? | No |
| Are connectors live (Gmail, WhatsApp, Calendar, money)? | No |
| Can a fabricated transcript or send confirmation appear? | No — transcript import is paste-only; demo restore is blocked in production |
| What still blocks Gate 1? | CI proof, RLS isolation tests, error tracking, tenant schema |

Phase 2 does not start until Gate 1 is signed. Open decisions D-05 and D-06 still block OAuth and recording.

---

## Active authority

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
