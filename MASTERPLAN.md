> **SUPERSEDED 2026-08-14.** Historical reference only, no authority.
> Its generic "AI Business Operating System" identity conflicts with the Constitution: Pivot OS is DJ Eksteen's Founder Operating System.
> Current authority: `CONSTITUTION.md` → `plan/00_MASTER_INDEX.md`.

# Pivot OS — Masterplan V3

## AI Business Operating System

**Version:** 3.0  
**Status:** Active build  
**Stack:** Next.js · TypeScript · Tailwind CSS · Supabase · OpenAI-ready

---

## 0. Executive Summary

Pivot OS is an **AI Business Operating System** where users create companies, departments, processes, AI agents, and connected tools. The system operates like a **virtual company with digital employees**.

**This is not a CRM.** It is a runtime for running companies through AI workers with human oversight.

**North star:** Open the app → within 3 seconds know what to do today, what needs approval, what agents are running, and what is blocked.

**Core chain:**

```
Universal Inbox → Process Engine → AI Agent → Tool Access → Human Approval → Execution Log → Memory
```

---

## 1. Core Idea

| Layer | Owner |
|---|---|
| Companies | Humans |
| Departments | Companies |
| Processes | Departments |
| Execution | AI Agents |
| External actions | Tools (approved APIs) |
| Risk | Human approvals |
| Truth | Logs + memory |

---

## 2. Canonical Glossary

| Term | Definition |
|---|---|
| **Entity / Company** | Legal or logical business unit (Digikraal, Farm Feed, Northpoint, Pivot OS, DJ Eksteen) |
| **Department** | Functional unit inside an entity (maps to `divisions` in DB) |
| **Workstream** | Optional execution lane under department (82 seeded from DJ Werk import) |
| **Process** | Repeatable business workflow with steps |
| **Agent** | Digital employee with role, tools, and approval rules |
| **Tool** | External capability (Gmail, Xero, WhatsApp, etc.) |
| **Approval** | Human gate before sensitive agent action |
| **Memory** | Durable context for agents |
| **Activity Log** | Immutable execution trail |
| **Universal Inbox** | Single intake for all incoming work |
| **Today** | Command centre — only what matters today |

---

## 3. Product Modules (MVP)

### 3.1 Universal Inbox
- All incoming items land here
- Types: email, WhatsApp, document, voice note, meeting, manual note, form lead
- Classify by: entity, department, process, urgency, suggested agent
- UI: big-card deck, not dense lists

### 3.2 Today Command Centre
- Urgent approvals
- Active processes
- Overdue tasks
- Agent recommendations
- Blocked work
- Important incoming items

### 3.3 Process Engine
- Every inbox item becomes or attaches to a process
- Templates: Lead, Quote, Legal, Finance, Follow-up, Listing, Document review
- Fields: title, entity, department, status, steps, assigned agent, human owner, deadline, history
- UI: kanban board with step progress

### 3.4 AI Agent Registry
- Agents stored in database, not hardcoded
- Fields: name, entity, department, role, job description, responsibilities, allowed tools, approval rules, memory scope, supervisor, escalation, status

### 3.5 Agent Factory
- Create agents without code
- Wizard: name → entity/dept → role → tools → permissions → memory → activate
- Suggestion engine: pattern detection → "Create Debtors Agent?"

### 3.6 Tool Connection Centre
- Connect Gmail, Calendar, Drive, WhatsApp, Xero, Sage, HubSpot, Airtable, Property24, Webhooks, Custom API
- OAuth-ready; MVP uses placeholders when keys absent
- Credentials server-side only

### 3.7 Tool Permission System
- Levels: `none` | `read` | `draft` | `execute_with_approval` | `execute_auto`
- Agents may only use permitted tools

### 3.8 Approval Centre
- Required for: send email/WhatsApp, payments, deletes, signing, new agents, tool grants, settings changes
- Card: agent, action, reason, data, risk, approve/edit/reject

### 3.9 Memory Layer
- Postgres tables now; pgvector later
- Kinds: contact, preference, decision, process_history, document_summary, pattern, performance

---

## 4. Navigation (5 primary + More)

1. **Today** — command centre
2. **Inbox** — universal intake
3. **Processes** — workflow board
4. **Agents** — registry + factory
5. **More** — Tools, Approvals, Settings

