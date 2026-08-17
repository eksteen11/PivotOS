# 05 — Integration Matrix & System-of-Record Map

**Authority:** `CONSTITUTION.md` → this document  
**Status:** v1.0, 2026-08-14

---

## 0. Two rules that govern everything here

1. **No unapproved scraping or hidden browser automation** as the foundation of any production operation. Confirm API availability, feed support, partner permission, terms of service and auth method first. Where no API exists, use approved import, email parsing, or an honest manual checklist.
2. **No system silently overwrites another.** Where two systems disagree, a reconciliation exception opens, both values stay visible, and a human resolves it. That resolution is audited.

---

## 1. System-of-record map

The question "where does the truth live?" has exactly one answer per data type.

| Data | System of record | Pivot's role |
|---|---|---|
| Founder inbox, classification, proposals, approvals, activity | **Pivot / Supabase** | Owner |
| Contacts, relationships, threads, memory | **Pivot / Supabase** | Owner |
| Meetings, briefings, outcomes, tasks | **Pivot / Supabase** | Owner (Google Calendar is the scheduling mirror) |
| Calendar events | **Google Calendar** | Two-way sync |
| Email content | **Gmail** | Read, classify, draft; approved send |
| WhatsApp content | **WhatsApp** | Capture (forward/paste first, API later); approved outbound |
| Deals, pipelines, matching, operational stock, cash custody | **Pivot / Supabase** | Owner |
| Deal documents (files) | **Google Drive** | Link + metadata in Pivot; file bytes in Drive |
| Statutory accounting: Digikraal (Pty) Ltd, DK Agri (Pty) Ltd | **Xero** | Read and approved write via Clark |
| Statutory accounting: Farm Feed (Pty) Ltd | **Sage** | Read and controlled export/import via Clark |
| Shared finance workflow, review queues, close, forecasts | **Clark** | Pivot shows DJ's exceptions only |
| Bank balances and payment release | **FNB (and other banks)** | Read/import only. Release always at the bank |
| Card / merchant takings | **Yoco, FNB Speedpoint** | Import |
| Subscriptions and platform billing | **Paystack** | Webhook in; Paystack is authoritative |
| Public marketplace: users, listings, offers, messages, entitlements | **digikraal.co.za** | Event stream into Pivot; no duplicate re-entry |
| Product delivery: backlog, releases, approvals, incidents | **Jira (MRK) + GitHub** | Pivot shows read-only status |
| Estate agency official CRM | **Propverse** | Import/link once access confirmed |
| Property portal listings and enquiries | **Property24** | Import/link; **no assumed write access** |
| Property intelligence reports | **LOOM / Lightstone** | Authorised professional access only; extracted evidence stored with source and date |
| Company registration and filings | **CIPC** | Deadline tracking in Pivot; filing at CIPC |
| Tax returns | **SARS / eFiling** | Prepared by Clark; submitted by a human |
| Legal transfer status | **Transfer attorneys / Deeds Office** | Attorneys remain authoritative; Pivot tracks |
| Historical CRM archive | **Airtable** | Read-only archive. Never a production backend |
| Legacy operational sheets | **Google Sheets / DJ Werk** | Import source, then retired |

---

## 2. Integration matrix

Auth method, direction, phase and fallback for each system. `P` = phase from `plan/07_ROADMAP.md`.

