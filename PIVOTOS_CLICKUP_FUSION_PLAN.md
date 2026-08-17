> **SUPERSEDED 2026-08-14.** Historical reference only, no authority.
> Its "Built" status claims are not accurate against the Constitution. Current authority: `plan/00_MASTER_INDEX.md`.

# PivotOS × ClickUp Fusion Plan

**Goal:** Adopt ClickUp’s clarity, modularity, and AI-first marketing — while keeping PivotOS’s multi-entity operator model, approval gates, and activity-centric OS.

---

## 1. ClickUp Essence (what we’re borrowing)

### Positioning
- **One platform replaces many tools** — bold consolidation promise (“software to replace all software”).
- **Three outcomes:** save money (fewer apps), save time (shared context), infinite productivity (AI agents + workflows).
- **Low-friction entry:** “Free forever. No credit card.”

### Product mental model
| ClickUp layer | What it does |
|---|---|
| Workspace | Company / team home |
| Spaces & Folders | Projects grouped by function |
| Tasks & Custom Fields | Atomic work with metadata |
| Views | List, Board, Calendar, Gantt, Everything |
| Inbox | Triage incoming work |
| Brain (AI) | Context-aware assistant across all data |
| Super Agents | Role-specific digital workers |
| Automations | If-this-then-that across the stack |
| Docs / Chat / Calendar | Collocated context (no tab sprawl) |

### UX patterns
- **Module grid** — colorful tiles instantly communicate breadth.
- **Problem → solution arc** — “work sprawl kills context” → “everything in one place.”
- **Vertical workflows** — PM, Marketing, Engineering tabs with “REPLACES” competitor row.
- **Agent roster per vertical** — Intake Agent, PM Agent, Triage Agent, etc.
- **Social proof stack** — ROI stats, quotes, awards, enterprise trust.

### Design language
- Huge bold headlines, muted secondary line in hero.
- Checkmark bullets for value props.
- Black primary CTA, white secondary.
- Bordered feature grid (not floating cards).
- Sticky minimal header: logo + Sign up.
- Dark stats band before final CTA.

---

## 2. PivotOS Differentiators (what we keep)

| PivotOS strength | Why it beats generic ClickUp for you |
|---|---|
| **Multi-entity by design** | DJ Eksteen, DigiKraal, Farm Feed, Northpoint — strict RLS separation |
| **Activity-centric OS** | Not task-manager-first; universal Activity object from real spreadsheet ops |
| **Entity → Division → Workstream** | Maps to DJ Werk sheet structure (not ClickUp Space/Folders only) |
| **Universal Inbox intake** | WhatsApp, email, forms, meetings, voice — classify then route |
| **Process Engine** | Repeatable business workflows with steps (deals, quotes, listings) |
| **Human approval gate** | Agents propose; humans approve before external tool execution |
| **Today Command Centre** | “What matters now” — not infinite views |
| **Offline-first PWA** | Field ops, poor connectivity — ClickUp doesn’t lead here |

**North star (unchanged):** Open app → within 3 seconds know approvals, active processes, blocked work, and agent suggestions.

---

## 3. Conceptual mapping: ClickUp → PivotOS

| ClickUp | PivotOS equivalent | Status |
|---|---|---|
| Workspace | Entity (company) | ✅ Built |
| Space / Folder | Division | ✅ Built |
| List / Sprint | Workstream | ✅ Built |
| Task | Activity (`items`) | ✅ Built |
| Everything View | Command Centre + cross-entity scope | ✅ Partial |
| Inbox | Universal Inbox | ✅ MVP |
| Today / Home | Today page | ✅ Built |
| Brain AI | Agent Workforce + Memory | 🟡 Spark + demo agents |
| Super Agents | Named agents per entity (Sales, Finance, EA…) | 🟡 Registry + factory |
| Automations | Process Engine + spawn from inbox | 🟡 MVP |
| Custom Status | Activity types + process steps | ✅ |
| Goals | Deals / opportunities / revenue panel | 🟡 Partial |
| Docs | Documents module | 🟡 Roadmap |
| Chat | Inbox sources (WhatsApp, email) | 🟡 Manual intake |
| Calendar | Meetings workflow | ✅ Built |
| Dashboards | Mission Control 4-panel | ✅ V2 |
| Approvals | Approvals queue | ✅ Built |
| Integrations | Tools + connections | 🟡 Catalog |
| Guests | Entity members (owner/admin/member/viewer) | ✅ RLS |

