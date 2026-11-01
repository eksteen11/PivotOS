import { evidenceLevel, type CapitalGates, type Decision, type DecisionKind, type Experiment, type ExperimentResult, type Evidence, type EvidenceKind, type FounderDecisionSignal, type Handover, type Idea, type IdeaStage, type LabAcceptance, type LabLens, type MoneyLabel, type ReceivingCapability } from './contract'
import { acceptHandover, budgetStatement, declineHandover, draftHandover, draftParking, draftRejection } from './decisions'
import { advisoryScore, createEvidence } from './evidence'
import { approveExperiment, completeExperiment, proposeExperiment, sealExperiment, spendFromExperiment, startExperiment } from './experiment'
import { filled, formatZar, sameName, validTimestamp } from './format'
import { captureIdea, commitmentState, sealIdea, type IdeaInput } from './idea'
import { assignRoute, gatesRequire008, suggestRoute } from './route'

export type DeskState = {
  example: boolean
  idea: Idea
  evidence: Evidence[]
  experiment: Experiment | null
  route: import('./contract').RouteSuggestion
  gates: CapitalGates
  handovers: Handover[]
  parking: import('./contract').Parking | null
  rejection: import('./contract').Rejection | null
  decisions: Decision[]
  message: string
  alert: string
}

export type DeskAction =
  | { type: 'name-owner'; owner: string; at: string }
  | { type: 'add-evidence'; kind: EvidenceKind; claim: string; source: string; sourceDate: string; originalWording: string; moneyLabel: MoneyLabel; realisedProfit?: boolean; signedPartnership?: boolean; treatAsOrder?: boolean; at: string }
  | { type: 'set-route'; capabilities: ReceivingCapability[]; by: string; at: string; materialCapital?: boolean; newEntity?: boolean; propertyAcquisition?: boolean; externalFunding?: boolean; borrowing?: boolean; strategicPartnership?: boolean; newLineOfBusiness?: boolean }
  | { type: 'share'; by: string; at: string }
  | { type: 'propose-experiment'; hypothesis: string; method: string; owner: string; start: string; end: string; costRands: string; explicitZero: boolean; capacityNote: string; successThreshold: string; stopCondition: string; at: string }
  | { type: 'approve-experiment'; by: string; at: string }
  | { type: 'start-experiment'; by: string; at: string }
  | { type: 'complete-experiment'; by: string; result: ExperimentResult; lesson: string; at: string }
  | { type: 'propose-handover'; proposedBy: string; receivingOwner: string; scope: string; assumptions: string; openQuestions: string; risks: string; nextMilestone: string; handoverOn: string; at: string }
  | { type: 'accept-handover'; by: string; at: string }
  | { type: 'decline-handover'; by: string; at: string }
  | { type: 'park'; reason: string; missingCondition: string; reviewOn: string; trigger: string; owner: string; at: string }
  | { type: 'reject'; by: string; reasons: string; lesson: string; reopenWhen: string; at: string }
  | { type: 'place-order'; by: string; at: string }
  | { type: 'sign'; by: string; at: string }
  | { type: 'spend'; by: string; at: string }
  | { type: 'announce'; by: string; at: string }
  | { type: 'mark-profit'; by: string; at: string }
  | { type: 'scale'; by: string; at: string }

const emptyGates: CapitalGates = {
  materialCapital: false,
  newEntity: false,
  propertyAcquisition: false,
  externalFunding: false,
  borrowing: false,
  strategicPartnership: false,
  newLineOfBusiness: false,
}

const closed: IdeaStage[] = ['handed-over', 'rejected', 'parked']

export function currentHandover(state: DeskState): Handover | null {
  return state.handovers.at(-1) ?? null
}

function actor(state: DeskState): string {
  return state.idea.explorationOwner || state.idea.originator || 'Unknown'
}

function fail(state: DeskState, alert: string, by: string, at: string): DeskState {
  return { ...state, alert, decisions: [...state.decisions, { id: `refused-${state.decisions.length + 1}`, kind: 'refused', by, at, note: alert }] }
}

