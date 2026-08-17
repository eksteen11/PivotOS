# Pivot OS Constitution

**Version:** 1.1  
**Status:** Approved 2026-08-14; collaboration and SaaS direction amended 2026-08-16 — active product law  
**Authority:** Overrides stale guidance in `Pivot_OS_Master_Context_v0.1.md`, `MASTERPLAN.md`, and the previous demo-oriented `PROJECT_PLAN.md` / `BUILD_PLAN.md` where they conflict  
**First commercial lane:** Northpoint Realty (003)  
**Source material:** Knowledge Base capabilities 001–011  

---

## 1. What Pivot OS Is

Pivot OS is DJ Eksteen’s **Founder Operating System**.

It coordinates an AI workforce across multiple businesses so the founder captures everything, AI organises and prepares, invited people contribute within explicit scopes, humans approve important actions, and AI executes safe work.

It is **not**:
- a generic CRM
- an ERP
- a task manager
- an unrestricted company-wide staff tool for every Digikraal employee
- a replacement for Xero, Sage, Propverse, Property24, or the Digikraal marketplace

**Mantra:** Complex inside. Effortless outside.  
**North star:** Build the intelligence. Hide the complexity. Reveal only what moves the founder forward.

---

## 2. Product Identity (Non-Negotiable)

| Product | Owner / Users | Job |
|---|---|---|
| **Pivot OS** | DJ Eksteen first; invited colleagues in scoped company areas; later, isolated customer businesses | Founder command, delegated execution, priorities, approvals, cross-business leverage |
| **Clark** | Conrad, Emma, Sonnica, Drikus, future finance users | Shared multi-user finance workspace |
| **Digikraal Marketplace** | Product/dev under Capability 011 | Public marketplace platform at digikraal.co.za |
| **External ledgers / CRMs** | Entity operators | Statutory and domain systems of record |

### Boundary rules
1. Pivot remains founder-first. Colleagues receive access only where collaboration creates value; they never inherit access to DJ's full workspace.
2. Clark is a **separate product program**, not a tab that pretends to be full group finance inside Pivot.
3. Pivot may surface founder exceptions, links, and approvals from Clark — it does not become the accounting system.
4. Capability 011 owns marketplace delivery; Capability 005 owns agency CRM consumption of marketplace events.
5. Founder-private domains and records are private by default and cannot be exposed through company membership.
6. Each future SaaS customer operates inside an isolated tenant; no customer data, search result, agent memory, integration or audit event may cross tenant boundaries.

---

## 3. The Immutable Laws

1. **Capture everything** — WhatsApp, email, voice, meetings, documents, payments, leads, ideas, photos.
2. **AI organises everything** — humans do not manually file information into the right place.
3. **Maximise founder leverage** — every feature must increase DJ’s value creation.

### Operating chain

```text
Capture → Universal Inbox → AI classify / prepare → Human approval (when required) → Execute → Log → Improve
```

### Human vs AI
1. Humans create and decide.
2. AI organises and prepares.
3. Humans approve important decisions.
4. AI executes safe operational work.
5. AI measures outcomes and improves.

---

## 4. Entities in Scope

| Entity / Domain | Role in Pivot |
|---|---|
| DJ Eksteen (personal) | Founder Command Centre, personal ops, private notes |
| Digikraal (Pty) Ltd | Agency, property investment, partner trading, ventures, finance exceptions |
| DK Agri (Pty) Ltd | Related agricultural entity (finance/accounting visibility) |
| Farm Feed (Pty) Ltd | Commodity trading OS |
| Northpoint Realty | Western Cape agency OS |
| Lebab / Venture Studio | Venture and experiment context (via 008 / 010) |
| Family / church domains | Restricted personal domains — strict privacy, never mixed into company views |

Shareholding context (Digikraal governance): ITS 40% · CJ du Plessis 30% · DJ Eksteen 30%.

---

## 5. Capability Map (Bible Remains Source of Detail)

| # | Capability | Pivot role |
|---|---|---|
| 001 | Manage Meetings | Shared meetings engine for all workspaces |
| 002 | Founder Command Centre | Primary product surface — highest priority |
| 003 | Northpoint Realty | First commercial vertical candidate |
| 004 | Farm Feed | Commercial vertical (after first SoR lane succeeds) |
| 005 | Digikraal Livestock Agency | Commercial vertical candidate |
| 006 | Digikraal Property Investment | Principal investor OS |
| 007 | Partner Farming & Trading | Stock/cash/profit-waterfall engine |
| 008 | Strategic Growth & Capital | Board, capital, portfolio governance |
| 009 | Finance / Treasury / Admin | Founder exceptions in Pivot; Clark is shared product |
| 010 | Opportunity Lab | Idea screening and routing |
| 011 | Digital Product & Marketplace | Delivery and release control for marketplace engineering |

Knowledge Base files remain the **domain detail authority**. This Constitution is the **product authority**.

---

## 6. Shared Platform Spine (Build Once)

Do not rebuild these per workspace.

1. Universal Inbox  
2. Founder / Today Command Centre  
3. Approval Centre  
4. Process / stage engine  
5. Agent registry + tool permissions  
6. Activity / audit log  
7. Memory layer  
8. Tenant, entity and record scope + RLS  
9. Contacts  
10. Documents  
11. Meetings engine (001)  
12. Integrations Hub  
13. Commercial matching pattern (reusable)  
14. Finance exception pattern (prepare → approve → reconcile visibility)
15. Operating Map — a permission-filtered visual hierarchy of companies, teams, systems, processes, agents and tools

