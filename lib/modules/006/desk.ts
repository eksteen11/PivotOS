import { recommendCeiling, refuseExecution, type CeilingResult, type ExecutionKind } from './ceiling'
import { ceilingFormulaVersion } from './ceiling'
import { createCostLine, sumRole, type CostLine } from './costs'
import { achievedSaleRange, adjustedCents, createEvidencePoint, isSaleGrade, type EvidencePoint, type SaleEvidenceGrade } from './evidence'
import { parseRands, validDate, validTimestamp } from './format'
import { captureOpportunity, type Opportunity } from './opportunity'
import type { Company } from '../../workspace/catalogue'

export type CeilingPolicy = {
  formulaVersion: typeof ceilingFormulaVersion
  formulaReviewed: boolean
  formulaNote: string
  minimumNetProfitCents: number | null
  marginOfSafetyBps: number | null
  minimumReturnOnCashBps: number | null
  maximumCapitalCents: number | null
  depositBps: number | null
}

export type CeilingReview = {
  reviewedBy: string
  reviewedAt: string
  approvedCeilingCents: number
  reason: string
  recommendationCents: number
  underwritingVersion: number
}

export type DeskState = {
  example: boolean
  version: number
  opportunity: Opportunity
  evidence: EvidencePoint[]
  costs: CostLine[]
  policy: CeilingPolicy
  review: CeilingReview | null
  history: { version: number; reason: string; at: string; review: CeilingReview }[]
  message: string
  alert: string
}

export type DeskAction =
  | { type: 'add-sale-evidence'; amountRands: string; adjustmentRands: string; source: string; sourceDate: string; grade: SaleEvidenceGrade; at: string }
  | { type: 'set-cost-known'; costId: string; amountRands: string; source: string; at: string }
  | { type: 'review-ceiling'; reviewedBy: string; approvedRands: string; reason: string; reviewedAt: string }
  | { type: 'record-bid' }
  | { type: 'prepare-contract' }
  | { type: 'release-finance' }

const examplePolicy: CeilingPolicy = {
  formulaVersion: ceilingFormulaVersion,
  formulaReviewed: true,
  formulaNote: 'Example only. This working rule is not a transfer-duty, tax or fee tariff.',
  minimumNetProfitCents: 15_000_000,
  marginOfSafetyBps: 1000,
  minimumReturnOnCashBps: 2000,
  maximumCapitalCents: 20_000_000,
  depositBps: 1000,
}

function line(input: Parameters<typeof createCostLine>[0]): CostLine {
  const result = createCostLine(input)
  if (!result.ok) throw new Error(result.error)
  return result.line
}

function point(input: Parameters<typeof createEvidencePoint>[0]): EvidencePoint {
  const result = createEvidencePoint(input)
  if (!result.ok) throw new Error(result.error)
  return result.point
}

export function exampleDeskState(): DeskState {
  const captured = captureOpportunity({
    id: '006-example-property',
    company: 'digikraal',
    role: 'principal',
    name: 'Example auction · not a live property',
    address: '1 Example Street, Exampleton',
    legalDescription: 'Erf 1 Exampleton',
    propertyType: 'House',
    source: 'Example auction notice',
    channel: 'auction',
    strategy: 'auction_flip',
    deadline: '2026-11-15',
    nextAction: 'Add achieved-sale evidence before any ceiling is reviewed.',
    preparedBy: 'Deal preparer',
  })
  if (!captured.ok) throw new Error(captured.error)
  return {
    example: true,
    version: 1,
    opportunity: captured.opportunity,
    evidence: [
      point({ id: 'evidence-asking', grade: 'active_asking_price', amountCents: 120_000_000, adjustmentCents: null, adjustmentStated: false, source: 'Example listing', sourceDate: '2026-10-01', originalWording: 'Listed at R1 200 000' }),
      point({ id: 'evidence-auction', grade: 'auction_marketing_claim', amountCents: 90_000_000, adjustmentCents: null, adjustmentStated: false, source: 'Example auction brochure', sourceDate: '2026-10-02', originalWording: 'Brochure claims a value of R900 000' }),
    ],
    costs: [
      line({ id: 'cost-selling', name: 'Selling cost', role: 'selling', status: 'known', amountCents: 5_000_000, source: 'Example selling-cost assumption' }),
      line({ id: 'cost-other', name: 'Transfer and auction costs', role: 'other', status: 'known', amountCents: 8_000_000, source: 'Example cost sheet' }),
      line({ id: 'cost-immediate', name: 'Keys and security', role: 'immediate', status: 'known', amountCents: 2_000_000, source: 'Example cash timing' }),
      line({ id: 'cost-arrears', name: 'Municipal arrears', role: 'other', status: 'unknown' }),
    ],
    policy: examplePolicy,
    review: null,
    history: [],
    message: 'The asking price and auction claim below are not an achieved sale.',
    alert: '',
  }
}

