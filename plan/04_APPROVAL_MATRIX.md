# 04 — Approval, Risk & Money Control Matrix

**Authority:** `CONSTITUTION.md` → this document  
**Status:** v1.0, 2026-08-14  
**Scope:** every action across Pivot OS, Clark and the Digikraal Marketplace that requires a human.

---

## 0. The one sentence

> AI prepares. Humans approve money, commitments, legal documents, capital and statutory submissions. Approval is a record, not a feeling.

---

## 1. Approval modes

| Mode | Definition | Where it applies |
|---|---|---|
| `AUTO` | Executes unattended | Only whitelisted low-risk templates (see agent registry §3) |
| `SINGLE` | One authorised human | Finance payments (009): one founder is sufficient at any value |
| `ONE_OF_N` | Any one of a named set | Production release (011): Drikus OR Conrad OR Emma |
| `JOINT` | Two named parties both approve | Partner deals and settlements (007): founder AND operating partner |
| `SEGREGATED` | Preparer ≠ approver | Payouts, settlements, capital requests |
| `UNANIMOUS_BOARD` | All shareholder groups | Capital release (008): ITS, CJ du Plessis, DJ Eksteen |
| `EXTERNAL` | Approval sits outside Pivot and cannot be replaced | Northpoint head-office OTP scrutiny |
| `EMERGENCY_RETRO` | Act first, document immediately, obtain retrospective approval | Production hotfix (011) only |

---

## 2. Master action matrix

### 2.1 Communications

| Action | Mode | Notes |
|---|---|---|
| Classify an inbound message | `AUTO` | Never externally visible |
| Draft a reply | `AUTO` | Draft only. Drafting is not sending |
| Send WhatsApp / email externally | `SINGLE` | Founder approval by default; auto-send only via explicit written low-risk template policy |
| Publish a listing | `SINGLE` | Human review before publication, every lane |
| Publish social / Facebook content | `ONE_OF_N` | Roche, Emma, Conrad or Drikus. Sensitive topics escalate to management |
| Release confidential counterparty information | `SINGLE` | Never automatic |
| Public claim about market position or trust | `SINGLE` | Requires evidence and review |

### 2.2 Commercial

| Action | Mode | Notes |
|---|---|---|
| Create a deal record | `AUTO` | Record creation is not commitment |
| Advance a pipeline stage | `AUTO` | Unless the stage has its own gate |
| Confirm or quote a binding price | `SINGLE` | Stale market price must be human-confirmed first |
| Accept or reject an offer on a party's behalf | `SINGLE` | Never AI |
| Issue a quote, LOI or contract | `SINGLE` | |
| Agree payment terms | `SINGLE` | |
| Approve credit or a credit limit exception | `JOINT` | 007; autonomous credit approval is out of scope entirely |
| Approve a deal below the margin threshold | `SINGLE` | Explicit decision, never auto-reject and never auto-accept |
| New partner deal commitment | `JOINT` | Founder + operating partner |
| Book transport with financial commitment | `SINGLE` | |
| Sign or send an OTP / lease / mandate | `SINGLE` + `EXTERNAL` | Plus Northpoint head-office scrutiny where applicable |
| Commit to a bid at auction | `SINGLE` | Ceiling pre-approved; **ceiling may never be raised autonomously or exceeded live** |
| Change an approved maximum bid | `SINGLE` | New approval, new record |
| Agree a commission or profit split | `JOINT` | |
| Close a disputed transaction | `SINGLE` | |

### 2.3 Money

| Action | Mode | Notes |
|---|---|---|
| Prepare an invoice or bill | `AUTO` | Preparation only |
| Post to Xero or Sage | `SINGLE` | Every accounting posting requires human approval |
| Prepare a payment instruction | `AUTO` | Clark prepares |
| Approve a payment | `SINGLE` | One founder sufficient; **enhanced anomaly, duplicate, evidence and bank-detail warnings are mandatory because self-approval is permitted** |
| Release a payment at the bank | `EXTERNAL` | Conrad or Drikus, in FNB. Never inside the application |
| Change supplier or beneficiary bank details | `SINGLE` + warning | Currently no separate verification step; system must warn loudly and log prominently. **Flagged as an open control risk — see `plan/08_GAP_REGISTER.md` D-07** |
| Pay another party's bond, arrears, levies or municipal account | `SINGLE` + evidence pack | Requires legal basis, written authority, verified account, deal link, proof, recovery treatment |
| Approve a partner settlement | `SEGREGATED` + `JOINT` | Verified by someone who did not prepare it |
| Pay out profit | `SEGREGATED` + `JOINT` | Only cash-backed, reconciled, approved profit |
| Override negative stock | `JOINT` | Blocked by default; override creates an urgent exception |
| Write off or accept a loss | `JOINT` | Loss-making deals are never hidden |
| Manual interest override | `JOINT` | |
| Submit a VAT return | `EXTERNAL` | Prepared by Clark, submitted by a human at SARS |

