import { validDate } from './format'
import type { EntityId } from './entities'

export const evidenceKinds = [
  'bank_statement',
  'bank_feed',
  'proof_of_payment',
  'tax_invoice',
  'supplier_document',
  'operational_event',
  'cash_event',
  'founder_note',
  'task_wording',
  'prototype',
] as const

export type EvidenceKind = (typeof evidenceKinds)[number]

export const cashEvidenceKinds = ['bank_statement', 'bank_feed', 'proof_of_payment'] as const
export type CashEvidenceKind = (typeof cashEvidenceKinds)[number]

export const accrualEvidenceKinds = ['tax_invoice', 'supplier_document', 'operational_event'] as const

export type SourceSystem = 'xero' | 'sage' | 'bank' | 'clark' | 'pivot' | 'manual' | 'prototype'

export type FinanceEvidence = {
  id: string
  kind: EvidenceKind
  entityId: EntityId
  sourceSystem: SourceSystem
  sourceRef: string
  capturedOn: string
  wording: string
  live: boolean
  private: boolean
  companyEvidence: boolean
}

export function isCashEvidence(kind: EvidenceKind): kind is CashEvidenceKind {
  return kind === 'bank_statement' || kind === 'bank_feed' || kind === 'proof_of_payment'
}

export function isAccrualEvidence(kind: EvidenceKind): boolean {
  return kind === 'tax_invoice' || kind === 'supplier_document' || kind === 'operational_event'
}

export function createEvidence(input: {
  id: string
  kind: EvidenceKind
  entityId: EntityId
  sourceSystem: SourceSystem
  sourceRef: string
  capturedOn: string
  wording: string
  live: boolean
}): { ok: true; evidence: FinanceEvidence } | { ok: false; error: string } {
  const sourceRef = input.sourceRef.trim()
  const wording = input.wording.trim()
  if (!input.id.trim()) return { ok: false, error: 'Evidence needs an id.' }
  if (!sourceRef || sourceRef.length > 120) return { ok: false, error: 'Evidence needs a source reference.' }
  if (!validDate(input.capturedOn)) return { ok: false, error: 'Evidence needs a valid date.' }
  if (!wording || wording.length > 500) return { ok: false, error: 'Keep the original wording.' }
  const privateNote = input.kind === 'founder_note'
  const illustrative = input.kind === 'prototype' || input.kind === 'task_wording' || privateNote
  if (input.live && illustrative) return { ok: false, error: 'Prototype, task wording and founder notes cannot be live finance evidence.' }
  if (input.live && input.sourceSystem === 'prototype') return { ok: false, error: 'A prototype source cannot be live finance evidence.' }
  return {
    ok: true,
    evidence: {
      id: input.id.trim(),
      kind: input.kind,
      entityId: input.entityId,
      sourceSystem: input.sourceSystem,
      sourceRef,
      capturedOn: input.capturedOn,
      wording,
      live: input.live,
      private: privateNote,
      companyEvidence: !privateNote && !illustrative,
    },
  }
}
