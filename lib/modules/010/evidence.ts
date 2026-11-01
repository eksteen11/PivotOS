import { evidenceLevel, type Evidence, type EvidenceKind, type MoneyLabel } from './contract'
import { filled, validDate } from './format'

export type EvidenceInput = {
  id: string
  kind: EvidenceKind
  claim: string
  source: string
  sourceDate: string
  originalWording: string
  moneyLabel: MoneyLabel
}

const moneyCaution: Record<MoneyLabel, string> = {
  estimate: 'Estimate. Not realised profit.',
  quote: 'Quotation. Not an order.',
  'approved-case': 'Labelled as an approved case. Opportunity Lab did not approve it.',
  actual: 'Labelled actual because the source says so. This is not booked profit and not a payment.',
  'not-money': '',
}

export function createEvidence(input: EvidenceInput, experimentCompleted: boolean): { ok: true; evidence: Evidence } | { ok: false; error: string } {
  if (!filled(input.id) || !filled(input.claim) || !filled(input.source) || !filled(input.originalWording)) {
    return { ok: false, error: 'Name the claim, source, date and original wording.' }
  }
  if (!validDate(input.sourceDate)) return { ok: false, error: 'Use a real evidence date.' }
  if (input.kind === 'pilot' && !experimentCompleted) return { ok: false, error: 'Pilot evidence needs a completed experiment.' }
  const kindCaution = input.kind === 'investment-ready'
    ? 'Level 5 can be reviewed by Capability 008. It is not investment approval.'
    : input.kind === 'pilot'
      ? 'Pilot evidence is not permission to scale.'
      : 'This evidence does not approve the idea.'
  return {
    ok: true,
    evidence: {
      id: input.id.trim(),
      kind: input.kind,
      level: evidenceLevel[input.kind],
      claim: input.claim.trim(),
      source: input.source.trim(),
      sourceDate: input.sourceDate,
      originalWording: input.originalWording,
      moneyLabel: input.moneyLabel,
      caution: input.moneyLabel === 'not-money' ? kindCaution : moneyCaution[input.moneyLabel],
    },
  }
}

export function advisoryScore(evidence: readonly Evidence[]): { strongest: Evidence['level'] | null; approves: false; statement: string } {
  const strongest = evidence.reduce<Evidence['level'] | null>((max, item) => max === null || item.level > max ? item.level : max, null)
  return { strongest, approves: false, statement: 'This score supports judgement. It does not approve the idea or create a commitment.' }
}
