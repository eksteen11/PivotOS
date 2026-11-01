import type { EntityId } from './entities'
import type { AmountBasis } from './money'
import { validTimestamp } from './format'

export const exceptionCodes = [
  'duplicate_bill',
  'duplicate_payment',
  'changed_bank_details',
  'missing_evidence',
  'incorrect_entity',
  'vat_inconsistency',
  'unmatched_receipt',
  'payment_without_obligation',
  'invoice_without_operational_source',
  'intercompany_mismatch',
  'basis_used_as_cash',
  'demo_presented_as_live',
  'unsupported_approval',
  'unsupported_payment',
  'audit_blocked',
] as const

export type ExceptionCode = (typeof exceptionCodes)[number]

export type ExceptionAmount = { cents: number; basis: AmountBasis }

export type FinanceException = {
  id: string
  code: ExceptionCode
  entityId: EntityId
  severity: 'low' | 'medium' | 'high'
  amount: ExceptionAmount | null
  owner: string
  evidenceIds: string[]
  missingEvidence: boolean
  proposedResolution: string
  decision: string | null
  closed: boolean
  history: { at: string; actor: string; text: string }[]
}

export function raiseException(input: {
  id: string
  code: ExceptionCode
  entityId: EntityId
  severity: FinanceException['severity']
  amount?: ExceptionAmount | null
  explicitZero?: boolean
  owner: string
  evidenceIds: string[]
  missingEvidence?: boolean
  proposedResolution: string
  at: string
  actor: string
}): { ok: true; exception: FinanceException } | { ok: false; error: string } {
  const owner = input.owner.trim()
  const resolution = input.proposedResolution.trim()
  const actor = input.actor.trim()
  if (!input.id.trim() || !owner || !resolution || !actor) return { ok: false, error: 'An exception needs an id, owner, proposed resolution and actor.' }
  if (!validTimestamp(input.at)) return { ok: false, error: 'An exception needs a valid time.' }
  const missingEvidence = input.missingEvidence === true || input.evidenceIds.length === 0
  if (!input.evidenceIds.length && input.missingEvidence !== true) return { ok: false, error: 'Name the evidence, or say that the evidence is missing.' }
  if (input.amount && (!Number.isSafeInteger(input.amount.cents) || input.amount.cents < 0)) return { ok: false, error: 'An exception amount must be unknown or a non-negative number of cents.' }
  if (input.amount?.cents === 0 && !input.explicitZero) return { ok: false, error: 'An exception cannot treat a missing amount as zero.' }
  return {
    ok: true,
    exception: {
      id: input.id.trim(),
      code: input.code,
      entityId: input.entityId,
      severity: input.severity,
      amount: input.amount ?? null,
      owner,
      evidenceIds: [...input.evidenceIds],
      missingEvidence,
      proposedResolution: resolution,
      decision: null,
      closed: false,
      history: [{ at: input.at, actor, text: `Opened ${input.code}.` }],
    },
  }
}

export function closeException(exception: FinanceException, input: {
  actor: string
  at: string
  resolution: string
  evidenceIds: string[]
}): { ok: true; exception: FinanceException } | { ok: false; error: string } {
  const actor = input.actor.trim()
  const resolution = input.resolution.trim()
  if (isBlockedActor(actor)) return { ok: false, error: 'Clark cannot close its own exception. A named person must decide.' }
  if (!resolution) return { ok: false, error: 'Closing an exception needs a resolution.' }
  if (!input.evidenceIds.length) return { ok: false, error: 'Closing an exception needs evidence.' }
  if (!validTimestamp(input.at)) return { ok: false, error: 'The decision needs a valid time.' }
  if (exception.closed) return { ok: false, error: 'This exception is already closed. The original record stays.' }
  return {
    ok: true,
    exception: {
      ...exception,
      evidenceIds: [...new Set([...exception.evidenceIds, ...input.evidenceIds])],
      missingEvidence: false,
      decision: resolution,
      closed: true,
      history: [...exception.history, { at: input.at, actor, text: resolution }],
    },
  }
}

export function isBlockedActor(actor: string): boolean {
  return ['ai', 'clark', 'pivot', 'system', 'agent'].includes(actor.trim().toLowerCase())
}

export type SupplierBill = {
  id: string
  entityId: EntityId
  supplier: string
  documentNumber: string
  cents: number
  date: string
}

export function findDuplicateBill(candidate: SupplierBill, existing: SupplierBill[]): { duplicateOf: string; reason: string } | null {
  const supplier = normalise(candidate.supplier)
  const documentNumber = normalise(candidate.documentNumber)
  for (const bill of existing) {
    if (bill.entityId !== candidate.entityId || bill.id === candidate.id) continue
    if (normalise(bill.supplier) === supplier && normalise(bill.documentNumber) === documentNumber && documentNumber) {
      return { duplicateOf: bill.id, reason: 'This supplier document number already exists on the same legal entity.' }
    }
    if (normalise(bill.supplier) === supplier && bill.cents === candidate.cents && bill.date === candidate.date) {
      return { duplicateOf: bill.id, reason: 'The same supplier, amount and date already exist on this legal entity.' }
    }
  }
  return null
}

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}
