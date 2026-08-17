# PivotOS Technical Stack

**Authority:** Follows `CONSTITUTION.md` + `MAMMOTH_PLAN.md` (approved 2026-08-14).

## Architecture Decision
Brownfield infrastructure, greenfield product experience.

Keep the Next.js + Supabase + OpenAI foundation. Rebuild the product UI and domain depth cleanly. Treat the previous navigable demo as disposable prototype, not the destination product.

## Core Stack
| Layer | Choice |
|---|---|
| Web application | Next.js App Router, installable PWA |
| Language | TypeScript |
| UI | React + Tailwind CSS |
| Authentication | Supabase Auth (founder-first) |
| Database | Supabase Postgres + RLS |
| File storage | Supabase Storage |
| AI | OpenAI via one `lib/ai` service interface; safe deterministic fallback allowed |
| Integrations | Adapter interface; real OAuth where approved; simulated only when clearly labelled |
| Deploy | Vercel + Supabase |
| Local cache | Dexie only for offline-safe capture |

## Product Structure (Phase 1+)
Primary signed-in IA:
- Command Centre (`/today`)
- Universal Inbox (`/inbox`)
- Approvals (`/approvals`)
- Meetings (`/meetings`)
- Activity (`/activity`)
- Settings (`/settings`)
- Business scope inside the same Pivot account: DJ Private, Digikraal and its divisions, Farm Feed, Northpoint

Northpoint is the first lane built to operational depth, not a separate product or tenant. Do not expose unbuilt verticals as complete workspaces.

## App Delivery
- Phone-first responsive layout with full core feature parity on desktop
- Five-item phone bottom navigation
- Labelled desktop sidebar
- Browser-installable first; native app-store packaging is deferred

## Data Rules
- Pivot Supabase = operational truth for founder spine and active lane
- Xero / Sage remain statutory ledgers
- Clark remains shared finance product (not faked inside Pivot)
- No silent overwrite between ops truth and ledgers
- Secrets never in client code

## AI Contract
Every AI result includes: recommendation/draft, reason, source context, confidence, risk, approval requirement, next action, audit event.

## Security Baseline
- DJ is the tenant owner; collaborator capability remains disabled until the approved pilot
- Deny-by-default RLS
- Approval matrix enforced for risky actions
- Honest labelling of simulated vs live connectors

## Quality Gates
- `npm run build` pass
- Phase DoD met before next phase
- Entity isolation verified
- No approval bypass
