import type { EvidenceGrade } from './evidence'
import { isSaleGrade } from './evidence'

export const ceilingFormulaVersion = '006-bid-ceiling-v1' as const

export type CeilingInput = {
  conservativeExitCents: number | null
  exitEvidenceGrade: EvidenceGrade | null
  sellingCostCents: number | null
  otherKnownCostCents: number | null
  unknownCostNames: string[]
  provisionalCostNames: string[]
  minimumNetProfitCents: number | null
  marginOfSafetyBps: number | null
  minimumReturnOnCashBps: number | null
  maximumCapitalCents: number | null
  depositBps: number | null
  immediateNonPurchaseCents: number | null
  formulaReviewed: boolean
}

export type CeilingResult = {
  cents: number | null
  binding: 'profit' | 'return' | 'capital' | null
  blockers: string[]
  formulaVersion: typeof ceilingFormulaVersion
}

function whole(value: number | null): value is number {
  return value !== null && Number.isSafeInteger(value) && value >= 0
}

function bps(value: number | null, max: number): value is number {
  return value !== null && Number.isInteger(value) && value >= 0 && value <= max
}

export function recommendCeiling(input: CeilingInput): CeilingResult {
  const blockers: string[] = []
  if (!input.formulaReviewed) blockers.push('Formula 006-bid-ceiling-v1 has not been reviewed.')
  if (input.unknownCostNames.length) blockers.push(...input.unknownCostNames.map((name) => `${name} is unknown and was not treated as zero.`))
  if (input.provisionalCostNames.length) blockers.push(...input.provisionalCostNames.map((name) => `${name} is provisional and cannot support a ceiling.`))
  if (!whole(input.conservativeExitCents) || input.conservativeExitCents <= 0) blockers.push('There is no achieved-sale exit to calculate from.')
  else if (!input.exitEvidenceGrade || !isSaleGrade(input.exitEvidenceGrade)) blockers.push('The conservative exit is not achieved-sale evidence.')
  const namedGaps = input.unknownCostNames.length + input.provisionalCostNames.length > 0
  if (!whole(input.sellingCostCents) && !namedGaps) blockers.push('Selling cost is unknown and was not treated as zero.')
  if (!whole(input.otherKnownCostCents) && !namedGaps) blockers.push('Other costs are incomplete.')
  if (!whole(input.immediateNonPurchaseCents) && !namedGaps) blockers.push('Immediate cash besides the deposit is unknown and was not treated as zero.')
  if (!whole(input.minimumNetProfitCents)) blockers.push('Minimum net profit is not set.')
  if (!bps(input.marginOfSafetyBps, 10_000)) blockers.push('Margin of safety is not set.')
  if (!bps(input.minimumReturnOnCashBps, 100_000)) blockers.push('Return on cash is not set.')
  if (!whole(input.maximumCapitalCents)) blockers.push('Capital available is not set.')
  if (!bps(input.depositBps, 10_000)) blockers.push('Deposit rate is not set.')
  if (blockers.length || !whole(input.conservativeExitCents) || !whole(input.sellingCostCents) || !whole(input.otherKnownCostCents) || !whole(input.immediateNonPurchaseCents) || !whole(input.minimumNetProfitCents) || !bps(input.marginOfSafetyBps, 10_000) || !bps(input.minimumReturnOnCashBps, 100_000) || !whole(input.maximumCapitalCents) || !bps(input.depositBps, 10_000)) {
    return { cents: null, binding: null, blockers, formulaVersion: ceilingFormulaVersion }
  }

  const zero = BigInt(0)
  const basis = BigInt(10_000)
  const scale = BigInt(100_000_000)
  const exit = BigInt(input.conservativeExitCents)
  const safety = exit * BigInt(input.marginOfSafetyBps) / basis
  const available = exit - BigInt(input.sellingCostCents) - BigInt(input.otherKnownCostCents)
  const profitLimit = available - BigInt(input.minimumNetProfitCents) - safety
  const rociCharge = BigInt(input.immediateNonPurchaseCents) * BigInt(input.minimumReturnOnCashBps) / basis
  const numerator = available - rociCharge
  const denom = scale + BigInt(input.depositBps) * BigInt(input.minimumReturnOnCashBps)
  const returnLimit = numerator < zero ? BigInt(-1) : numerator * scale / denom
  const capitalRoom = BigInt(input.maximumCapitalCents) - BigInt(input.immediateNonPurchaseCents)
  if (capitalRoom < zero) {
    return { cents: null, binding: null, blockers: ['Immediate cash already exceeds the capital limit.'], formulaVersion: ceilingFormulaVersion }
  }
  const capitalLimit = input.depositBps === 0 ? profitLimit : capitalRoom * basis / BigInt(input.depositBps)
  const ranked: { cents: bigint; binding: CeilingResult['binding'] }[] = [
    { cents: profitLimit, binding: 'profit' },
    { cents: returnLimit, binding: 'return' },
    { cents: capitalLimit, binding: 'capital' },
  ]
  const lowest = ranked.reduce((best, item) => item.cents < best.cents ? item : best)
  if (lowest.cents < BigInt(0) || lowest.cents > BigInt(Number.MAX_SAFE_INTEGER)) {
    return { cents: null, binding: null, blockers: ['No bid meets the reviewed profit, return and capital limits.'], formulaVersion: ceilingFormulaVersion }
  }
  return { cents: Number(lowest.cents), binding: lowest.binding, blockers: [], formulaVersion: ceilingFormulaVersion }
}

export const executionRefusals = {
  bid: 'Pivot does not place bids. The reviewed ceiling is only a limit.',
  contract: 'Pivot does not prepare or sign contracts.',
  finance: 'Pivot does not release finance or pay a deposit.',
} as const

export type ExecutionKind = keyof typeof executionRefusals

export function refuseExecution(kind: ExecutionKind): string {
  return executionRefusals[kind]
}
