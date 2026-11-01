export const scoreFormulaVersion = '008-portfolio-score-v1' as const

export const scoreDimensions = [
  'expected_return',
  'cash_speed',
  'downside',
  'strategic_importance',
  'readiness',
  'management_capacity',
  'market_evidence',
  'contractual_strength',
  'funding_fit',
  'scalability',
  'diversification',
  'social_value',
  'reporting_control',
] as const

export type ScoreDimension = (typeof scoreDimensions)[number]

export const scoreLabels: Record<ScoreDimension, string> = {
  expected_return: 'Expected return',
  cash_speed: 'Cash-generation speed',
  downside: 'Downside and capital at risk',
  strategic_importance: 'Strategic importance',
  readiness: 'Readiness',
  management_capacity: 'Management capacity',
  market_evidence: 'Market evidence',
  contractual_strength: 'Contractual strength',
  funding_fit: 'Funding fit',
  scalability: 'Scalability',
  diversification: 'Diversification benefit',
  social_value: 'Social or enterprise-development value',
  reporting_control: 'Reporting and control readiness',
}

export type ScoreInput = {
  weightsApproved: boolean
  weightsBps: Partial<Record<ScoreDimension, number>>
  scores: Partial<Record<ScoreDimension, number | null>>
}

export type ScoreResult = {
  points: number | null
  decidesCapital: false
  formulaVersion: typeof scoreFormulaVersion
  blockers: string[]
  statement: string
}

const statement = '008-portfolio-score-v1 informs a decision. It is not an approved credit model and does not release capital.'

export function scorePortfolio(input: ScoreInput): ScoreResult {
  const blockers: string[] = []
  if (!input.weightsApproved) blockers.push('Portfolio weights are not board-approved.')
  let weightTotal = 0
  let weightsComplete = true
  let scoresComplete = true
  for (const dimension of scoreDimensions) {
    const weight = input.weightsBps[dimension]
    if (!Number.isInteger(weight) || weight === undefined || weight < 0) {
      weightsComplete = false
      blockers.push(`${scoreLabels[dimension]} has no weight.`)
    } else weightTotal += weight
    const score = input.scores[dimension]
    if (score === undefined || score === null) {
      scoresComplete = false
      blockers.push(`${scoreLabels[dimension]} is missing and was not treated as zero.`)
    } else if (!Number.isInteger(score) || score < 0 || score > 100) {
      scoresComplete = false
      blockers.push(`${scoreLabels[dimension]} score is not a whole number from 0 to 100.`)
    }
  }
  if (weightsComplete && weightTotal !== 10_000) blockers.push('Portfolio weights must sum to 100%.')
  if (blockers.length || !scoresComplete) return { points: null, decidesCapital: false, formulaVersion: scoreFormulaVersion, blockers, statement }
  const total = scoreDimensions.reduce((sum, dimension) => sum + (input.scores[dimension] as number) * (input.weightsBps[dimension] as number), 0)
  return { points: Math.round(total / 100) / 100, decidesCapital: false, formulaVersion: scoreFormulaVersion, blockers: [], statement }
}

export function exampleScore(): ScoreInput {
  const weightsBps = Object.fromEntries(scoreDimensions.map((dimension, index) => [dimension, index === scoreDimensions.length - 1 ? 400 : 800])) as Record<ScoreDimension, number>
  const scores = Object.fromEntries(scoreDimensions.map((dimension) => [dimension, dimension === 'market_evidence' ? null : 60])) as Record<ScoreDimension, number | null>
  return { weightsApproved: false, weightsBps, scores }
}