function note(state: DeskState, kind: DecisionKind, by: string, at: string, text: string, patch: Partial<DeskState> = {}): DeskState {
  const decision: Decision = { id: `${kind}-${state.decisions.length + 1}`, kind, by, at, note: text }
  const experiment = patch.experiment === undefined ? state.experiment : patch.experiment === null ? null : sealExperiment(patch.experiment)
  return { ...state, ...patch, idea: sealIdea(patch.idea ?? state.idea), experiment, alert: '', message: text, decisions: [...state.decisions, decision] }
}

function needsCapital(state: DeskState): boolean {
  return gatesRequire008(state.gates) || state.route.requires008 || state.evidence.some((item) => item.kind === 'investment-ready')
}

export function openLab(idea: Idea, options?: { text?: string; gates?: Partial<CapitalGates> }): DeskState {
  const gates = { ...emptyGates, ...options?.gates }
  const text = options?.text ?? [idea.title, idea.description, idea.problem, idea.originalWording].join(' ')
  return {
    example: false,
    idea: sealIdea(idea),
    evidence: [],
    experiment: null,
    route: suggestRoute({ text, ...gates }),
    gates,
    handovers: [],
    parking: null,
    rejection: null,
    decisions: [],
    message: 'Captured only. This idea is not approved.',
    alert: '',
  }
}

export function exampleDeskState(): DeskState {
  const captured = captureIdea({
    id: '010-example-custom-feeding',
    title: 'Example · custom feeding · not approved',
    capturedOn: '2026-10-25',
    originator: 'Conrad',
    source: 'Meeting note',
    description: 'A custom-feeding idea raised in a meeting.',
    problem: 'Cattle may need custom feeding.',
    beneficiary: 'A cattle feeder',
    originalWording: 'Conrad raised custom feeding in the meeting. No order was made.',
    confidentiality: 'shared',
    company: 'digikraal',
    explorationOwner: 'Exploration owner',
  })
  if (!captured.ok) throw new Error(captured.error)
  return { ...openLab(captured.idea), example: true }
}

export type LabMove = {
  title: string
  detail: string
  action: 'owner' | 'evidence' | 'experiment' | 'approve-experiment' | 'start-experiment' | 'complete-experiment' | 'route' | 'handover' | 'accept-handover' | 'held'
  executes: false
}

export function nextMove(state: DeskState): LabMove {
  const held = (title: string, detail: string): LabMove => ({ title, detail, action: 'held', executes: false })
  const handover = currentHandover(state)
  if (state.idea.stage === 'rejected') return held('Rejected', 'The reasons stay on the record. Rejection is a decision, and it is not a commitment.')
  if (state.idea.stage === 'parked') return held('Parked', `Review on ${state.parking?.reviewOn ?? 'a date still to set'}. Parked is not approval.`)
  if (state.idea.stage === 'handed-over') return held('Handover accepted', `${handover?.receivingOwner ?? 'The receiving owner'} holds the next milestone: ${handover?.nextMilestone ?? 'not recorded'}. This lab does not run the work.`)
  if (handover?.status === 'proposed') return { title: 'Ask the receiving owner to accept', detail: 'A proposed handover is not accepted and not a commitment.', action: 'accept-handover', executes: false }
  if (!filled(state.idea.explorationOwner)) return { title: 'Name an owner', detail: 'Someone must own the exploration. Naming them does not approve the idea.', action: 'owner', executes: false }
  if (state.experiment?.status === 'proposed') return { title: 'Review the test', detail: 'A proposed test cannot spend money. The person who prepared it cannot approve it.', action: 'approve-experiment', executes: false }
  if (state.experiment?.status === 'approved') return { title: 'Record the test as started', detail: 'Starting the test does not place an order or release money.', action: 'start-experiment', executes: false }
  if (state.experiment?.status === 'running') return { title: 'Record the test result', detail: 'A result is learning. It does not approve scale or spend.', action: 'complete-experiment', executes: false }
  const strongest = advisoryScore(state.evidence).strongest
  if (strongest === null || strongest < 1) return { title: 'Add evidence', detail: 'A conversation is not a commitment. Capture what is known before a test or handover.', action: 'evidence', executes: false }
  const handoverReady = state.experiment?.status === 'completed' || strongest >= 2
  if (!handoverReady) return { title: 'Propose a small test', detail: 'The cheapest useful test stays inside the lab until a different person reviews it.', action: 'experiment', executes: false }
  if (state.route.capabilities.length === 0) return { title: 'Choose a capability', detail: 'A suggestion is not a handover. Nothing is committed by naming a lane.', action: 'route', executes: false }
  return { title: 'Propose a handover', detail: 'The receiving owner must accept before this leaves the lab. Nothing is ordered, signed or paid.', action: 'handover', executes: false }
}

