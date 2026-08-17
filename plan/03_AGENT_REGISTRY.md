# 03 — AI Agent Registry & Permission Model

**Authority:** `CONSTITUTION.md` → `plan/02_ENGINE_CATALOGUE.md` → this document  
**Status:** v1.0, 2026-08-14

---

## 0. The problem this solves

The knowledge bases name **roughly 140 distinct AI agents**. Building 140 agents is how the product dies. The Constitution already names the failure mode: *"agent factory sprawl before operational data is trustworthy."*

Almost all 140 are the same handful of behaviours pointed at different data.

**This registry defines 12 agent archetypes.** A "Northpoint Seller Intake Agent" is not a new agent — it is the **Intake archetype** bound to the Northpoint lane with a Northpoint completeness profile.

---

## 1. The twelve archetypes

| # | Archetype | Engines it drives | Replaces (examples from KBs) |
|---|---|---|---|
| A1 | **Triage** | E1 | WhatsApp Intake, Email Intake, Website Inbox, Communications Orchestrator, Opportunity Scout, Lead Classification |
| A2 | **Intake** | E1, E2 | Seller Intake, Buyer Intake, Opportunity Intake, Idea Capture, Contact Resolution |
| A3 | **Completeness** | E2 | Missing Information Agent, Document Checklist Agent, Property Data Agent, Buyer Qualification |
| A4 | **Drafting** | E1 | Reply drafting (WhatsApp/Email outbound), Listing copy, Seller updates, Collection messages, Release notes |
| A5 | **Matching** | E6 | Property Matching, Buyer–Seller Matching, Sourcing, Comparable Value |
| A6 | **Pricing** | E8 | Pricing Agent, Delivered-Cost, Margin, Investment Calculator, Commercial Analyst |
| A7 | **Coordinator** | E7, E12 | Deal Coordinator, Viewing Coordinator, Loading Coordinator, Transfer Tracking, Follow-up, Meeting Coordinator |
| A8 | **Preparation** | E5, E7 | Meeting Preparation, Briefing Pack, OTP Preparation, Contract Preparation, Investor Pack, Board Pack |
| A9 | **Intelligence** | E1, E13 | Meeting Intelligence, Action Extraction, Research Agent, Listing Performance, Analytics Anomaly |
| A10 | **Reconciliation** | E11 | Reconciliation Agent, Payout Reconciliation, Xero Coordination, Stock Controller |
| A11 | **Risk & Control** | E3, E9 | Risk Agent, Credit & Risk, Exception Management, Accounting Review, Compliance/FICA |
| A12 | **Executive** | all | Founder Agent, CEO Agent, Revenue Agent, Portfolio Controller, Weekly Accountability |

---

## 2. Agent definition contract

Every agent instance is a **row**, not a codebase.

```
agent {
  id
  archetype            A1..A12
  entity_id            which workspace
  capability_id        001..011
  display_name         "Northpoint Seller Intake"
  purpose              one sentence
  data_scope           which objects, which entities, which confidentiality levels
  tool_grants[]        tool_connection + permission_level
  action_grants[]      action types it may propose
  approval_policy      per action type
  memory_scope         entity / capability / global
  supervisor_agent_id  escalation target
  model_profile        model, temperature, max tokens, cost ceiling
  prompt_version       pinned
  status               active / paused / archived
}
```

**No agent runs without an explicit `data_scope`, `action_grants` and `approval_policy`.** There is no implicit "can do anything in its entity" default.

---

## 3. Permission levels

Inherited from the existing schema (`tool_permission_level`) and made authoritative:

| Level | Meaning | Example |
|---|---|---|
| `none` | No access | — |
| `read` | May read data | Read Gmail thread for a briefing pack |
| `draft` | May create a draft that is never sent | Draft a WhatsApp reply |
| `execute_with_approval` | May execute after a recorded human approval | Send the approved reply |
| `execute_auto` | May execute unattended | Only for explicitly whitelisted low-risk templates |

### `execute_auto` allowlist policy

`execute_auto` is **off by default for every agent and every tool**. It may only be enabled when all of the following are true:

