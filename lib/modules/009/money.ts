import type { EntityId } from './entities'
import { isAccrualEvidence, isCashEvidence, type FinanceEvidence } from './evidence'
import { formatZar } from './format'

export const amountBases = ['forecast', 'accrual', 'cash_backed'] as const
export type AmountBasis = (typeof amountBases)[number]

export const provenances = ['demo', 'entered', 'ledger_read', 'bank_evidence'] as const
export type Provenance = (typeof provenances)[number]

export type StatedAmount = {
  cents: number
  basis: AmountBasis
  entityId: EntityId
  currency: 'ZAR'
  evidenceIds: string[]
  provenance: Provenance
  live: boolean
}

export function createAmount(input: {
  cents: number | null
  explicitZero?: boolean
  basis: AmountBasis
  entityId: EntityId
  evidenceIds: string[]
  provenance: Provenance
  live: boolean
}, evidence: FinanceEvidence[]): { ok: true; amount: StatedAmount | null } | { ok: false; error: string } {
  if (input.cents === null) return { ok: true, amount: null }
  const cents = input.cents
  if (!Number.isSafeInteger(cents) || cents < 0) return { ok: false, error: 'An amount must be unknown or a non-negative number of cents.' }
  if (cents === 0 && !input.explicitZero) return { ok: false, error: 'Zero is not assumed. Mark an explicit zero only when the source says nil.' }
  if (input.provenance === 'demo' && input.live) return { ok: false, error: 'Demo figures cannot be presented as live finance data.' }
  if (input.basis === 'forecast' && input.live) return { ok: false, error: 'A forecast cannot be presented as live cash or a live ledger balance.' }
  const linked = evidence.filter((item) => input.evidenceIds.includes(item.id))
  if (!input.evidenceIds.length || linked.length !== input.evidenceIds.length) return { ok: false, error: 'The amount needs evidence that exists.' }
  if (linked.some((item) => item.entityId !== input.entityId)) return { ok: false, error: 'Evidence from another legal entity cannot support this amount.' }
  const amount = { cents, basis: input.basis, entityId: input.entityId, evidenceIds: input.evidenceIds, provenance: input.provenance, live: input.live }
  if (input.basis === 'forecast') {
    if (input.provenance === 'bank_evidence') return { ok: false, error: 'Bank evidence is cash-backed. It does not become a forecast.' }
    return { ok: true, amount: stated(amount, linked) }
  }
  if (input.basis === 'accrual') {
    const hasAccrualEvidence = linked.some((item) => isAccrualEvidence(item.kind))
    if (!hasAccrualEvidence) return { ok: false, error: 'An accrual needs a tax invoice, supplier document or operational event. Bank movement and task wording are not an accrual.' }
    if (input.live && linked.some((item) => !item.companyEvidence)) return { ok: false, error: 'A live accrual needs company evidence.' }
    if (input.provenance === 'bank_evidence') return { ok: false, error: 'Bank evidence does not turn an accrual into cash, and it is not the accrual source.' }
    return { ok: true, amount: stated(amount, linked) }
  }
  if (!linked.every((item) => isCashEvidence(item.kind))) return { ok: false, error: 'Cash-backed money needs a bank statement, bank feed or proof of payment.' }
  if (input.live && (input.provenance !== 'bank_evidence' || linked.some((item) => !item.live))) return { ok: false, error: 'Live cash needs live bank evidence.' }
  if (!input.live && input.provenance === 'bank_evidence') return { ok: false, error: 'Bank evidence marked as the source must be live. An example uses demo provenance.' }
  return { ok: true, amount: stated(amount, linked) }
}

function stated(input: { cents: number; basis: AmountBasis; entityId: EntityId; evidenceIds: string[]; provenance: Provenance; live: boolean }, linked: FinanceEvidence[]): StatedAmount {
  return {
    cents: input.cents,
    basis: input.basis,
    entityId: input.entityId,
    currency: 'ZAR',
    evidenceIds: linked.map((item) => item.id),
    provenance: input.provenance,
    live: input.live,
  }
}

export function sumSameBasis(amounts: Array<StatedAmount | null>, basis: AmountBasis, entityId: EntityId): { ok: true; cents: number } | { ok: false; error: string } {
  if (amounts.some((item) => item === null)) return { ok: false, error: 'An unknown amount was not treated as zero.' }
  const statedAmounts = amounts as StatedAmount[]
  if (statedAmounts.some((item) => item.basis !== basis)) return { ok: false, error: 'Forecast, accrual and cash-backed amounts stay separate.' }
  if (statedAmounts.some((item) => item.entityId !== entityId)) return { ok: false, error: 'Another entity’s money was not added.' }
  const cents = statedAmounts.reduce((total, item) => total + item.cents, 0)
  if (!Number.isSafeInteger(cents)) return { ok: false, error: 'The total is too large.' }
  return { ok: true, cents }
}