export function visibleToLens(state: DeskState, lens: LabLens): DeskState | null {
  if (lens === 'founder') return state
  if (state.idea.confidentiality === 'founder-private') return lens === 'personal' ? state : null
  if (state.idea.company === 'digikraal' && state.idea.confidentiality === 'shared' && lens === 'digikraal') return state
  return null
}

export function attentionItems(states: readonly DeskState[], today: string, lens: LabLens): { id: string; title: string; reason: string }[] {
  return states.flatMap((item) => {
    const state = visibleToLens(item, lens)
    if (!state) return []
    const reason = attentionReason(state, today)
    return reason ? [{ id: state.idea.id, title: state.idea.title, reason }] : []
  })
}

function attentionReason(state: DeskState, today: string): string | null {
  if (state.idea.stage === 'rejected' || state.idea.stage === 'handed-over') return null
  if (state.idea.stage === 'parked') return state.parking && state.parking.reviewOn <= today ? `Review date ${state.parking.reviewOn} has arrived.` : null
  const handover = currentHandover(state)
  if (handover?.status === 'proposed') return 'The receiving owner has not accepted the handover.'
  if (state.experiment?.status === 'proposed') return 'A decision-maker needs to review the test.'
  if (state.experiment?.status === 'approved') return 'The test is approved and has not started. No money has moved.'
  if (state.experiment?.status === 'running') return 'Record the test result. The test is not permission to scale.'
  if (state.experiment?.status === 'completed') return 'Propose a handover or leave the idea in the lab.'
  const strongest = advisoryScore(state.evidence).strongest
  if (strongest === null || strongest < 1) return 'Add evidence before this idea can move.'
  if (strongest === 1) return 'Propose the cheapest useful test.'
  if (!currentHandover(state) || currentHandover(state)?.status === 'declined') return 'This idea can be routed once a handover is proposed.'
  return null
}

export function founderDecisionSignal(state: DeskState, today: string): FounderDecisionSignal | null {
  const move = nextMove(state)
  const parkedDue = state.idea.stage === 'parked' && Boolean(state.parking && state.parking.reviewOn <= today)
  if (move.action !== 'approve-experiment' && move.action !== 'accept-handover' && !parkedDue) return null
  return { id: state.idea.id, title: state.idea.title, company: state.idea.company, detail: move.detail, executes: false }
}

function mergeGates(gates: CapitalGates, action: Extract<DeskAction, { type: 'set-route' }>): CapitalGates {
  return {
    materialCapital: gates.materialCapital || Boolean(action.materialCapital),
    newEntity: gates.newEntity || Boolean(action.newEntity),
    propertyAcquisition: gates.propertyAcquisition || Boolean(action.propertyAcquisition),
    externalFunding: gates.externalFunding || Boolean(action.externalFunding),
    borrowing: gates.borrowing || Boolean(action.borrowing),
    strategicPartnership: gates.strategicPartnership || Boolean(action.strategicPartnership),
    newLineOfBusiness: gates.newLineOfBusiness || Boolean(action.newLineOfBusiness),
  }
}