| System | Auth method | Direction | P | MVP approach | Fallback if blocked |
|---|---|---|---|---|---|
| **Supabase** | Service role (server) + anon/publishable (browser) + RLS | rw | 1 | Already live | — |
| **OpenAI** | API key, server-side only | out | 1 | Already live | Deterministic path, labelled |
| **Gmail** | Google OAuth 2.0, incremental scopes: `gmail.readonly` → `gmail.compose` → `gmail.send` | rw | 2 | Read + draft first; send only after approval flow proven | Manual paste into inbox |
| **Google Calendar** | Google OAuth 2.0, `calendar.events` | rw | 2 | Two-way event sync | Manual meeting entry |
| **Google Drive** | Google OAuth 2.0, `drive.file` | rw | 3 | Folder + file links, metadata in Pivot | Manual link paste |
| **Google Contacts** | Google OAuth 2.0, `contacts.readonly` first | r → rw | 3 | Read + dedupe proposals, approved write later | CSV import |
| **WhatsApp** | **Undecided.** Options: Meta Cloud API (Business verification + phone number + webhook + token) · approved BSP · manual | in → rw | 2 in, 4 out | **Forward/paste capture only.** No live send until API confirmed | Permanent forward/paste — must remain a first-class path, not a stopgap |
| **Digikraal Marketplace** | Signed webhooks + API key, server-to-server | in | 4 | Listing, offer, message, subscription events | Admin CSV export |
| **Paystack** | Webhook signature verification | in | 4 | Subscription lifecycle events | Dashboard export |
| **Xero** | OAuth 2.0 + refresh token, per-tenant | rw | 5 | Read first; approved writes with idempotency keys | Manual export/import |
| **Sage** | **API availability unconfirmed** | rw | 5 | Controlled export/import achieving equivalent outcome | Structured file exchange |
| **Bank (FNB)** | Statement import (CSV/OFX); feed if available. **No payment API** | in | 5 | Import and reconcile | Manual statement upload |
| **Property24** | **Feed/API availability unconfirmed** | in | 3 | Enquiry email parsing + manual publish checklist | Manual publish checklist (acceptable, must be honest) |
| **Propverse** | **API/export availability unconfirmed** | in | 3 | Approved export import | Manual |
| **LOOM / Lightstone** | Authorised professional account. **No automated extraction** | in | 6 | Human-run report, structured extraction of the resulting file | Manual capture |
| **Jira** | OAuth 2.0 / API token, read scope | in | 6 | Read-only delivery status | Manual status |
| **GitHub** | Fine-grained PAT / GitHub App, read scope | in | 6 | Read-only release status | Manual |
| **Facebook / Meta** | Meta OAuth, page tokens | out | 7 | Approved publication only | Manual posting |
| **SAFEX / market data** | Provider TBD | in | 6 | Manual price observation entry with source and timestamp | Manual — acceptable, staleness must be visible |
| **CIPC** | No API. Deadline tracking only | — | 6 | Calendar obligations | Manual |
| **SARS eFiling** | No API. Human submission | — | 5 | Prepared pack only | Manual |

---

## 3. Connector honesty contract

Every connector in the UI displays exactly one of these states, and the state is true:

| State | Meaning | UI treatment |
|---|---|---|
| `not_connected` | No credentials | Neutral, with a "Connect" action if the integration is real |
| `connected_read` | Live, read-only | Green, scope shown |
| `connected_write_with_approval` | Live, writes gated | Green, scope shown |
| `manual` | No API; the founder does this step, Pivot tracks it | Explicitly labelled "Manual step" — this is a legitimate, respectable state |
| `simulated` | Demo only | Explicitly labelled "Simulated — nothing is actually sent" |
| `error` / `expired` | Broken | Amber/red with the actual reason and the fix |

**Prohibited:** a connector card that looks connected when it is not. A "Sent" confirmation for a message that was never sent. A "Connect" button that only writes a fake row.

> The current codebase violates this: `/api/tools/connect` writes `demo@pivotos.local` as a connected account, and `simulateConnectorExecution` logs a fake execution on approval. Phase 1 must relabel these as `simulated` or remove them.

---

## 4. Integration engineering standards

| Concern | Standard |
|---|---|
| Idempotency | Every outbound write carries an idempotency key. Retries never double-post |
| Correlation | Every integration job carries a correlation id traceable from inbox item to external record |
| Retry | Exponential backoff, capped, with a dead-letter state that becomes an exception |
| Token storage | Server-side only, encrypted. **No service role key, accounting token or provider secret ever reaches a browser** |
| Token refresh | Proactive refresh; expiry surfaces as a connector state, not as a silent failure |
| Rate limits | Per-provider budget with queueing; exceeding raises an exception rather than dropping work |
| Webhooks | Signature verified, replay-protected, idempotent |
| Sync direction conflicts | Detected and raised as reconciliation exceptions; never auto-resolved |
| External change detection | Assume the external system is edited outside Pivot. Poll or subscribe accordingly |
| Failure visibility | A stale integration age is a displayed metric, not a hidden one |

---

## 5. Sequencing rationale

Why Gmail before WhatsApp, when WhatsApp is the dominant channel:

WhatsApp is the highest-value and the highest-risk integration in the estate. Business API access requires verification, a dedicated number, template approval and a webhook. Building the entire approval-gated outbound pipeline against Gmail first means that when WhatsApp access lands, the send-with-approval machinery is already proven, and the only new work is the transport.

Until then, **forward/paste capture is treated as a real product feature** with a proper UI, not as an apology. The founder forwarding a message into Pivot must be a three-tap operation that produces the same classification, proposals and approvals as an API-delivered message.

---

## 6. Open integration decisions

Tracked in `plan/08_GAP_REGISTER.md`: WhatsApp access route · Property24 feed · Propverse export · Sage API · payroll system · SAFEX data source · Google account ownership (personal vs company) · recording consent policy for meetings.

None of these block Phase 1–3. All of them must be answered before the phase that depends on them.
