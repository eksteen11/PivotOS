> **SUPERSEDED 2026-08-14.** Historical reference only, no authority.
> Current authority: `plan/07_ROADMAP.md`.
> The progress log below ("nine business workspaces") does not meet the Constitution's definition of complete. See `plan/08_GAP_REGISTER.md` Part B.

# PivotOS Detailed Build Plan

## Build Rule
Complete one vertical slice at a time. Every slice must preserve entity boundaries, approval gates, activity logging, responsive parity, and a passing production build before the next slice starts.

## Phase 1 — Secure Product Foundation

### Slice 1.1: Responsive application shell
- Replace the desktop bottom-only navigation with a persistent business sidebar.
- Keep a touch-friendly mobile navigation pattern.
- Add visible entity context and workspace switching.
- Apply Manrope, the bold modern accent system, and consistent responsive spacing.
- Verify: authenticated navigation works at desktop, tablet, and mobile widths.

### Slice 1.2: Founder-only cloud demo
- Keep Supabase Auth as the secure entry point.
- Add founder-only profile and access rules.
- Add deterministic seed and reset operations for cloud demo data.
- Ensure unauthenticated and unauthorised access is denied.
- Verify: login, logout, protected routes, reset, and reseed work.

### Slice 1.3: Shared platform state
- Standardise entity scope, status, ownership, activity, and audit fields.
- Add loading, empty, error, and sync states.
- Add the Activity Log screen.
- Verify: changing entity scope updates all shared platform views.

## Phase 2 — Founder Core and Safe AI

### Slice 2.1: Global Command Centre
- Expand the Today View with priorities, approvals, risks, revenue, meetings, stalled work, and overnight AI activity.
- Add business health cards linking into each workspace.
- Verify: DJ can identify the top action, risk, and approval within three seconds.

### Slice 2.2: Universal Inbox
- Support realistic email, WhatsApp, voice, document, meeting, payment, lead, and idea items.
- Add deterministic AI classification, entity routing, urgency, and suggested action.
- Guide items into tasks, processes, deals, meetings, documents, or opportunities.
- Verify: capture → classify → route → log works end-to-end.

### Slice 2.3: Approval-gated mock AI
- Put all AI behaviour behind one service contract.
- Return recommendation, reason, source context, confidence, risk, approval, and next action.
- Simulate approval, rejection, edit, execution, failure, and retry.
- Verify: no sensitive simulated action can execute without approval.

### Slice 2.4: Simulated integrations
- Build shared connector states and activity for WhatsApp, Gmail, Calendar, Drive, Xero, Sage, banking, Airtable, property portals, marketplace, Paystack, Jira, GitHub, and Confluence.
- Verify: connectors display realistic disconnected, syncing, connected, and failed states.

## Phase 3 — Shared Operational Engines

### Slice 3.1: Processes, tasks, contacts, and documents
- Add record detail, history, process steps, task progression, contacts, and documents.
- Port only proven behaviour from the legacy Vite app.
- Verify: a record can move from capture to completion with a full activity trail.

### Slice 3.2: Meetings
- Add meeting register, calendar, preparation pack, simulated transcript, decisions, tasks, and follow-up.
- Verify: meeting → transcript → approved tasks works.

### Slice 3.3: Commercial engine
- Add reusable lead, supply, demand, matching, listing, viewing, deal, document, logistics, and stage components.
- Verify: one seeded deal can move end-to-end through every shared commercial state.

### Slice 3.4: Finance and governance engine
- Add invoices, bills, payments, treasury, reconciliation, reporting, capital decisions, and governance approvals.
- Verify: proposed payment → approval → simulated ledger result → audit history works.

## Phase 4 — Multi-Business Workspaces

### Slice 4.1: Northpoint Realty
- Sellers, buyers, properties, listings, matching, viewings, offers, transfers, and commission.

### Slice 4.2: Farm Feed
- Supply and demand, product intelligence, matching, SAFEX pricing, contracts, transport, export, and Sage simulation.

### Slice 4.3: Digikraal Livestock Agency
- Livestock intake, missing information, listings, offers, viewings, payments, commission, loading, and transport.

### Slice 4.4: Digikraal Property Investment
- Opportunity intake, underwriting, funding, acquisition, renovation, rental or sale, and investor reconciliation.

### Slice 4.5: Partner Farming and Trading
- Opportunity, batch purchase, stock movements, sales, cash custody, reconciliation, profit waterfall, and payout.

### Slice 4.6: Strategic Growth and Capital
- Venture portfolio, business cases, SPVs, board decisions, capital tranches, monitoring, and returns.

### Slice 4.7: Finance, Treasury and Administration
- Group finance inbox, AP, AR, banking preparation, VAT, payroll, intercompany, consolidation, and month-end.

### Slice 4.8: Opportunity Lab
- Capture, clarify, screen, explore, test, decide, route, promote, park, and reject.

### Slice 4.9: Digital Product and Marketplace
- Backlog, development, review, staging, business approval, release, production, and incident monitoring.

### Workspace Verification
- Every workspace uses persistent seeded cloud data.
- Every workspace connects to the Founder Command Centre, Universal Inbox, approvals, meetings, documents, and Activity Log.
- Every workspace is fully usable on desktop, tablet, and mobile.

## Phase 5 — Completion and Deployment

### Slice 5.1: End-to-end demo journeys
- Founder morning briefing and approval journey.
- Commercial lead-to-close journey.
- Finance proposal-to-reconciliation journey.
- Idea-to-venture-to-product journey.

### Slice 5.2: Security and quality
- Test auth, founder-only access, Row Level Security, entity isolation, approval bypass, responsive layouts, and failure states.
- Pass lint and production build.

### Slice 5.3: Final deployment
- Deploy Next.js to Vercel and the cloud demo schema to Supabase.
- Verify seeded data, reset controls, protected access, logs, and all critical journeys.
- Freeze the legacy Vite app after Next.js feature parity.

## First Build Slice
Start with Phase 1, Slice 1.1: responsive application shell. It establishes the navigation and visual structure required by every later workspace without changing business logic.

## Progress Log
- Phase 1 complete: shell, secure demo reset controls, entity-scoped views, Activity Log, sync/loading/error states.
- Phase 2 complete: expanded Command Centre, mock AI classify service, approval-gated simulated execution, Integrations Hub connectors, nine business workspaces.
- Phase 3 in progress: process detail + step runner, Meetings with simulated transcripts, commercial/finance stage engines on workspaces.
- Remaining: deeper record models, richer seeded journeys, deploy verification, and migration 0012 apply when Supabase reconnects.
