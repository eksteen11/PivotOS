import { formatZar, validDate } from './format'

export const evidenceGrades = [
  'registered_transfer',
  'signed_transaction',
  'active_asking_price',
  'agent_opinion',
  'automated_estimate',
  'municipal_valuation',
  'auction_marketing_claim',
  'internal_assumption',
] as const

export type EvidenceGrade = (typeof evidenceGrades)[number]

export const saleEvidenceGrades = ['registered_transfer', 'signed_transaction'] as const
export type SaleEvidenceGrade = (typeof saleEvidenceGrades)[number]

const labels: Record<EvidenceGrade, string> = {
  registered_transfer: 'Registered transfer',
  signed_transaction: 'Signed transaction evidence',
  active_asking_price: 'Active asking price',
  agent_opinion: 'Agent opinion',
  automated_estimate: 'Automated estimate',
  municipal_valuation: 'Municipal valuation',
  auction_marketing_claim: 'Auction marketing claim',
  internal_assumption: 'Internal assumption',
}

export type EvidencePoint = {
  id: string
  grade: EvidenceGrade
  amountCents: number | null
  adjustmentCents: number | null
  adjustmentStated: boolean
  source: string
  sourceDate: string
  originalWording: string
  distanceNote: string
  similarityNote: string
  confidence: 'not_scored'
}

export function evidenceLabel(grade: EvidenceGrade): string {
  return labels[grade]
}

export function isSaleGrade(grade: EvidenceGrade): grade is SaleEvidenceGrade {
  return grade === 'registered_transfer' || grade === 'signed_transaction'
}

export function adjustedCents(point: EvidencePoint): number | null {
  if (point.amountCents === null || !point.adjustmentStated || point.adjustmentCents === null) return null
  const adjusted = point.amountCents + point.adjustmentCents
  return Number.isSafeInteger(adjusted) ? adjusted : null
}

export function evidenceCaution(grade: EvidenceGrade): string {
  if (isSaleGrade(grade)) return 'Achieved-sale evidence. This is decision support, not a formal valuation.'
  if (grade === 'active_asking_price') return 'Asking price, not an achieved sale.'
  if (grade === 'automated_estimate') return 'Automated estimate. It cannot set the achieved-sale range.'
  if (grade === 'municipal_valuation') return 'Municipal valuation. It cannot set the achieved-sale range.'
  if (grade === 'auction_marketing_claim') return 'Auction marketing claim. It cannot set the achieved-sale range.'
  if (grade === 'agent_opinion') return 'Agent opinion. It cannot set the achieved-sale range.'
  return 'Internal assumption. It cannot set the achieved-sale range.'
}

export function presentEvidence(point: EvidencePoint): { label: string; amount: string; caution: string } {
  const adjusted = isSaleGrade(point.grade) ? adjustedCents(point) : null
  return {
    label: evidenceLabel(point.grade),
    amount: adjusted !== null ? formatZar(adjusted) : point.amountCents === null ? 'Unknown' : formatZar(point.amountCents),
    caution: evidenceCaution(point.grade),
  }
}

export function createEvidencePoint(input: {
  id: string
  grade: EvidenceGrade
  amountCents: number | null
  adjustmentCents: number | null
  adjustmentStated: boolean
  source: string
  sourceDate: string
  originalWording: string
}): { ok: true; point: EvidencePoint } | { ok: false; error: string } {
  const source = input.source.trim()
  const wording = input.originalWording.trim()
  if (!input.id.trim()) return { ok: false, error: 'Evidence needs an id.' }
  if (!source || source.length > 200) return { ok: false, error: 'Evidence needs a source.' }
  if (!validDate(input.sourceDate)) return { ok: false, error: 'Evidence needs a valid source date.' }
  if (!wording || wording.length > 500) return { ok: false, error: 'Keep the original wording.' }
  if (input.amountCents !== null && (!Number.isSafeInteger(input.amountCents) || input.amountCents < 0)) return { ok: false, error: 'An evidence amount must be unknown or a positive number of cents.' }
  if (input.adjustmentStated !== (input.adjustmentCents !== null)) return { ok: false, error: 'An unstated adjustment cannot be treated as zero.' }
  if (input.adjustmentCents !== null && !Number.isSafeInteger(input.adjustmentCents)) return { ok: false, error: 'The adjustment is not a valid amount.' }
  if (!isSaleGrade(input.grade) && input.adjustmentStated) return { ok: false, error: 'Only achieved-sale evidence can carry an adjustment into a range.' }
  return {
    ok: true,
    point: {
      id: input.id.trim(),
      grade: input.grade,
      amountCents: input.amountCents,
      adjustmentCents: input.adjustmentCents,
      adjustmentStated: input.adjustmentStated,
      source,
      sourceDate: input.sourceDate,
      originalWording: wording,
      distanceNote: 'Not recorded',
      similarityNote: 'Not recorded',
      confidence: 'not_scored',
    },
  }
}

export type AchievedSaleRange = {
  lowCents: number | null
  highCents: number | null
  evidenceIds: string[]
  professionalValuation: false
  statement: string
}

export function achievedSaleRange(points: EvidencePoint[]): AchievedSaleRange {
  const usable = points.flatMap((point) => {
    if (!isSaleGrade(point.grade)) return []
    const amount = adjustedCents(point)
    return amount === null ? [] : [{ id: point.id, amount }]
  })
  if (!usable.length) {
    return {
      lowCents: null,
      highCents: null,
      evidenceIds: [],
      professionalValuation: false,
      statement: 'No achieved-sale range. Missing sale evidence is not filled with an estimate.',
    }
  }
  const amounts = usable.map((point) => point.amount)
  const lowCents = Math.min(...amounts)
  const highCents = Math.max(...amounts)
  return {
    lowCents,
    highCents,
    evidenceIds: usable.map((point) => point.id),
    professionalValuation: false,
    statement: `Achieved-sale evidence only, ${formatZar(lowCents)} to ${formatZar(highCents)}. This is decision support, not a formal valuation.`,
  }
}