1. The action is not externally visible **or** is a pre-approved template with fixed content.
2. The action cannot move money.
3. The action cannot create a legal obligation.
4. The action is reversible or trivially correctable.
5. The founder has explicitly enabled it as a written policy, recorded in `audit_event`.

Everything else is `execute_with_approval` or lower.

---

## 4. The universal prohibition list

No agent, in any archetype, in any lane, may:

- approve its own proposal
- release money from a bank account
- sign or send a final legal document without human review
- alter a signed document
- change supplier or beneficiary bank details
- raise an approved bid ceiling or spending limit
- submit a statutory return (VAT, PAYE, CIPC)
- fabricate a number, a quote, a valuation or a veterinary conclusion
- present an asking price as an achieved price
- hide low confidence
- alter or delete an audit entry
- close an incident or exception by removing the underlying evidence
- conceal that it is AI
- access a system that has not been approved (no scraping, no undisclosed browser automation)
- deploy to production
- expose or rotate secrets

This list is enforced in code at the action-dispatch layer, not merely in prompts.

---

## 5. Agent output contract

Every agent output, without exception:

```
{
  recommendation | draft,
  reason,                 // why, in plain language
  source_refs[],          // which records/messages/documents informed this
  confidence,             // and it is displayed, never hidden
  risk_level,
  requires_approval,      // resolved by E3, not by the agent
  next_action,
  prediction?             // if applicable, stored for E13 outcome comparison
}
```

An output missing `reason` or `source_refs` is rejected by the platform before it reaches the UI.

---

## 6. Rollout schedule

Agents are not built because they were named in a knowledge base. They are built when the data they operate on is trustworthy.

| Phase | Archetypes enabled | Instances |
|---|---|---|
| **2** | A1 Triage, A2 Intake, A4 Drafting, A8 Preparation | 4 — founder spine only |
| **3** | + A3 Completeness, A5 Matching, A7 Coordinator | ~7 — Northpoint lane |
| **4** | + A6 Pricing, A9 Intelligence | ~9 — second lane |
| **5** | + A10 Reconciliation, A11 Risk & Control | ~12 — money lanes |
| **6** | + A12 Executive | ~14 |
| **7** | lane instances multiply; archetypes do not | — |

**Hard cap:** no new archetype without a Constitution amendment. New lanes get new *instances*, never new archetypes.

---

## 7. Supervision and escalation

```
Founder
  └── A12 Executive (Founder Agent / CEO Agent)
        └── lane A12 instance (Northpoint CEO, Farm Feed CEO, ...)
              └── operational agents (A1–A11)
```

Escalation triggers: confidence below threshold · conflicting instructions · risk level ≥ high · repeated failure · action blocked by prohibition list · counterparty dispute.

Escalation always terminates at a human. There is no agent-to-agent loop that can resolve a blocked action.

---

## 8. Model, cost and prompt governance

| Control | Rule |
|---|---|
| Model selection | Per `model_profile`. Cheap model for classification; stronger model for drafting and analysis |
| Prompt versioning | Prompts are versioned artefacts in the repo, referenced by id. An agent pins a version |
| Prompt change | Requires an eval run against the golden set before it goes live (see `plan/06_PLATFORM_SPEC.md` §9) |
| Cost ceiling | Per agent per day, and per workspace per month. Exceeding pauses the agent and raises an exception |
| Determinism | Anything that can be computed in code is computed in code. Language models classify, extract, summarise and draft. They do **not** calculate totals, VAT, ageing, margins, waterfalls or eliminations |

That last row is the single most important line in this document. It comes directly from KB 009: *"Deterministic calculations, explainable AI."*

---

## 9. Failure behaviour

| Failure | Behaviour |
|---|---|
| Model unavailable | Fall back to deterministic path, label the result as reduced-capability, never silently degrade quality without saying so |
| Low confidence | Surface as "needs your eyes", do not auto-convert |
| Contradictory sources | Raise an exception with both sources shown; never pick one silently |
| Hallucination suspected (fact not in `source_refs`) | Block the output; the platform validates that asserted facts trace to a source ref |
| Repeated failure | Pause the agent, notify the founder, log to `audit_event` |