export function applyDeskAction(state: DeskState, action: DeskAction): DeskState {
  const time = 'at' in action ? action.at : ''
  const by = 'by' in action ? action.by : actor(state)
  if (!validTimestamp(time)) return fail(state, 'Use a real decision time.', by, time)
  if (action.type === 'place-order') return fail(state, 'Opportunity Lab does not place an order. A quotation is not an order.', by, time)
  if (action.type === 'sign') return fail(state, 'Opportunity Lab does not sign an agreement. A partner discussion is not a signed partnership.', by, time)
  if (action.type === 'spend') return fail(state, spendFromExperiment(state.experiment ?? emptyExperiment()).error, by, time)
  if (action.type === 'announce') return fail(state, 'Opportunity Lab does not announce a launch.', by, time)
  if (action.type === 'mark-profit') return fail(state, 'An estimate is not realised profit. Opportunity Lab does not book profit.', by, time)
  if (action.type === 'scale') return fail(state, 'A successful experiment is not scale approval.', by, time)
  if (action.type === 'name-owner') {
    if (filled(state.idea.explorationOwner)) return fail(state, 'The exploration owner stays as recorded.', by, time)
    if (!filled(action.owner)) return fail(state, 'Name an exploration owner.', by, time)
    return note(state, 'owner', action.owner, time, 'Exploration owner recorded. The idea is not approved.', { idea: { ...state.idea, explorationOwner: action.owner.trim() } })
  }
  if (action.type === 'share') {
    if (state.idea.confidentiality !== 'founder-private') return fail(state, 'Share is only for a founder-private idea.', by, time)
    if (!filled(action.by)) return fail(state, 'Name the person who is sharing this idea.', by, time)
    return note(state, 'share', action.by, time, 'Shared with DigiKraal. Sharing does not approve the idea.', { idea: { ...state.idea, confidentiality: 'shared', company: 'digikraal' } })
  }
  if (action.type === 'add-evidence') return addEvidence(state, action)
  if (action.type === 'set-route') return setRoute(state, action)
  if (action.type === 'propose-experiment') return addExperiment(state, action)
  if (action.type === 'approve-experiment') return reviewExperiment(state, action)
  if (action.type === 'start-experiment') return beginExperiment(state, action)
  if (action.type === 'complete-experiment') return finishExperiment(state, action)
  if (action.type === 'propose-handover') return propose(state, action)
  if (action.type === 'accept-handover') return accept(state, action)
  if (action.type === 'decline-handover') return decline(state, action)
  if (action.type === 'park') return park(state, action)
  return reject(state, action)
}

function emptyExperiment(): Experiment {
  return sealExperiment({
    id: 'none', hypothesis: '', method: '', owner: '', start: '', end: '', costCents: null, explicitZero: false, capacityNote: '', successThreshold: '', stopCondition: '',
    status: 'proposed', approvedBy: null, approvedAt: null, approvedCostCents: null, startedAt: null, result: null, lesson: '', spends: false, scales: false,
  })
}

function blocked(state: DeskState): boolean {
  return closed.includes(state.idea.stage) || currentHandover(state)?.status === 'proposed'
}

function addEvidence(state: DeskState, action: Extract<DeskAction, { type: 'add-evidence' }>): DeskState {
  const by = actor(state)
  if (state.idea.stage === 'handed-over') return fail(state, 'This lab does not keep working the idea after the receiving owner accepts.', by, action.at)
  if (action.realisedProfit) return fail(state, 'An estimate is not realised profit. Opportunity Lab does not book profit.', by, action.at)
  if (action.signedPartnership) return fail(state, 'Opportunity Lab cannot record a signed partnership.', by, action.at)
  if (action.treatAsOrder) return fail(state, 'A quotation is not an order.', by, action.at)
  const created = createEvidence({
    id: `evidence-${state.evidence.length + 1}`,
    kind: action.kind,
    claim: action.claim,
    source: action.source,
    sourceDate: action.sourceDate,
    originalWording: action.originalWording,
    moneyLabel: action.moneyLabel,
  }, state.experiment?.status === 'completed')
  if (!created.ok) return fail(state, created.error, by, action.at)
  let route = state.route
  if (created.evidence.kind === 'investment-ready' && !route.capabilities.includes('008')) {
    route = assignRoute([...route.capabilities, '008'], state.gates, 'Level 5 evidence includes Capability 008. This is not investment approval.')
  }
  const keepStage = ['parked', 'rejected', 'testing', 'decision-ready', 'handover-proposed'].includes(state.idea.stage)
  const stage = keepStage ? state.idea.stage : created.evidence.level < 1 ? 'clarifying' as const : 'screening' as const
  const status = keepStage ? state.idea.status : created.evidence.level < 1 ? 'Needs Clarification' : 'Under Screening'
  const text = state.idea.stage === 'parked'
    ? `${created.evidence.caution} The idea stays parked.`
    : state.idea.stage === 'rejected'
      ? `${created.evidence.caution} The rejection stands.`
      : `${created.evidence.caution} The idea is still not approved.`
  return note(state, 'evidence', by, action.at, text, { evidence: [...state.evidence, created.evidence], route, idea: { ...state.idea, stage, status } })
}