---

## 4. Combined workflow (the “ClickUp way” inside PivotOS)

```
Capture (Inbox / Quick Capture / Meeting / Integration)
    ↓
Classify (entity · division · workstream · urgency · suggested agent)
    ↓
Attach to Process OR spawn new process from template
    ↓
Agent proposes next step / draft / tool action
    ↓
Human Approval (if risk ≥ threshold)
    ↓
Tool execution + Activity Log + Memory update
    ↓
Surfaces on Today + Command Centre panels
```

### ClickUp habits we adopt in product
1. **Single intake** — everything lands in Inbox first (no scattered entry points).
2. **Views are lenses** — same Activities shown as list (tasks), board (processes), calendar (meetings), revenue (deals).
3. **Agents are first-class** — every vertical gets named agents on the landing page *and* in the app.
4. **Context travels** — entity scope persists; switching entity never leaks data.
5. **Status at a glance** — Today replaces checking 6 spreadsheets.

---

## 5. Landing page narrative (ClickUp structure, PivotOS story)

| Section | ClickUp pattern | PivotOS copy |
|---|---|---|
| Hero | Replace all software | **Software to replace spreadsheet chaos** |
| Bullets | Save money / time / productivity | Fewer apps · perfect entity context · AI agents that execute |
| Module grid | 12+ product tiles | Inbox, Today, Processes, Agents, Approvals, Meetings, Deals, Tools, Memory, Entities, Command Centre, Offline |
| Problem | Work sprawl | **60% of operator context lives in sheets, WhatsApp, and memory** |
| Solution grid | 100+ features | Capability cloud mapped to real modules |
| AI section | Brain² | **Pivot Brain** — entity-scoped memory, ambient suggestions, approval-safe |
| Vertical tabs | PM / Marketing / Eng | DigiKraal · Farm Feed · Northpoint · Personal |
| Stats | ROI band | Hours saved, entities unified, approval safety |
| CTA | Get started FREE | Open Pivot OS / Sign up |

---

## 6. Implementation phases

### Phase A — Landing & narrative (this sprint) ✅
- ClickUp-inspired marketing page on Next.js `/`
- Fusion plan doc (this file)
- Align Vite `/home` marketing page for dev parity

### Phase B — Navigation & IA (ClickUp sidebar feel)
- Collapsible sidebar: Home (Today), Inbox, Processes, Agents, Tools, Approvals, More
- Entity switcher always visible (like Workspace switcher)
- “+ Quick capture” persistent (like ClickUp task create)

### Phase C — Views on same data
- Activities: List view (existing tasks), Board (process kanban), Calendar (meetings)
- Command Centre = “Everything view” filtered by entity

### Phase D — Agent workforce (ClickUp Super Agents)
- Ship 6 core agents: Chief of Staff, Sales, Finance, Meeting, Document, Follow-up
- Each agent card: job, tools, can/cannot, approval rules
- Agent suggestions on Today (already started)

### Phase E — Automations & integrations
- Process templates library (Lead, Quote, Listing, Invoice follow-up)
- Tool connections: Gmail, WhatsApp, Xero (read → draft → approve → send)
- Inbox webhooks / Zapier bridge

### Phase F — Pivot Brain
- Entity-scoped memory search
- Daily briefing from Today + inbox + overdue
- Ambient: “3 debtors overdue — Finance Agent drafted reminders”

---

## 7. What we explicitly do NOT copy

- ClickUp’s infinite feature sprawl without operator focus
- Generic team/project-first hierarchy (we stay entity → division → workstream)
- AI auto-send without approval on financial/comms actions
- Replacing DJ Werk semantics with generic “tasks”

---

## 8. Success metrics

| Metric | Target |
|---|---|
| Time to “what matters today” | < 3 seconds |
| Inbox → classified activity | < 30 seconds |
| Entities switchable without reload | Instant |
| Agent action → approval → log | Full audit trail |
| Landing → sign up → Today | < 2 minutes |

---

*PivotOS: ClickUp’s clarity. Operator-grade control.*
