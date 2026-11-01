import type { Company } from '../../workspace/catalogue'

/** Capability 010 stays inside Pivot OS. It is an incubator, not an execution desk. */
export const MODULE_010_ID = '010' as const

export const NEVER_A_COMMITMENT = 'An idea is not a commitment. Nothing is ordered, signed, spent or launched from Opportunity Lab.'

export const receivingCapabilities = ['003', '004', '005', '006', '007', '008', '009', '011', 'new-capability'] as const

export type ReceivingCapability = (typeof receivingCapabilities)[number]
export type EvidenceLevel = 0 | 1 | 2 | 3 | 4 | 5
export type EvidenceKind = 'conversation' | 'indication' | 'external' | 'commercial' | 'pilot' | 'investment-ready'
export type MoneyLabel = 'estimate' | 'quote' | 'approved-case' | 'actual' | 'not-money'
export type Confidentiality = 'shared' | 'founder-private'
export type IdeaStage = 'captured' | 'clarifying' | 'screening' | 'exploring' | 'testing' | 'decision-ready' | 'handover-proposed' | 'handed-over' | 'parked' | 'rejected'
export type ExperimentStatus = 'proposed' | 'approved' | 'running' | 'completed'
export type ExperimentResult = 'supported' | 'not_supported' | 'inconclusive'
export type LabLens = 'founder' | Company

export type CommitmentState = {
  readonly committed: false
  readonly spends: false
  readonly signs: false
  readonly orders: false
  readonly launches: false
  readonly statement: typeof NEVER_A_COMMITMENT
}

export type CapitalGates = {
  materialCapital: boolean
  newEntity: boolean
  propertyAcquisition: boolean
  externalFunding: boolean
  borrowing: boolean
  strategicPartnership: boolean
  newLineOfBusiness: boolean
}

export type Idea = {
  id: string
  moduleId: typeof MODULE_010_ID
  title: string
  capturedOn: string
  originator: string
  source: string
  description: string
  problem: string
  beneficiary: string
  originalWording: string
  confidentiality: Confidentiality
  company: 'digikraal' | 'personal'
  explorationOwner: string
  stage: IdeaStage
  status: string
  approved: false
  commitment: CommitmentState
}

export type Evidence = {
  id: string
  kind: EvidenceKind
  level: EvidenceLevel
  claim: string
  source: string
  sourceDate: string
  originalWording: string
  moneyLabel: MoneyLabel
  caution: string
}

export type Experiment = {
  id: string
  hypothesis: string
  method: string
  owner: string
  start: string
  end: string
  costCents: number | null
  explicitZero: boolean
  capacityNote: string
  successThreshold: string
  stopCondition: string
  status: ExperimentStatus
  approvedBy: string | null
  approvedAt: string | null
  approvedCostCents: number | null
  startedAt: string | null
  result: ExperimentResult | null
  lesson: string
  spends: false
  scales: false
}

export type RouteSuggestion = {
  capabilities: ReceivingCapability[]
  reason: string
  requires008: boolean
  approved: false
}

export type Handover = {
  id: string
  capabilities: ReceivingCapability[]
  receivingOwner: string
  scope: string
  evidenceIds: string[]
  assumptions: string
  openQuestions: string
  budgetStatus: 'none' | 'test-limit'
  risks: string
  nextMilestone: string
  proposedBy: string
  proposedAt: string
  handoverOn: string
  status: 'proposed' | 'accepted' | 'declined'
  acceptedBy: string | null
  acceptedOn: string | null
  declinedBy: string | null
}

export type Parking = {
  reason: string
  missingCondition: string
  reviewOn: string
  trigger: string
  owner: string
  at: string
}

export type Rejection = {
  by: string
  at: string
  reasons: string
  lesson: string
  reopenWhen: string
  evidenceIds: string[]
}

export type DecisionKind = 'evidence' | 'owner' | 'route' | 'share' | 'experiment-proposed' | 'experiment-approved' | 'experiment-started' | 'experiment-completed' | 'handover-proposed' | 'handover-accepted' | 'handover-declined' | 'parked' | 'rejected' | 'refused'

export type Decision = {
  id: string
  kind: DecisionKind
  by: string
  at: string
  note: string
}

export type FounderDecisionSignal = {
  id: string
  title: string
  company: 'digikraal' | 'personal'
  detail: string
  executes: false
}

export type LabAcceptance = { ok: boolean; violations: string[] }

export const evidenceLevel: Record<EvidenceKind, EvidenceLevel> = {
  conversation: 0,
  indication: 1,
  external: 2,
  commercial: 3,
  pilot: 4,
  'investment-ready': 5,
}

export const MODULE_010_INTEGRATION = {
  moduleId: MODULE_010_ID,
  name: 'Opportunity Lab',
  product: 'Pivot OS',
  placement: 'internal-module',
  company: 'digikraal',
  personal: 'Founder-private ideas stay on Personal until a person shares them.',
  ownedPaths: ['lib/modules/010/', 'components/modules/010/', 'tests/modules/010/', 'plan/CURSOR_MODULE_010_STATUS.md'],
  leavesToCeo: ['Shared routes', 'Desk shell', 'Auth', 'Schema', 'Inbox persistence', 'Audit log', 'External sends'],
  consumes: ['Company', 'getSystem'],
  doesNotDuplicate: ['Farm Feed deals', 'Livestock sales', 'Property bids', 'Capital release', 'Ledger posting', 'Capability 002 queue'],
  storage: 'none',
  auth: 'Use the existing founder boundary. This module does not sign anyone in.',
  execution: 'refused',
  commitment: 'impossible-from-an-idea',
  approval: 'A reviewed handover records acceptance by the receiving owner. It does not order, sign, spend, launch, or release capital.',
  audit: 'Decisions stay in the module history. The shared audit log is a CEO integration.',
  providers: 'not-connected',
  external: 'No email, WhatsApp, payment, company-formation or announcement call is made.',
  entry: {
    capture: 'captureIdea',
    open: 'openLab',
    act: 'applyDeskAction',
    next: 'nextMove',
    attention: 'attentionItems',
    accept: 'acceptOpportunityLab',
    visible: 'visibleToLens',
    route: 'suggestRoute',
    signal: 'founderDecisionSignal',
    component: 'OpportunityLabDesk',
  },
  mount: {
    when: 'After the CEO assigns one shared writer for the desk shell.',
    surface: 'Inside the existing desk. Suggested label: Opportunity Lab. CEO chooses the route.',
    props: 'initial: DeskState',
    onDecision: 'Return the idea id to the existing work dialog later. This module does not approve, start, send or pay.',
  },
  attributes: ['data-module="010"', 'data-stage', 'data-commitment="none"', 'data-executes="false"', 'data-handover', 'data-route', 'data-provider="not-connected"'],
} as const