function setRoute(state: DeskState, action: Extract<DeskAction, { type: 'set-route' }>): DeskState {
  if (['handed-over', 'rejected', 'handover-proposed', 'parked'].includes(state.idea.stage)) return fail(state, 'The route stays put while this idea is parked, rejected, or in handover.', action.by, action.at)
  const gates = mergeGates(state.gates, action)
  const requested = [...action.capabilities]
  if ((state.route.requires008 || state.evidence.some((item) => item.kind === 'investment-ready')) && !requested.includes('008')) requested.push('008')
  const route = assignRoute(requested, gates, 'A person updated the suggested route. This is not a handover.')
  if (route.capabilities.length === 0) return fail(state, 'Name at least one capability. This does not approve the idea.', action.by, action.at)
  return note(state, 'route', action.by, action.at, `${route.reason} The idea is not a commitment.`, { route, gates })
}

function addExperiment(state: DeskState, action: Extract<DeskAction, { type: 'propose-experiment' }>): DeskState {
  if (blocked(state) || state.idea.stage === 'handed-over') return fail(state, 'This idea is closed for new tests.', actor(state), action.at)
  if (state.experiment) return fail(state, 'This idea already has a test.', action.owner, action.at)
  const drafted = proposeExperiment({ ...action, id: `experiment-${state.idea.id}` })
  if (!drafted.ok) return fail(state, drafted.error, action.owner || actor(state), action.at)
  return note(state, 'experiment-proposed', drafted.experiment.owner, action.at, 'Test proposed. It cannot spend money and it is not approval to operate.', {
    experiment: drafted.experiment,
    idea: { ...state.idea, stage: 'exploring', status: 'Awaiting Decision' },
  })
}

function reviewExperiment(state: DeskState, action: Extract<DeskAction, { type: 'approve-experiment' }>): DeskState {
  if (!state.experiment) return fail(state, 'There is no test waiting for review.', action.by, action.at)
  if (!filled(state.idea.explorationOwner)) return fail(state, 'Name an exploration owner before a decision.', action.by, action.at)
  const reviewed = approveExperiment(state.experiment, { by: action.by, explorationOwner: state.idea.explorationOwner, at: action.at })
  if (!reviewed.ok) return fail(state, reviewed.error, action.by, action.at)
  const text = reviewed.experiment.approvedCostCents === 0
    ? 'No money is approved for this test. Operations have not started.'
    : `Test limit ${formatZar(reviewed.experiment.approvedCostCents)} recorded. No payment is released.`
  return note(state, 'experiment-approved', action.by, action.at, text, { experiment: reviewed.experiment, idea: { ...state.idea, stage: 'exploring', status: 'Experiment Approved' } })
}

function beginExperiment(state: DeskState, action: Extract<DeskAction, { type: 'start-experiment' }>): DeskState {
  if (!state.experiment) return fail(state, 'Start the test only after a different person has approved the limit.', action.by, action.at)
  const started = startExperiment(state.experiment, { by: action.by, explorationOwner: state.idea.explorationOwner, at: action.at })
  if (!started.ok) return fail(state, started.error, action.by, action.at)
  return note(state, 'experiment-started', action.by, action.at, 'Test recorded as started. No order and no payment.', {
    experiment: started.experiment,
    idea: { ...state.idea, stage: 'testing', status: 'Experiment Running' },
  })
}

function finishExperiment(state: DeskState, action: Extract<DeskAction, { type: 'complete-experiment' }>): DeskState {
  if (!state.experiment) return fail(state, 'Record a result only while the test is running.', action.by, action.at)
  const done = completeExperiment(state.experiment, { result: action.result, lesson: action.lesson })
  if (!done.ok) return fail(state, done.error, action.by, action.at)
  const text = action.result === 'supported' ? 'The test supported the hypothesis. That is not scale approval.' : 'Result recorded. The idea is not a commitment.'
  return note(state, 'experiment-completed', action.by, action.at, text, {
    experiment: done.experiment,
    idea: { ...state.idea, stage: 'decision-ready', status: 'Awaiting Decision' },
  })
}

