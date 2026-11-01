import { wrongLaneMessage } from './contract'
import type { EvidenceGrade } from './evidence'
import { unanimous, type Vote } from './governance'
import { payloadKey } from './payload'

export const pillars = [
  'technology_agency_auctions',
  'farming_livestock',
  'property_containers',
  'grain_feed',
  'sme_livestock_finance',
  'contracts_market_access',
  'experimental',
] as const

export type Pillar = (typeof pillars)[number]

export const ventureStages = [
  'idea',
  'discovery',
  'initial_screen',
  'business_case',
  'structuring',
  'due_diligence',
  'awaiting_board',
  'approved_with_conditions',
  'capital_ready',
  'pilot',
  'operating',
  'scaling',
  'hold_correct_exit',
  'closed',
] as const

export const alternativeOutcomes = ['rejected', 'deferred', 'merged', 'returned_for_evidence', 'cancelled'] as const
export type VentureStage = (typeof ventureStages)[number] | (typeof alternativeOutcomes)[number]
export type UbuntuType = 'A' | 'B' | 'C' | 'D'
export type UbuntuProduct = 'camp_cattle' | 'working_capital'

export const policyTopics = [
  { id: 'ownership', label: 'Legal ownership of the animals' },
  { id: 'risk_transfer', label: 'When risk transfers' },
  { id: 'mortality', label: 'Mortality and disease' },
  { id: 'theft', label: 'Theft and disappearance' },
  { id: 'price_loss', label: 'Price and market loss' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'identification', label: 'Identification and stock counts' },
  { id: 'sale_authority', label: 'Sale authority' },
  { id: 'proceeds', label: 'Proceeds control' },
  { id: 'security', label: 'Security or guarantees' },
  { id: 'default_recovery', label: 'Default and recovery' },
  { id: 'disputes', label: 'Dispute resolution' },
  { id: 'fair_treatment', label: 'Fair treatment and regulatory obligations' },
] as const

export type PolicyTopic = (typeof policyTopics)[number]['id']

export type PolicyRecord = {
  product: UbuntuProduct
  status: 'unresolved' | 'resolved'
  evidenceGrade: EvidenceGrade | null
  source: string
  sourceDate: string
  draftAssignsLoss: boolean
  topics: PolicyTopic[]
  votes: Vote[]
}

export type Venture = {
  id: string
  moduleId: '008'
  company: 'digikraal'
  name: string
  pillar: Pillar | null
  sponsor: string
  stage: VentureStage
  participantType: UbuntuType | null
  product: UbuntuProduct | null
}

const releaseStages = new Set<VentureStage>(['awaiting_board', 'approved_with_conditions', 'capital_ready', 'pilot', 'operating', 'scaling'])

export const stageLabels: Record<VentureStage, string> = {
  idea: 'Idea',
  discovery: 'Discovery',
  initial_screen: 'Initial screen',
  business_case: 'Business case',
  structuring: 'Structuring',
  due_diligence: 'Due diligence',
  awaiting_board: 'Awaiting board',
  approved_with_conditions: 'Approved with conditions',
  capital_ready: 'Capital ready',
  pilot: 'Pilot',
  operating: 'Operating',
  scaling: 'Scaling',
  hold_correct_exit: 'Hold, correct or exit',
  closed: 'Closed',
  rejected: 'Rejected',
  deferred: 'Deferred',
  merged: 'Merged',
  returned_for_evidence: 'Returned for evidence',
  cancelled: 'Cancelled',
}

export const pillarLabels: Record<Pillar, string> = {
  technology_agency_auctions: 'Technology, agency and auctions',
  farming_livestock: 'Farming and livestock',
  property_containers: 'Property and containers',
  grain_feed: 'Grain and feed',
  sme_livestock_finance: 'SME livestock finance',
  contracts_market_access: 'Contracts and market access',
  experimental: 'Experimental',
}

export function stageAllowsCapital(stage: VentureStage): boolean {
  return releaseStages.has(stage)
}

export function ubuntuProductBlock(ubuntu: { participantType: UbuntuType; product: UbuntuProduct } | null): string | null {
  if (!ubuntu) return null
  if (ubuntu.product === 'working_capital' && ubuntu.participantType !== 'D') {
    return ubuntu.participantType === 'A'
      ? 'Type A cannot use the Type D working-capital product.'
      : 'The working-capital product is only for Type D.'
  }
  if (ubuntu.product === 'camp_cattle' && ubuntu.participantType === 'D') {
    return 'Type D stays on the working-capital product. It is not priced as the camp product.'
  }
  return null
}

export function policyPayload(product: UbuntuProduct): string {
  return payloadKey({ action: 'sme_risk_policy', moduleId: '008', product, topics: policyTopics.map((topic) => topic.id) })
}

export function policyBlock(policy: PolicyRecord | null, product: UbuntuProduct): string | null {
  if (!policy || policy.status !== 'resolved') return 'SME risk policy is unresolved. Capital release is prohibited.'
  if (policy.product !== product) return 'The risk policy is for a different product.'
  if (policy.draftAssignsLoss) return 'A draft that assigns losses to the SME does not resolve the risk policy.'
  if (policy.evidenceGrade !== 'signed_legal_document') return 'The risk policy needs a signed legal document.'
  const missing = policyTopics.filter((topic) => !policy.topics.includes(topic.id))
  if (missing.length) return 'The risk policy is missing a required decision.'
  if (!unanimous(policy.votes, policyPayload(product))) return 'The risk policy needs a formal approval from ITS, CJ du Plessis and DJ Eksteen.'
  return null
}

export function openVenture(input: {
  id: string
  company: string
  name: string
  pillar: Pillar | null
  sponsor: string
  capitalCents: number | null
  clearOpportunity: boolean
}): { ok: true; venture: Venture } | { ok: false; error: string } {
  if (input.company !== 'digikraal') return { ok: false, error: wrongLaneMessage }
  const name = input.name.trim()
  const id = input.id.trim()
  if (!id || !name || name.length > 120) return { ok: false, error: 'A venture needs a name.' }
  if (!input.sponsor.trim()) return { ok: false, error: 'A venture needs a sponsor.' }
  const capitalKnown = input.capitalCents !== null && Number.isSafeInteger(input.capitalCents) && input.capitalCents > 0
  const clear = input.clearOpportunity && input.pillar !== null && capitalKnown
  return {
    ok: true,
    venture: {
      id,
      moduleId: '008',
      company: 'digikraal',
      name,
      pillar: input.pillar,
      sponsor: input.sponsor.trim(),
      stage: clear ? 'idea' : 'discovery',
      participantType: null,
      product: null,
    },
  }
}
