import type { Company } from '../../workspace/catalogue'
import { availableCashCents, evidenceCaution, evidenceSourceError, type EvidenceGrade, type MoneyFigures } from './evidence'
import { explainVote, formalApprovals, unanimous, verifierBlock, type Vote } from './governance'
import { assessRelease, conditionMet, isStopKind, proposalKey, refuseExecution, type Condition, type ReleaseDecision, type ReleaseInput } from './release'
import { exampleScore, type ScoreInput } from './score'
import { validTimestamp, parseRands } from './format'
import { pillarLabels, policyBlock, policyPayload, policyTopics, stageAllowsCapital, stageLabels, ubuntuProductBlock, type PolicyRecord, type PolicyTopic, type UbuntuProduct, type Venture } from './venture'

export type DeskState = {
  example: boolean
  venture: Venture
  amountCents: number
  requester: string
  verifier: string | null
  figures: MoneyFigures
  cashGrade: EvidenceGrade | null
  conditions: Condition[]
  policy: PolicyRecord
  releaseVotes: Vote[]
  score: ScoreInput
  message: string
  alert: string
}

export type DeskAction =
  | { type: 'record-policy'; its: string; cj: string; dj: string; source: string; sourceDate: string; signed: boolean; at: string }
  | { type: 'clear-stop'; conditionId: string; source: string; sourceDate: string; at: string }
  | { type: 'satisfy-agreement'; conditionId: string; source: string; sourceDate: string; at: string }
  | { type: 'record-cash'; amountRands: string; source: string; sourceDate: string; at: string }
  | { type: 'record-votes'; its: string; cj: string; dj: string; verifier: string; at: string }
  | { type: 'transfer' }
  | { type: 'invest' }
  | { type: 'distribute' }
  | { type: 'record-whatsapp'; at: string }

export type NextMove = { action: 'policy' | 'stop' | 'condition' | 'cash' | 'votes' | 'done' | 'wait'; title: string; detail: string; conditionId?: string }

const unresolvedPolicy = (product: UbuntuProduct): PolicyRecord => ({
  product,
  status: 'unresolved',
  evidenceGrade: null,
  source: '',
  sourceDate: '',
  draftAssignsLoss: true,
  topics: [],
  votes: [],
})

export function exampleDeskState(): DeskState {
  return {
    example: true,
    venture: {
      id: '008-example-camp',
      moduleId: '008',
      company: 'digikraal',
      name: 'Example camp venture',
      pillar: 'sme_livestock_finance',
      sponsor: 'Project sponsor',
      stage: 'awaiting_board',
      participantType: 'A',
      product: 'camp_cattle',
    },
    amountCents: 25_000_000,
    requester: 'Project sponsor',
    verifier: null,
    figures: { pipelineCents: 100_000_000, contractedCents: null, approvedCaseCents: null, forecastCents: 90_000_000, actualCents: null },
    cashGrade: 'pipeline_proposal',
    conditions: [
      { id: 'cond-report', kind: 'reporting', label: 'Monthly reporting', state: 'overdue', evidenceGrade: null },
      { id: 'cond-stock', kind: 'stock_count', label: 'Opening stock count', state: 'overdue', evidenceGrade: null },
      { id: 'cond-agreements', kind: 'agreements_signed', label: 'Shareholder and project agreements', state: 'open', evidenceGrade: null },
    ],
    policy: unresolvedPolicy('camp_cattle'),
    releaseVotes: [],
    score: exampleScore(),
    message: 'Example only. Not a live venture and not an investment.',
    alert: '',
  }
}

export function visibleToCompany(state: DeskState, company: Company): DeskState | null {
  if (company !== 'digikraal' || state.venture.company !== 'digikraal') return null
  return state
}

export function releaseInput(state: DeskState): ReleaseInput {
  const ubuntu = state.venture.product && state.venture.participantType
    ? { participantType: state.venture.participantType, product: state.venture.product }
    : null
  return {
    company: state.venture.company,
    stage: state.venture.stage,
    ventureId: state.venture.id,
    amountCents: state.amountCents,
    requester: state.requester,
    verifier: state.verifier,
    votes: state.releaseVotes,
    conditions: state.conditions,
    policy: ubuntu ? state.policy : null,
    ubuntu,
    cashGrade: state.cashGrade,
    actualCents: state.figures.actualCents,
    override: null,
  }
}