Workspaces are **domain skins + domain objects** on this spine — never separate apps with duplicated inbox/approvals/agents.

---

## 7. Canonical Spine Objects

Minimum shared model before deep vertical work:

| Object | Purpose |
|---|---|
| `Entity` | Legal/logical business boundary |
| `Contact` | People and organisations |
| `InboxItem` | Captured raw input awaiting classification / routing |
| `Thread` | Conversation continuity |
| `Meeting` | Scheduled interaction + prep + outcomes |
| `Task` / `Process` / `ProcessStep` | Executable work |
| `Document` | Files, checklists, evidence |
| `Approval` | Human gate for risky actions |
| `ActivityLog` | Immutable trail |
| `Memory` | Durable agent/founder context |
| `Agent` | Digital employee with permissions |
| `ToolConnection` | External system link + sync state |
| `Deal` / `Opportunity` (abstract) | Commercial or investment case extended per vertical |

Verticals extend these objects. They do not invent a second inbox or second approval system.

---

## 8. System of Record Matrix

| Domain | Operational truth | Statutory / external authority | Pivot role |
|---|---|---|---|
| Founder priorities / approvals | Pivot Supabase | — | Owns |
| Inbox / triage | Pivot Supabase | WhatsApp / Gmail providers | Owns ops; syncs providers |
| Meetings | Pivot Supabase | Google Calendar | Owns outcomes; calendar is schedule authority |
| Northpoint pipeline | Pivot Supabase (target) | Propverse / Property24 | Orchestrates; does not replace head-office CRM blindly |
| Farm Feed deals | Pivot Supabase (target) | Sage | Ops truth in Pivot; Sage accounting authority |
| Livestock agency | Pivot Supabase (target) | Digikraal website events | Agency CRM in Pivot; marketplace in 011 |
| Property investment | Pivot Supabase | Attorneys / banks / LOOM/Lightstone inputs | Owns underwriting dossier |
| Partner trading | Pivot Supabase event model | Xero | Ops + payout truth in Pivot; ledger sync carefully |
| Group finance workflows | **Clark** | Xero (Digikraal, DK Agri) / Sage (Farm Feed) | Pivot shows DJ exceptions only |
| Ventures / capital | Pivot + board artefacts | Legal/SPV docs | Owns decision trail |
| Marketplace product | Jira / GitHub / staging / prod | Live digikraal.co.za stack | Pivot shows delivery status; 011 owns release mechanics |

**Hard rule:** No silent overwrite between Pivot operational truth and accounting ledgers.

---

## 9. Approval Matrix (Always)

Approval required before:
- outbound WhatsApp / email that is non-trivial or externally consequential
- payments, payment releases, invoice/bill writes to ledgers
- contracts / legal document dispatch
- public listing / social publish
- deletes of important records
- permission changes
- final commercial status transitions (sold / paid / completed / capital released)

AI may draft and recommend freely. AI may not bypass this matrix.

---

## 10. Privacy & Trust

- Entity-scoped RLS by default  
- Family / personal / church domains never leak into company workspaces  
- POPIA-aligned handling  
- Secrets never in client bundles or seed files  
- Founder-owner access by default; collaborators enter only through explicit tenant, entity and capability grants  

---

## 11. Clean Rebuild Stance

### Keep
- Git repository
- Supabase project + MCP connection
- OpenAI API connection
- Auth / env patterns that work
- Useful schema ideas and migrations as starting material
- Knowledge Base 001–011 as domain bible

### Reset / quarantine
- Demo theater UI and fake-complete workspaces
- Keyword “stage engines” pretending to be real pipelines
- Dual-app confusion (legacy Vite vs Next as equal products)
- Demo-first planning docs that celebrate navigable skins over operational truth

### Rule
**Brownfield infrastructure. Greenfield product experience.**  
Rebuild the app against this Constitution and `MAMMOTH_PLAN.md`. Do not polish the current demo into the mammoth.

---

## 12. First Production Slice Decision

**Default first serious slice (recommended):**

> Founder Command Centre (002) + Universal Inbox + Approvals + Meetings (001) + **one commercial SoR lane**

**Commercial lane choice (pick one before Phase C coding):**
- **Option A — Northpoint Realty (003)** if agency deal flow is the fastest path to daily use
- **Option B — Digikraal Livestock Agency (005)** if Digikraal revenue ops are the faster path to real data

Do **not** choose Farm Feed, Partner Trading, Property Investment, Ventures, Clark, and Marketplace as the first depth lane simultaneously.

---

## 13. Explicit Non-Goals (Until Later Phases)

- Building all nine workspaces to production depth
- Replacing Propverse, Property24, Xero, Sage, or digikraal.co.za
- Autonomous payments or autonomous legal commitments
- Unapproved scraping / hidden browser automation
- Multi-user Pivot rollout to the whole company
- Treating Clark as “just another Pivot page”
- Agent factory sprawl before operational data is trustworthy

---

## 14. Success Standard

A feature is Constitution-compliant only if:
1. It increases founder leverage  
2. It respects entity boundaries  
3. It uses the shared spine  
4. It honours the approval matrix  
5. It does not fake a live external action  
6. It has a clear system-of-record owner  

---

## 15. Approval Gate

This Constitution was **approved 2026-08-14**.

Active execution follows `MAMMOTH_PLAN.md`.  
Knowledge bases remain detail specs under this Constitution.  
First commercial lane: **Northpoint Realty (003)**.
