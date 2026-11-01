import type { ActionPlan } from '@/lib/workspace/actionPlan'
import type { Company } from '@/lib/workspace/catalogue'

/** Capability 002 stays inside Pivot OS. It is not a separate app. */
export const MODULE_002_ID = '002' as const

export const founderDomains = [
  'planning',
  'communications',
  'goals',
  'agents',
  'personal-money',
  'family',
  'church',
  'health',
  'coding',
  'ideas',
] as const

export type FounderDomain = (typeof founderDomains)[number]

/** Family, church, health and personal money never appear on a company lens. */
export const restrictedFounderDomains = ['family', 'church', 'health', 'personal-money'] as const satisfies readonly FounderDomain[]

export type FounderPrivacy = 'founder-private' | 'company-visible'
export type FounderLens = 'founder' | Exclude<Company, 'personal'>
export type FounderUrgency = 'now' | 'today' | 'later'
export type ProposalKind = 'reply' | 'task' | 'deal' | 'payment' | 'meeting' | 'invoice' | 'debt' | 'archive'
export type NextActionKind = 'approve' | 'evidence' | 'answer' | 'start' | 'progress' | 'record' | 'hold' | 'none'

export type FounderProposal = {
  kind: ProposalKind
  /** An external send, payment or binding commitment is proposed. Drafting is not sending. */
  consequential: boolean
  /** A recorded human decision. Never means the proposal was sent or paid. */
  approved: boolean
  evidence: string
}

export type FounderWorkLink = {
  status: string
  checked: number[]
  plan?: ActionPlan
}

export type FounderSignal = {
  id: string
  title: string
  domain: FounderDomain
  privacy: FounderPrivacy
  company: Company
  updatedAt: string
  due?: string
  urgency: FounderUrgency
  moneyRisk: boolean
  relationshipRisk: boolean
  work?: FounderWorkLink
  proposal?: FounderProposal
}

export type FounderNextAction = {
  label: string
  detail: string
  button: string
  kind: NextActionKind
  /** Always false. This module never sends, pays or starts an agent. */
  executes: false
}

export type FounderQueueItem = {
  id: string
  title: string
  domain: FounderDomain
  privacy: FounderPrivacy
  company: Company
  due?: string
  band: number
  next: FounderNextAction
}

export type FounderCommandView = {
  moduleId: typeof MODULE_002_ID
  lens: FounderLens
  today: string
  focus: FounderQueueItem | null
  needsYou: FounderQueueItem[]
  leverage: FounderQueueItem[]
  parkedCount: number
  bottleneck: { label: string; count: number }
  clearedCount: number
  hiddenPrivateCount: number
  rejections: string[]
  providerStatus: 'not-connected'
}

export type FounderAcceptance = { ok: boolean; violations: string[] }

export const MODULE_002_INTEGRATION = {
  moduleId: MODULE_002_ID,
  name: 'Founder Command Centre',
  placement: 'internal-module',
  ownedPaths: ['lib/modules/002/', 'components/modules/002/', 'tests/modules/002/', 'plan/CURSOR_MODULE_002_STATUS.md'],
  leavesToCeo: ['Shared routes', 'Desk shell', 'Auth', 'Schema', 'Inbox persistence', 'External sends'],
  consumes: ['actionPlanNextMove', 'readActionPlan', 'ActionPlan', 'Company', 'companies'],
  doesNotDuplicate: ['applyWorkAction', 'reviewOrder', 'Inbox capture', 'Approval persistence'],
  entry: {
    build: 'buildFounderCommand',
    accept: 'acceptFounderCommand',
    audit: 'auditFounderCommand',
    fromWork: 'signalFromWork',
    today: 'founderToday',
    component: 'FounderCommandCentre',
  },
  mount: {
    when: 'After the active workflow writer finishes shared workspace files.',
    surface: 'Inside the existing desk. Suggested label: Founder. CEO chooses the route.',
    props: 'signals: readonly FounderSignal[]; lens: FounderLens; today: YYYY-MM-DD; onOpen(id: string): void',
    onOpen: 'Return the signal id to the existing work dialog. This module does not approve, start, send or pay.',
  },
  privacy: 'Restricted domains and founder-private records stay on the founder lens. A company lens shows only company-visible records for that company. Company is preserved on the founder lens.',
  approval: 'Approval records a decision. It does not send a message, release a payment, or start agent execution.',
  providers: 'WhatsApp and email are not connected. The view only ranks signals the caller already holds.',
  attributes: ['data-module="002"', 'data-lens', 'data-focus-id', 'data-needs-you', 'data-leverage', 'data-provider="not-connected"'],
} as const