export function deskDecision(state: DeskState): ReleaseDecision {
  return assessRelease(releaseInput(state))
}

function conditionDetail(condition: Condition): string {
  if (isStopKind(condition.kind) && condition.state === 'overdue') return `${condition.label} is overdue. Funding stopped.`
  if (condition.evidenceGrade && !conditionMet(condition)) return `${condition.label} is not satisfied. ${evidenceCaution(condition.evidenceGrade)}`
  return `Still open: ${condition.label}.`
}

export function nextMove(state: DeskState): NextMove {
  const product = ubuntuProductBlock(releaseInput(state).ubuntu)
  if (product) return { action: 'wait', title: 'Capital blocked', detail: product }
  if (!stageAllowsCapital(state.venture.stage)) return { action: 'wait', title: 'Capital blocked', detail: 'This venture stage cannot receive capital.' }
  if (state.venture.product) {
    const policy = policyBlock(state.policy, state.venture.product)
    if (policy) return { action: 'policy', title: 'Capital blocked', detail: policy }
  }
  const blocking = state.conditions.find((condition) => !conditionMet(condition))
  if (blocking && isStopKind(blocking.kind)) return { action: 'stop', title: blocking.state === 'overdue' ? 'Funding stopped' : 'Capital blocked', detail: conditionDetail(blocking), conditionId: blocking.id }
  if (blocking) return { action: 'condition', title: 'Capital blocked', detail: conditionDetail(blocking), conditionId: blocking.id }
  const cash = availableCashCents(state.figures, state.cashGrade)
  if (cash === null) return { action: 'cash', title: 'Capital blocked', detail: 'Pipeline funding is not cash.' }
  if (cash < state.amountCents) return { action: 'cash', title: 'Capital blocked', detail: 'Verified cash does not cover this tranche.' }
  if (deskDecision(state).status !== 'authorised') return { action: 'votes', title: 'Board decision needed', detail: 'Release needs a formal approval from all three shareholder groups, and a verifier who is not the requester.' }
  return { action: 'done', title: 'Decision recorded', detail: 'No money moved. Pivot did not transfer funds.' }
}

function fail(state: DeskState, alert: string): DeskState {
  return { ...state, alert }
}

function boardVotes(names: { its: string; cj: string; dj: string }, key: string): Vote[] {
  return [
    { person: names.its.trim(), group: 'its', capacity: 'board_representative', outcome: 'approve', channel: 'formal_record', payloadKey: key },
    { person: names.cj.trim(), group: 'cj_du_plessis', capacity: 'board_representative', outcome: 'approve', channel: 'formal_record', payloadKey: key },
    { person: names.dj.trim(), group: 'dj_eksteen', capacity: 'board_representative', outcome: 'approve', channel: 'formal_record', payloadKey: key },
  ]
}

function voteError(votes: Vote[], key: string): string | null {
  const check = formalApprovals(votes, key)
  if (!unanimous(votes, key)) return check.errors[0] ?? 'Capital release needs a formal approval from ITS, CJ du Plessis and DJ Eksteen.'
  return null
}

function timed(at: string): string | null {
  return validTimestamp(at) ? null : 'The record needs a valid time.'
}