### 2.4 Capital and governance

| Action | Mode | Notes |
|---|---|---|
| Capture a venture opportunity | `AUTO` | |
| Spend company money on exploration | `SINGLE` | Research without commitment needs no approval; spending does |
| Sign an agreement, place an order, give a guarantee | `SINGLE` or higher | Per company authority rules |
| Form a legal entity or SPV | `UNANIMOUS_BOARD` | |
| Release capital / a funding tranche | `UNANIMOUS_BOARD` | Plus **every condition precedent satisfied** |
| Any reserved matter (18 listed in KB 008) | `UNANIMOUS_BOARD` | Shares, constitution, borrowing above threshold, security, material property, material related-party, dividend policy, key executives, litigation settlement |
| Distribute returns | `UNANIMOUS_BOARD` | Blocked if it breaches law, covenants, solvency, liquidity, tax or minimum reserves |
| Promote an idea to Capability 008 | `SINGLE` | |

**Automatic funding stop:** capital release halts automatically when required reporting, stock counts, reconciliations or control conditions are overdue. Overriding the stop is itself an approval at the correct threshold.

### 2.5 Product and platform

| Action | Mode | Notes |
|---|---|---|
| Merge a pull request | `ONE_OF_N` | Proportional to risk |
| Deploy to staging | `AUTO` | |
| Deploy to production | `ONE_OF_N` | Drikus, Conrad or Emma. **Silence is not approval** |
| Emergency production hotfix | `EMERGENCY_RETRO` | Immediate incident record, reason for bypass, exact commit, data affected, retrospective approval, prevention work |
| Add material scope after approval | re-approve | |
| Destructive database migration | `ONE_OF_N` + rehearsal + verified backup | |
| Rotate or expose a secret | `SINGLE` | Never an agent |

---

## 3. Risk levels and what they force

| Level | Definition | Consequence |
|---|---|---|
| `low` | Reversible, internal, no money | May be `AUTO` if whitelisted |
| `medium` | Externally visible or affects a counterparty relationship | At least `SINGLE` |
| `high` | Money, legal obligation, confidential data, or a claim about a third party | `SINGLE` minimum, `JOINT` where segregation applies; enhanced evidence pack required |
| `critical` | Capital, statutory filing, security or privacy exposure, destructive data change | `UNANIMOUS_BOARD` or `EXTERNAL`; interrupts the normal queue |

---

## 4. Automatic risk escalators

Any one of these raises the risk level by at least one step:

- monetary value above the configured threshold for the entity
- new or changed beneficiary bank details
- counterparty not previously transacted with
- duplicate detected (invoice, payment, listing, ticket)
- evidence missing for a required document
- verification level below the stage requirement
- price observation stale beyond its validity window
- unknown cost component in a margin calculation
- cross-border movement or export
- confidential or off-market data involved
- personal or family domain data (Leslie, parents, deceased estate)
- AI confidence below the configured floor
- prior attempt failed or was rejected

---

## 5. What an approval record must contain

```
approval {
  action_type
  payload_hash          // what exactly was approved
  reason                // why it was proposed
  source_refs[]         // evidence considered
  risk_level
  required_mode
  approvers[]           // who, when, from what device/session
  conditions[]          // and their satisfaction state
  expiry
  outcome               // approved / rejected / edited
  edit_diff?            // if edited, what changed
  execution_result      // and its evidence
}
```

**Payload drift rule:** if the payload changes after approval, the approval is void. The system re-requests approval rather than executing a different action than the one approved.

---

## 6. Things approval can never do

- An approval cannot be inferred from silence, from elapsed time, or from a WhatsApp message alone.
- An approval cannot be given by the system on a human's behalf.
- An approval cannot be reused for a similar-but-different action.
- An approval cannot be back-dated.
- An approval record cannot be edited or deleted. Corrections are new records.
- A gate cannot be skipped because the deal is urgent. Urgency changes priority, not authority.

---

## 7. Product boundary reminder

| Product | Owns which approvals |
|---|---|
| **Pivot OS** | Founder communications, commercial commitments, lane operations, capital governance surfacing |
| **Clark** | Accounting postings, payment preparation and approval, VAT preparation, close |
| **FNB / bank** | Payment release. Always. Outside every application |
| **Northpoint head office** | OTP scrutiny |
| **Jira / GitHub** | Production release |
| **SARS / CIPC** | Statutory submission |

Pivot OS shows DJ what is waiting. It does not absorb approvals that legally or operationally belong elsewhere.
