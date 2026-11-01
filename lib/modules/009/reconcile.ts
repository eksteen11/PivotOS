import type { EntityId } from './entities'
import { isCashEvidence, type FinanceEvidence } from './evidence'
import { canonicalUser } from './approval'
import type { Obligation } from './obligation'
import { validDate } from './format'

export type BankLine = {
  id: string
  entityId: EntityId
  accountLabel: string
  direction: 'inflow' | 'outflow'
  cents: number
  date: string
  reference: string
  evidenceId: string
}

export type AllocationMatch = {
  id: string
  bankLineId: string
  obligationId: string
  entityId: EntityId
  allocatedCents: number
  residualCents: number
  status: 'proposed' | 'matched'
  evidenceIds: string[]
  explanation: string
  approvedBy: string | null
  ledgerWrite: false
  confidence: 'not_scored'
}

export function createBankLine(input: BankLine, evidence: FinanceEvidence[]): { ok: true; line: BankLine } | { ok: false; error: string } {
  const account = input.accountLabel.trim()
  const reference = input.reference.trim()
  if (!input.id.trim() || !account || !reference) return { ok: false, error: 'A bank line needs an id, account and reference.' }
  if (!validDate(input.date)) return { ok: false, error: 'A bank line needs a valid date.' }
  if (!Number.isSafeInteger(input.cents) || input.cents <= 0) return { ok: false, error: 'A bank line needs a positive amount. Unknown is not zero.' }
  const backing = evidence.find((item) => item.id === input.evidenceId)
  if (!backing || !isCashEvidence(backing.kind)) return { ok: false, error: 'A bank line needs bank evidence.' }
  if (backing.entityId !== input.entityId) return { ok: false, error: 'This bank evidence belongs to another legal entity.' }
  return { ok: true, line: { ...input, accountLabel: account, reference } }
}

export function proposeMatch(input: {
  id: string
  line: BankLine
  obligation: Obligation
  allocatedCents: number
  evidence: FinanceEvidence[]
  explanation: string
}): { ok: true; match: AllocationMatch } | { ok: false; error: string } {
  const explanation = input.explanation.trim()
  if (!explanation) return { ok: false, error: 'A match needs an explanation before anyone approves it.' }
  if (input.line.entityId !== input.obligation.entityId) return { ok: false, error: 'A bank line cannot be matched to another legal entity.' }
  const backing = input.evidence.find((item) => item.id === input.line.evidenceId)
  if (!backing || !isCashEvidence(backing.kind) || backing.entityId !== input.line.entityId) return { ok: false, error: 'The match needs bank evidence for the same legal entity.' }
  if (!Number.isSafeInteger(input.allocatedCents) || input.allocatedCents <= 0) return { ok: false, error: 'The allocated amount must be known.' }
  if (input.allocatedCents > input.line.cents) return { ok: false, error: 'The allocation is larger than the bank line.' }
  return {
    ok: true,
    match: {
      id: input.id,
      bankLineId: input.line.id,
      obligationId: input.obligation.id,
      entityId: input.line.entityId,
      allocatedCents: input.allocatedCents,
      residualCents: input.line.cents - input.allocatedCents,
      status: 'proposed',
      evidenceIds: [backing.id],
      explanation,
      approvedBy: null,
      ledgerWrite: false,
      confidence: 'not_scored',
    },
  }
}

export function approveMatch(match: AllocationMatch, input: { actor: string; at: string }): { ok: true; match: AllocationMatch } | { ok: false; error: string } {
  const actor = canonicalUser(input.actor)
  if (!actor) return { ok: false, error: 'A named finance user must approve the match. Clark cannot approve it.' }
  if (!input.at.trim()) return { ok: false, error: 'The match decision needs a time.' }
  if (match.status === 'matched') return { ok: true, match }
  return { ok: true, match: { ...match, status: 'matched', approvedBy: actor, ledgerWrite: false } }
}

export function partnerCashReconciled(input: { sourceEventId: string | null; match: AllocationMatch | null; evidence: FinanceEvidence[] }): { reconciled: false; reason: string } | { reconciled: true; reason: string; ledgerWrite: false } {
  const hasCashEvent = input.evidence.some((item) => item.kind === 'cash_event' && item.companyEvidence)
  if (!input.sourceEventId || !hasCashEvent || input.match?.status !== 'matched') {
    return { reconciled: false, reason: 'A partner cash sale stays unreconciled until the cash event and an approved accounting allocation both exist.' }
  }
  return { reconciled: true, reason: 'The cash event and the approved allocation are both present. The statutory ledger was not changed.', ledgerWrite: false }
}

export type IntercompanySide = { entityId: EntityId; cents: number | null; evidenceIds: string[] }

export function intercompanyPosition(paying: IntercompanySide, receiving: IntercompanySide): {
  agreed: boolean
  differenceCents: number | null
  eliminationCents: number | null
  altersStatutory: false
  posted: false
  closeBlocked: boolean
  error?: string
} {
  if (paying.entityId === receiving.entityId) {
    return { agreed: false, differenceCents: null, eliminationCents: null, altersStatutory: false, posted: false, closeBlocked: true, error: 'An intercompany balance needs two legal entities.' }
  }
  if (paying.cents === null || receiving.cents === null) {
    return { agreed: false, differenceCents: null, eliminationCents: null, altersStatutory: false, posted: false, closeBlocked: true, error: 'An unknown intercompany balance was not treated as zero.' }
  }
  if (!Number.isSafeInteger(paying.cents) || !Number.isSafeInteger(receiving.cents) || paying.cents < 0 || receiving.cents < 0) {
    return { agreed: false, differenceCents: null, eliminationCents: null, altersStatutory: false, posted: false, closeBlocked: true, error: 'Intercompany amounts must be known cents.' }
  }
  if (paying.cents !== receiving.cents) {
    return { agreed: false, differenceCents: Math.abs(paying.cents - receiving.cents), eliminationCents: null, altersStatutory: false, posted: false, closeBlocked: true }
  }
  return { agreed: true, differenceCents: 0, eliminationCents: paying.cents, altersStatutory: false, posted: false, closeBlocked: false }
}

export function reviewMonthEnd(input: { reviewer: string; bankReconciled: boolean; intercompanyAgreed: boolean; openBlockingExceptions: number }): { ok: true; closed: true; periodLocked: false; secondSignature: false; reviewer: string } | { ok: false; periodLocked: false; error: string } {
  const reviewer = canonicalUser(input.reviewer)
  if (reviewer !== 'conrad' && reviewer !== 'drikus') return { ok: false, periodLocked: false, error: 'Conrad or Drikus reviews the close. A second signature is not required, and this module does not lock the ledger.' }
  if (!input.bankReconciled || !input.intercompanyAgreed || input.openBlockingExceptions > 0) return { ok: false, periodLocked: false, error: 'Open bank, intercompany or exception items block the close. The statutory ledger stays unchanged.' }
  return { ok: true, closed: true, periodLocked: false, secondSignature: false, reviewer }
}