---

## 5. Object Model

```
User → Entity → Department → Process → Steps
                    ↓
              Agent → Tools (permissioned) → Approval → Log → Memory
```

| Object | Table | Notes |
|---|---|---|
| User | `auth.users` | Supabase Auth |
| Entity | `entities` | Keep |
| Department | `divisions` | Rename in UX only |
| Workstream | `workstreams` | Keep for import compatibility |
| Process | `processes` | New |
| Process step | `process_steps` | New |
| Agent | `agents` | New |
| Tool catalog | `tools` | New |
| Tool connection | `tool_connections` | New |
| Agent tool grant | `agent_tools` | New |
| Task / activity | `items` | Universal substrate — keep |
| Approval | `approvals` | New |
| Memory | `memories` | New |
| Log | `activity_logs` | New |
| Document | `documents` | New |
| Contact | `contacts` | New (+ `items.type=contact`) |

---

## 6. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js App Router, TypeScript, Tailwind CSS |
| Backend | Supabase (Auth, Postgres, Storage, Edge Functions) |
| Offline | Dexie in client components (optional cache) |
| AI | OpenAI via Edge Functions |
| Deploy | Vercel + Supabase |

**Why Next.js:** OAuth callbacks, webhooks, server-side tool execution, middleware auth, marketing + app in one product.

---

## 7. Database Migrations

| Migration | Purpose |
|---|---|
| 0001–0009 | Core entities, items, workstreams, RLS fix |
| 0010 | Pivot OS core: processes, agents, tools, approvals, memories, logs |
| 0011 | Demo seed: agents, tools, processes, approvals |

---

## 8. UX Law

- Apple + Linear + Notion, but simpler
- Big clean decks, not dense dashboards
- Max 5 primary nav items
- One main action per card
- Calm, executive, spacious
- Status badges: `urgent`, `waiting`, `blocked`, `needs_approval`, `agent_active`

---

## 9. Phased Roadmap

### Phase 0 — Foundation (current)
- MASTERPLAN V3, migration 0010/0011, Next.js shell, design system, demo seed

### Phase 1 — Today + Inbox
- Today Command Centre, Inbox card UI, classification, inbox → process spawn

### Phase 2 — Process Engine
- Process board, step runner, templates

### Phase 3 — Agent Registry + Factory
- Directory, wizard, suggestions

### Phase 4 — Tools + Permissions
- Connection centre, permission matrix, mock execution

### Phase 5 — Approval Centre
- Queue, approve/edit/reject, wire to logs

### Phase 6 — Memory + Logs
- Memory CRUD, activity timeline, agent context

### Phase 7 — Real Integrations
- Gmail, Calendar, WhatsApp, Xero OAuth; pgvector memory

---

## 10. MVP Demo Behaviour

Without real API keys:
1. Inbox shows seeded WhatsApp + email items
2. Classify → spawns Lead process on Digikraal
3. Sales Agent proposes email → Approval created
4. Approve on Today → mock send logged
5. Agent Factory suggests Debtors Agent
6. Tools page shows Connect placeholders

---

## 11. Success Metrics

- Time-to-clarity on Today: < 3 seconds
- Inbox → classified process: < 30 seconds
- Agent action → approval → log: fully traceable
- Zero silent sync failures
- Entity scope never leaks (RLS verified)

---

## 12. Seed Agents

CEO Agent, Executive Assistant, Sales Agent, Finance Agent, Legal Agent, Marketing Agent, Operations Agent, Listing Agent, Farm Feed Quote Agent, Digikraal Livestock Agent, Northpoint Property Agent

---

## 13. Migration from Vite PWA

| Legacy | V3 |
|---|---|
| `src/app/views/CommandCentrePage` | `app/(app)/today` |
| `src/app/views/InboxPage` | `app/(app)/inbox` |
| `src/app/views/AgentsPage` | `app/(app)/agents` |
| `divisions` | Departments (UX label) |
| `items` | Keep as activity stream |
| Vite hash router | Next.js App Router |

Legacy Vite app remains under `src/` until feature parity; primary dev: `npm run dev` (Next.js).

---

*Pivot OS V3 — run companies through AI workers.*