export function visibleToCompany(state: DeskState, company: Company): DeskState | null {
  if (company !== 'digikraal' || state.opportunity.company !== 'digikraal') return null
  return state
}

export function openCosts(lines: CostLine[]): { unknown: string[]; provisional: string[] } {
  return {
    unknown: lines.filter((item) => item.status === 'unknown').map((item) => item.name),
    provisional: lines.filter((item) => item.status === 'provisional').map((item) => item.name),
  }
}

export function ceilingFor(state: DeskState): CeilingResult {
  const range = achievedSaleRange(state.evidence)
  const selling = sumRole(state.costs, 'selling')
  const other = sumRole(state.costs, 'other')
  const immediate = sumRole(state.costs, 'immediate')
  const open = openCosts(state.costs)
  const exit = state.evidence.find((item) => isSaleGrade(item.grade) && adjustedCents(item) === range.lowCents)
  return recommendCeiling({
    conservativeExitCents: range.lowCents,
    exitEvidenceGrade: exit?.grade ?? null,
    sellingCostCents: selling.ok ? selling.cents : null,
    otherKnownCostCents: other.ok ? other.cents : null,
    unknownCostNames: open.unknown,
    provisionalCostNames: open.provisional,
    minimumNetProfitCents: state.policy.minimumNetProfitCents,
    marginOfSafetyBps: state.policy.marginOfSafetyBps,
    minimumReturnOnCashBps: state.policy.minimumReturnOnCashBps,
    maximumCapitalCents: state.policy.maximumCapitalCents,
    depositBps: state.policy.depositBps,
    immediateNonPurchaseCents: immediate.ok ? immediate.cents : null,
    formulaReviewed: state.policy.formulaReviewed,
  })
}

export type NextMove = { action: 'evidence' | 'cost' | 'review' | 'done' | 'wait'; title: string; detail: string; costId?: string }

export function nextMove(state: DeskState): NextMove {
  const range = achievedSaleRange(state.evidence)
  if (!state.opportunity.legalDescription) return { action: 'wait', title: 'Property not identified', detail: 'Add the legal description before any calculation.' }
  if (!state.policy.formulaReviewed) return { action: 'wait', title: 'Ceiling blocked', detail: 'Formula 006-bid-ceiling-v1 has not been reviewed.' }
  if (range.lowCents === null) return { action: 'evidence', title: 'Ceiling blocked', detail: 'Add achieved-sale evidence. Asking prices and estimates are not turned into a value.' }
  const blockingCost = state.costs.find((item) => item.status !== 'known')
  if (blockingCost) return { action: 'cost', title: 'Ceiling blocked', detail: `${blockingCost.name} is ${blockingCost.status} and was not treated as zero.`, costId: blockingCost.id }
  const ceiling = ceilingFor(state)
  if (ceiling.cents === null) return { action: 'wait', title: 'Ceiling blocked', detail: ceiling.blockers[0] ?? 'The ceiling cannot be calculated.' }
  if (!state.review) return { action: 'review', title: 'Ceiling ready for review', detail: 'A different person must review the ceiling. Review does not place a bid.' }
  return { action: 'done', title: 'Ceiling reviewed', detail: 'The ceiling is a limit. No bid, contract or payment was made.' }
}

function refuse(state: DeskState, kind: ExecutionKind): DeskState {
  return { ...state, alert: refuseExecution(kind) }
}

function invalidate(state: DeskState, reason: string, at: string): DeskState {
  const history = state.review ? [...state.history, { version: state.version, reason, at, review: state.review }] : state.history
  return { ...state, version: state.version + 1, review: null, history, alert: '' }
}

function samePerson(left: string, right: string): boolean {
  return left.trim().toLocaleLowerCase() === right.trim().toLocaleLowerCase()
}