export function presentAmount(amount: StatedAmount | null): { figure: string; basis: string; caution: string } {
  if (!amount) return { figure: 'Unknown', basis: 'Unknown', caution: 'Unknown is not treated as zero.' }
  if (amount.provenance === 'demo' && amount.live) return { figure: 'Blocked', basis: amount.basis, caution: 'Blocked. Demo cannot be shown as live.' }
  const figure = formatZar(amount.cents)
  if (amount.basis === 'forecast') return { figure, basis: 'Forecast', caution: amount.provenance === 'demo' ? 'Forecast. Not cash and not a ledger balance. Demo is not live finance data.' : 'Forecast. Not cash and not a ledger balance.' }
  if (amount.basis === 'accrual') return { figure, basis: 'Accrual', caution: amount.live ? 'Accrual. Not cash until bank evidence exists.' : 'Accrual. Not cash and not a posted ledger entry.' }
  return { figure, basis: 'Cash-backed', caution: amount.live ? 'Cash-backed by bank evidence. The bank stays authoritative.' : 'Example cash-backed figure. Not a live bank balance and not a payment.' }
}

export function supportsPaymentClaim(amount: StatedAmount | null): boolean {
  return Boolean(amount && amount.basis === 'cash_backed' && amount.live && amount.provenance === 'bank_evidence')
}

export type TreasuryLane = 'expected' | 'approved' | 'actual'

export function placeOnLane(amount: StatedAmount, lane: TreasuryLane): { ok: true } | { ok: false; error: string } {
  if (lane === 'expected' && amount.basis !== 'forecast') return { ok: false, error: 'The expected lane accepts a forecast only.' }
  if (lane === 'approved' && amount.basis === 'cash_backed') return { ok: false, error: 'An approved instruction is not an actual bank movement.' }
  if (lane === 'actual' && amount.basis !== 'cash_backed') return { ok: false, error: 'Actual cash accepts cash-backed bank evidence only.' }
  return { ok: true }
}

export function thirteenWeek(input: {
  expected: Array<StatedAmount | null>
  approved: Array<StatedAmount | null>
  actual: Array<StatedAmount | null>
}): { ok: true; weeks: number; expectedCents: number | null; approvedCents: number | null; actualCents: number | null } | { ok: false; error: string } {
  if (input.expected.length !== 13 || input.approved.length !== 13 || input.actual.length !== 13) return { ok: false, error: 'A cash forecast covers 13 weeks.' }
  for (const amount of input.expected) if (amount && !placeOnLane(amount, 'expected').ok) return { ok: false, error: 'Expected cash must stay a forecast.' }
  for (const amount of input.approved) {
    const placed = amount ? placeOnLane(amount, 'approved') : { ok: true as const }
    if (!placed.ok) return placed
  }
  for (const amount of input.actual) if (amount && !placeOnLane(amount, 'actual').ok) return { ok: false, error: 'Actual cash must stay cash-backed.' }
  if ([input.expected, input.approved, input.actual].some((lane) => mixedEntity(lane))) return { ok: false, error: 'A forecast lane cannot mix legal entities.' }
  return {
    ok: true,
    weeks: 13,
    expectedCents: laneTotal(input.expected),
    approvedCents: laneTotal(input.approved),
    actualCents: laneTotal(input.actual),
  }
}

function mixedEntity(amounts: Array<StatedAmount | null>): boolean {
  const ids = amounts.flatMap((item) => item ? [item.entityId] : [])
  return ids.some((id) => id !== ids[0])
}

function laneTotal(amounts: Array<StatedAmount | null>): number | null {
  if (amounts.some((item) => item === null)) return null
  return (amounts as StatedAmount[]).reduce((total, item) => total + item.cents, 0)
}

export function labelledCash(positions: { entityId: EntityId | null; amount: StatedAmount | null }[]): { ok: true; rows: { entityId: EntityId; figure: string; caution: string }[]; sameEntityCents: number | null } | { ok: false; error: string } {
  if (positions.some((item) => item.entityId === null)) return { ok: false, error: 'Bank balances are not combined without a legal entity label.' }
  const rows = positions.map((item) => {
    const presented = presentAmount(item.amount)
    return { entityId: item.entityId as EntityId, figure: presented.figure, caution: presented.caution }
  })
  const sameEntity = positions.length > 0 && positions.every((item) => item.entityId === positions[0]?.entityId)
  if (!sameEntity || positions.some((item) => !item.amount || item.amount.basis !== 'cash_backed')) return { ok: true, rows, sameEntityCents: null }
  const total = sumSameBasis(positions.map((item) => item.amount), 'cash_backed', positions[0]?.entityId ?? 'digikraal')
  return { ok: true, rows, sameEntityCents: total.ok ? total.cents : null }
}