function propose(state: DeskState, action: Extract<DeskAction, { type: 'propose-handover' }>): DeskState {
  if (state.idea.stage === 'handed-over' || state.idea.stage === 'rejected' || state.idea.stage === 'parked') return fail(state, 'This idea is not open for handover.', action.proposedBy, action.at)
  if (currentHandover(state)?.status === 'proposed') return fail(state, 'A handover is already waiting for the receiving owner.', action.proposedBy, action.at)
  const strongest = advisoryScore(state.evidence).strongest ?? 0
  if (state.experiment?.status !== 'completed' && strongest < 2) return fail(state, 'Add stronger evidence or finish a test before handover.', action.proposedBy, action.at)
  const drafted = draftHandover({
    id: `handover-${state.handovers.length + 1}`,
    capabilities: state.route.capabilities,
    needs008: needsCapital(state),
    receivingOwner: action.receivingOwner,
    scope: action.scope,
    evidenceIds: state.evidence.map((item) => item.id),
    assumptions: action.assumptions,
    openQuestions: action.openQuestions,
    budgetStatus: state.experiment?.approvedCostCents === null || state.experiment === null ? 'none' : 'test-limit',
    risks: action.risks,
    nextMilestone: action.nextMilestone,
    proposedBy: action.proposedBy,
    explorationOwner: state.idea.explorationOwner,
    proposedAt: action.at,
    handoverOn: action.handoverOn,
  })
  if (!drafted.ok) return fail(state, drafted.error, action.proposedBy, action.at)
  return note(state, 'handover-proposed', action.proposedBy, action.at, `Handover proposed to ${drafted.handover.receivingOwner}. It is not accepted yet.`, {
    handovers: [...state.handovers, drafted.handover],
    idea: { ...state.idea, stage: 'handover-proposed', status: 'Awaiting Decision' },
  })
}

function accept(state: DeskState, action: Extract<DeskAction, { type: 'accept-handover' }>): DeskState {
  const handover = currentHandover(state)
  if (!handover) return fail(state, 'There is no handover waiting for acceptance.', action.by, action.at)
  const accepted = acceptHandover(handover, action)
  if (!accepted.ok) return fail(state, accepted.error, action.by, action.at)
  const text = `${accepted.handover.acceptedBy} accepted the handover. Next milestone: ${accepted.handover.nextMilestone}. This lab does not run the work. ${budgetStatement(accepted.handover.budgetStatus)}`
  return note(state, 'handover-accepted', action.by, action.at, text, {
    handovers: [...state.handovers.slice(0, -1), accepted.handover],
    idea: { ...state.idea, stage: 'handed-over', status: 'Handed Over' },
  })
}

function decline(state: DeskState, action: Extract<DeskAction, { type: 'decline-handover' }>): DeskState {
  const handover = currentHandover(state)
  if (!handover) return fail(state, 'There is no handover waiting for acceptance.', action.by, action.at)
  const declined = declineHandover(handover, action)
  if (!declined.ok) return fail(state, declined.error, action.by, action.at)
  const stage = state.experiment?.status === 'completed' ? 'decision-ready' as const : 'screening' as const
  return note(state, 'handover-declined', action.by, action.at, 'Handover declined. The idea stays in the lab and is not a commitment.', {
    handovers: [...state.handovers.slice(0, -1), declined.handover],
    idea: { ...state.idea, stage, status: 'Awaiting Decision' },
  })
}

function park(state: DeskState, action: Extract<DeskAction, { type: 'park' }>): DeskState {
  if (state.parking || state.idea.stage === 'parked') return fail(state, 'Already parked.', action.owner, action.at)
  if (state.idea.stage === 'handed-over' || state.idea.stage === 'rejected' || currentHandover(state)?.status === 'proposed') return fail(state, 'Finish the open decision before parking this idea.', action.owner, action.at)
  const parked = draftParking({ reason: action.reason, missingCondition: action.missingCondition, reviewOn: action.reviewOn, trigger: action.trigger, owner: action.owner, at: action.at })
  if (!parked.ok) return fail(state, parked.error, action.owner || actor(state), action.at)
  return note(state, 'parked', parked.parking.owner, action.at, `Parked until ${parked.parking.reviewOn}. Parked is not approval.`, {
    parking: parked.parking,
    idea: { ...state.idea, stage: 'parked', status: 'Parked' },
  })
}