export function applyDeskAction(state: DeskState, action: DeskAction): DeskState {
  if (action.type === 'record-bid') return refuse(state, 'bid')
  if (action.type === 'prepare-contract') return refuse(state, 'contract')
  if (action.type === 'release-finance') return refuse(state, 'finance')
  if (action.type === 'add-sale-evidence') {
    const amount = parseRands(action.amountRands)
    const adjustmentText = action.adjustmentRands.trim()
    const negative = adjustmentText.startsWith('-')
    const adjustment = adjustmentText === '' ? null : parseRands(adjustmentText.replace(/^-/, ''))
    if (amount === null) return { ...state, alert: 'Enter the registered price in rands, such as 1000000.00.' }
    if (adjustment === null) return { ...state, alert: 'An adjustment left blank is unknown and was not treated as zero.' }
    if (amount + (negative ? -adjustment : adjustment) < 0) return { ...state, alert: 'The adjustment cannot reduce the evidence below zero.' }
    const created = createEvidencePoint({
      id: `evidence-sale-${state.evidence.length + 1}`,
      grade: action.grade,
      amountCents: amount,
      adjustmentCents: negative ? -adjustment : adjustment,
      adjustmentStated: true,
      source: action.source,
      sourceDate: action.sourceDate,
      originalWording: `Price ${action.amountRands.trim()}; adjustment ${action.adjustmentRands.trim()}; source ${action.source.trim()}`,
    })
    if (!created.ok) return { ...state, alert: created.error }
    if (!validDate(action.sourceDate)) return { ...state, alert: 'Evidence needs a valid source date.' }
    const next = invalidate({ ...state, evidence: [...state.evidence, created.point] }, 'Achieved-sale evidence changed, so the previous review was voided.', action.at)
    return { ...next, message: 'Achieved-sale evidence was added. It is decision support, not a formal valuation.' }
  }
  if (action.type === 'set-cost-known') {
    const amount = parseRands(action.amountRands)
    if (amount === null) return { ...state, alert: 'Enter the known amount in rands, or leave the cost unknown.' }
    const current = state.costs.find((item) => item.id === action.costId)
    if (!current) return { ...state, alert: 'That cost is not on this opportunity.' }
    const known = createCostLine({ id: current.id, name: current.name, role: current.role, status: 'known', amountCents: amount, explicitZero: amount === 0, source: action.source })
    if (!known.ok) return { ...state, alert: known.error }
    const next = invalidate({ ...state, costs: state.costs.map((item) => item.id === current.id ? known.line : item) }, 'A cost changed, so the previous review was voided.', action.at)
    return { ...next, message: `${current.name} is now a known cost from the source you entered.` }
  }
  const ceiling = ceilingFor(state)
  if (ceiling.cents === null || nextMove(state).action === 'evidence' || nextMove(state).action === 'cost' || nextMove(state).action === 'wait') {
    return { ...state, alert: 'The ceiling is blocked. Nothing was approved.' }
  }
  const approved = parseRands(action.approvedRands)
  const reviewer = action.reviewedBy.trim()
  const reason = action.reason.trim()
  if (!reviewer || reviewer.length > 80) return { ...state, alert: 'Enter the reviewer.' }
  if (samePerson(reviewer, state.opportunity.preparedBy)) return { ...state, alert: 'The preparer cannot review this ceiling.' }
  if (!reason || reason.length < 8 || reason.length > 500) return { ...state, alert: 'Add a short reason for the review.' }
  if (!validTimestamp(action.reviewedAt)) return { ...state, alert: 'The review time is not valid.' }
  if (approved === null) return { ...state, alert: 'Enter the approved ceiling in rands.' }
  if (state.review && approved > state.review.approvedCeilingCents) return { ...state, alert: 'A review cannot raise the ceiling.' }
  if (approved > ceiling.cents) return { ...state, alert: 'The approved ceiling is above the recommendation.' }
  const review: CeilingReview = { reviewedBy: reviewer, reviewedAt: action.reviewedAt, approvedCeilingCents: approved, reason, recommendationCents: ceiling.cents, underwritingVersion: state.version }
  const history = state.review ? [...state.history, { version: state.version, reason: 'A later review lowered the ceiling.', at: action.reviewedAt, review: state.review }] : state.history
  return { ...state, review, history, alert: '', message: 'Ceiling reviewed. No bid, contract or payment was made.' }
}

export function autoRaiseCeiling(state: DeskState): { state: DeskState; error: string } {
  return { state: { ...state, alert: 'The bid ceiling cannot be raised autonomously.' }, error: 'The bid ceiling cannot be raised autonomously.' }
}

export const exampleCeilingCents = 59_500_000