export function applyDeskAction(state: DeskState, action: DeskAction): DeskState {
  if (action.type === 'transfer') return { ...state, alert: refuseExecution('transfer') }
  if (action.type === 'invest') return { ...state, alert: refuseExecution('invest') }
  if (action.type === 'distribute') return { ...state, alert: refuseExecution('distribute') }
  if (action.type === 'record-whatsapp') {
    const time = timed(action.at)
    if (time) return fail(state, time)
    const vote: Vote = { person: 'WhatsApp sender', group: 'dj_eksteen', capacity: 'board_representative', outcome: 'approve', channel: 'whatsapp', payloadKey: proposalKey(releaseInput(state)) }
    const check = explainVote(vote, vote.payloadKey)
    return { ...state, releaseVotes: [...state.releaseVotes, vote], alert: check.ok ? refuseExecution('whatsapp') : check.error }
  }
  const move = nextMove(state)
  const time = 'at' in action ? timed(action.at) : null
  if (time) return fail(state, time)
  if (action.type === 'record-policy') {
    if (move.action !== 'policy' || !state.venture.product) return state
    if (!action.signed) return fail(state, 'A draft that assigns losses to the SME does not resolve the risk policy.')
    const source = evidenceSourceError(action.source, action.sourceDate)
    if (source) return fail(state, source)
    const key = policyPayload(state.venture.product)
    const votes = boardVotes(action, key)
    const error = voteError(votes, key)
    if (error) return fail(state, error)
    const policy: PolicyRecord = {
      product: state.venture.product,
      status: 'resolved',
      evidenceGrade: 'signed_legal_document',
      source: action.source.trim(),
      sourceDate: action.sourceDate,
      draftAssignsLoss: false,
      topics: policyTopics.map((topic) => topic.id),
      votes,
    }
    return { ...state, policy, alert: '', message: 'Policy evidence recorded. Capital is still not released.' }
  }
  if (action.type === 'clear-stop') {
    if (move.action !== 'stop' || move.conditionId !== action.conditionId) return fail(state, 'That condition is not the one blocking release.')
    const source = evidenceSourceError(action.source, action.sourceDate)
    if (source) return fail(state, source)
    return {
      ...state,
      alert: '',
      message: 'Current evidence recorded. Capital is still not released.',
      conditions: state.conditions.map((item) => item.id === action.conditionId ? { ...item, state: 'satisfied', evidenceGrade: 'verified_statement' } : item),
    }
  }
  if (action.type === 'satisfy-agreement') {
    if (move.action !== 'condition' || move.conditionId !== action.conditionId) return fail(state, 'That condition is not the one blocking release.')
    const source = evidenceSourceError(action.source, action.sourceDate)
    if (source) return fail(state, source)
    return {
      ...state,
      alert: '',
      message: 'Signed agreement recorded. Capital is still not released.',
      conditions: state.conditions.map((item) => item.id === action.conditionId ? { ...item, state: 'satisfied', evidenceGrade: 'signed_legal_document' } : item),
    }
  }
  if (action.type === 'record-cash') {
    if (move.action !== 'cash') return state
    const source = evidenceSourceError(action.source, action.sourceDate)
    if (source) return fail(state, source)
    const amount = parseRands(action.amountRands)
    if (amount === null) return fail(state, 'Enter the verified cash in rands. A blank amount was not treated as zero.')
    if (amount < state.amountCents) return fail(state, 'Verified cash does not cover this tranche.')
    return {
      ...state,
      alert: '',
      cashGrade: 'verified_statement',
      figures: { ...state.figures, actualCents: amount },
      message: 'Verified cash recorded apart from pipeline and forecast. Capital is still not released.',
    }
  }
  if (action.type === 'record-votes') {
    if (move.action !== 'votes') return state
    const verifierError = verifierBlock(action.verifier, state.requester)
    if (verifierError) return fail(state, verifierError)
    const key = proposalKey(releaseInput(state))
    const votes = boardVotes(action, key)
    const error = voteError(votes, key)
    if (error) return fail(state, error)
    const next: DeskState = { ...state, releaseVotes: votes, verifier: action.verifier.trim(), alert: '' }
    const decision = deskDecision(next)
    if (decision.status !== 'authorised') return fail(state, decision.blockers[0] ?? 'Capital stays blocked.')
    return { ...next, venture: { ...next.venture, stage: 'approved_with_conditions' }, message: 'Board decision recorded. No money moved.' }
  }
  return state
}

export function policyTopicLabels(): { id: PolicyTopic; label: string }[] {
  return policyTopics.map((topic) => ({ id: topic.id, label: topic.label }))
}

export { pillarLabels, stageLabels }