function reject(state: DeskState, action: Extract<DeskAction, { type: 'reject' }>): DeskState {
  if (state.rejection) return fail(state, 'This rejection is already recorded.', action.by, action.at)
  if (state.idea.stage === 'handed-over' || currentHandover(state)?.status === 'proposed') return fail(state, 'Finish the open decision before rejecting this idea.', action.by, action.at)
  const rejected = draftRejection({ by: action.by, at: action.at, reasons: action.reasons, lesson: action.lesson, reopenWhen: action.reopenWhen, evidenceIds: state.evidence.map((item) => item.id), explorationOwner: state.idea.explorationOwner })
  if (!rejected.ok) return fail(state, rejected.error, action.by || actor(state), action.at)
  return note(state, 'rejected', rejected.rejection.by, action.at, 'Rejected. The reasons stay on the record.', {
    rejection: rejected.rejection,
    idea: { ...state.idea, stage: 'rejected', status: 'Rejected' },
  })
}

export function acceptOpportunityLab(state: DeskState): LabAcceptance {
  const violations: string[] = []
  if ((state.idea.approved as boolean) !== false) violations.push('An idea must not be marked approved.')
  if ((state.idea.commitment.committed as boolean) !== false || state.idea.commitment.statement !== commitmentState().statement) violations.push('An idea must not become a commitment.')
  if ((state.idea.commitment.spends as boolean) !== false || (state.idea.commitment.signs as boolean) !== false || (state.idea.commitment.orders as boolean) !== false || (state.idea.commitment.launches as boolean) !== false) violations.push('An idea must not spend, sign, order or launch.')
  if (state.route.approved !== false) violations.push('A route suggestion must not be approved.')
  if (state.idea.confidentiality === 'founder-private' && state.idea.company !== 'personal') violations.push('Founder-private ideas stay on Personal.')
  if (state.idea.confidentiality === 'shared' && state.idea.company !== 'digikraal') violations.push('Shared ideas stay on DigiKraal.')
  for (const item of state.evidence) if (item.level !== evidenceLevel[item.kind]) violations.push('Evidence level does not match its kind.')
  if (state.experiment && (state.experiment.spends !== false || state.experiment.scales !== false)) violations.push('A test must not spend or scale.')
  const accepted = state.handovers.filter((item) => item.status === 'accepted')
  if (accepted.length > 1) violations.push('Only one handover can be accepted.')
  if (state.idea.stage === 'handed-over' && accepted.length !== 1) violations.push('Handover acceptance is missing.')
  if (state.idea.stage !== 'handed-over' && accepted.length > 0) violations.push('An accepted handover must leave the lab stage.')
  for (const item of accepted) {
    if (!sameName(item.acceptedBy ?? '', item.receivingOwner) || sameName(item.acceptedBy ?? '', item.proposedBy) || !filled(item.nextMilestone)) violations.push('Accepted handover needs the receiving owner and a next milestone.')
  }
  if (needsCapital(state) && accepted.some((item) => !item.capabilities.includes('008'))) violations.push('A capital-intensive idea cannot bypass Capability 008.')
  const proposed = currentHandover(state)
  if (proposed?.status === 'proposed' && state.idea.stage !== 'handover-proposed') violations.push('A proposed handover is waiting and the stage must show that.')
  if (state.idea.stage === 'parked' && !state.parking?.reviewOn) violations.push('A parked idea needs a review date.')
  if (state.idea.stage === 'rejected' && (!state.rejection?.reasons || !state.rejection.lesson)) violations.push('A rejection must keep its reasons and lesson.')
  if (state.idea.status === 'Route Approved') violations.push('Route Approved is not used. Acceptance is not a commercial commitment.')
  return { ok: violations.length === 0, violations }
}

export function exampleIdeaInput(): IdeaInput {
  return {
    id: '010-example-custom-feeding',
    title: 'Example · custom feeding · not approved',
    capturedOn: '2026-10-25',
    originator: 'Conrad',
    source: 'Meeting note',
    description: 'A custom-feeding idea raised in a meeting.',
    problem: 'Cattle may need custom feeding.',
    beneficiary: 'A cattle feeder',
    originalWording: 'Conrad raised custom feeding in the meeting. No order was made.',
    confidentiality: 'shared',
    company: 'digikraal',
    explorationOwner: 'Exploration owner',
  }
}
