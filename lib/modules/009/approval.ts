import type { EntityId } from './entities'
import { isBlockedActor, findDuplicateBill, type SupplierBill } from './exception'
import type { FinanceEvidence } from './evidence'
import { fingerprint, validTimestamp } from './format'
import { supportsPaymentClaim, type StatedAmount } from './money'

const users = {
  conrad: { accounting: true, payment: true, prepare: true, bankNote: true },
  drikus: { accounting: true, payment: true, prepare: true, bankNote: true },
  emma: { accounting: true, payment: false, prepare: true, bankNote: false },
  sonnica: { accounting: true, payment: false, prepare: true, bankNote: false },
} as const

export type CanonicalUser = keyof typeof users

const aliases: Record<string, CanonicalUser> = {
  conrad: 'conrad',
  drikus: 'drikus',
  dj: 'drikus',
  'dj eksteen': 'drikus',
  'drikus eksteen': 'drikus',
  emma: 'emma',
  sonnica: 'sonnica',
}

export function canonicalUser(name: string): CanonicalUser | null {
  const key = name.trim().toLowerCase().replace(/\s+/g, ' ')
  if (!key || isBlockedActor(key)) return null
  return aliases[key] ?? null
}

export type AccountingApproval = {
  actor: CanonicalUser
  at: string
  obligationId: string
  entityId: EntityId
  evidenceIds: string[]
  payloadHash: string
  posted: false
  ledgerWrite: false
  selfApproval: boolean
  released: false
}

export function approveAccounting(input: {
  actor: string
  proposalBy: string
  obligationId: string
  entityId: EntityId
  evidence: FinanceEvidence[]
  evidenceIds: string[]
  auditWritable: boolean
  at: string
}): { ok: true; approval: AccountingApproval } | { ok: false; error: string } {
  if (!input.auditWritable) return { ok: false, error: 'The audit record could not be kept, so the accounting decision stops.' }
  const actor = canonicalUser(input.actor)
  if (!actor || !users[actor].accounting) return { ok: false, error: 'A named finance user must decide. Clark cannot approve its own proposal.' }
  if (!validTimestamp(input.at)) return { ok: false, error: 'The decision needs a valid time.' }
  const linked = input.evidence.filter((item) => input.evidenceIds.includes(item.id))
  if (!linked.length || linked.some((item) => !item.companyEvidence || item.entityId !== input.entityId)) return { ok: false, error: 'Accounting approval needs company evidence for this legal entity.' }
  const preparer = canonicalUser(input.proposalBy)
  return {
    ok: true,
    approval: {
      actor,
      at: input.at,
      obligationId: input.obligationId,
      entityId: input.entityId,
      evidenceIds: linked.map((item) => item.id),
      payloadHash: fingerprint({ obligationId: input.obligationId, entityId: input.entityId, evidenceIds: linked.map((item) => item.id).sort() }),
      posted: false,
      ledgerWrite: false,
      selfApproval: preparer === actor,
      released: false,
    },
  }
}

export function approvalStillCovers(approval: AccountingApproval, evidenceIds: string[]): boolean {
  return approval.payloadHash === fingerprint({ obligationId: approval.obligationId, entityId: approval.entityId, evidenceIds: [...evidenceIds].sort() })
}

export type PreparedPayment = {
  id: string
  obligationId: string
  entityId: EntityId
  actor: CanonicalUser
  approvedBy: CanonicalUser | null
  selfApproval: boolean
  cashImpact: StatedAmount
  released: false
  paymentExecuted: false
  warning: string
  status: 'prepared'
  secondApproverRequired: false
}

export function preparePayment(input: {
  id: string
  actor: string
  approver?: string | null
  obligationId: string | null
  cashImpact: StatedAmount | null
  bills: SupplierBill[]
  candidate: SupplierBill
  bankDetailsChanged: boolean
  auditWritable: boolean
}): { ok: true; payment: PreparedPayment } | { ok: false; error: string } {
  if (!input.auditWritable) return { ok: false, error: 'The audit record could not be kept, so the payment instruction stops.' }
  if (!input.obligationId) return { ok: false, error: 'A payment needs an obligation. A task alone is not enough.' }
  const actor = canonicalUser(input.actor)
  if (!actor || !users[actor].prepare) return { ok: false, error: 'A named finance user must prepare the instruction. Clark cannot prepare and approve it alone.' }
  if (!input.cashImpact || input.cashImpact.basis === 'cash_backed') return { ok: false, error: 'The cash impact of a prepared payment stays a forecast or accrual until the bank moves.' }
  if (input.cashImpact.entityId !== input.candidate.entityId) return { ok: false, error: 'The payment entity and the obligation entity must match.' }
  const duplicate = findDuplicateBill(input.candidate, input.bills)
  if (duplicate) return { ok: false, error: `${duplicate.reason} It was stopped before payment.` }
  const approver = input.approver ? canonicalUser(input.approver) : null
  if (input.approver && (!approver || !users[approver].payment)) return { ok: false, error: 'Only Conrad or Drikus can approve a payment. One approval is enough, and it still does not release the bank.' }
  return {
    ok: true,
    payment: {
      id: input.id,
      obligationId: input.obligationId,
      entityId: input.candidate.entityId,
      actor,
      approvedBy: approver,
      selfApproval: approver === actor,
      cashImpact: input.cashImpact,
      released: false,
      paymentExecuted: false,
      warning: input.bankDetailsChanged ? 'Supplier bank details changed. The warning stays visible. Current policy does not add a second approval.' : '',
      status: 'prepared',
      secondApproverRequired: false,
    },
  }
}

export function reviewPaymentClaim(input: {
  actor: string
  obligationId: string | null
  amount: StatedAmount | null
  evidence: FinanceEvidence[]
  approved: boolean
  prepared: boolean
  auditWritable: boolean
}): { ok: true; code: 'evidence_noted'; released: false; paymentExecuted: false; reason: string } | { ok: false; released: false; paymentExecuted: false; error: string } {
  const refused = { ok: false as const, released: false as const, paymentExecuted: false as const }
  if (!input.auditWritable) return { ...refused, error: 'The audit record could not be kept, so the payment claim stops.' }
  if (!input.obligationId) return { ...refused, error: 'A payment claim needs an obligation.' }
  const actor = canonicalUser(input.actor)
  if (!actor || !users[actor].bankNote) return { ...refused, error: 'Emma and Sonnica do not release bank payments. Clark does not either.' }
  if (!input.prepared || !input.approved) return { ...refused, error: 'Preparation or approval alone does not release a payment.' }
  if (!supportsPaymentClaim(input.amount)) return { ...refused, error: 'A forecast, accrual, demo figure or task is not a payment.' }
  const backing = input.evidence.filter((item) => input.amount?.evidenceIds.includes(item.id))
  if (!backing.length || backing.some((item) => !item.live || item.private || item.kind === 'prototype' || item.kind === 'task_wording' || item.kind === 'founder_note')) {
    return { ...refused, error: 'The payment claim needs live bank evidence. Founder notes and prototype figures do not count.' }
  }
  return { ok: true, code: 'evidence_noted', released: false, paymentExecuted: false, reason: 'Bank evidence is noted. This module did not release the payment. The bank stays authoritative.' }
}

export function grantAccess(): { ok: false; error: string } {
  return { ok: false, error: 'This module does not grant finance access.' }
}

export function repaymentFromTask(wording: string): { repaid: false; error: string } {
  const text = wording.trim()
  if (!text) return { repaid: false, error: 'A blank task is not a repayment.' }
  return { repaid: false, error: 'A task that says pay back is not a repayment.' }
}
