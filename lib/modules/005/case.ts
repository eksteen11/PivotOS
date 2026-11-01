import { assessCompleteness, draftInformationRequest } from './completeness'
import { explainMatch } from './matching'
import { assessPermit } from './gates'
import { proposeBuyerFromText, proposeSellerFromText } from './intake'
import { assertDay } from './scope'
import type { BuyerRequirement, CompletenessContext, CompletenessStage, MovementPermit, SellerStock, StageEvent, ViewingProposal } from './types'

export const DEAL_STAGES = [
  { key: 'find_out_information', label: 'Find out information' },
  { key: 'listing_preparation', label: 'Listing preparation' },
  { key: 'find_a_buyer', label: 'Find a buyer' },
  { key: 'source_livestock', label: 'Source livestock for buyer' },
  { key: 'buyer_interested', label: 'Buyer interested' },
  { key: 'contract_viewing_negotiation', label: 'Contract, viewing or negotiation' },
  { key: 'close_load_and_pay', label: 'Close deal, load and pay' },
  { key: 'finance_admin', label: 'Done, finance and admin' },
  { key: 'closed', label: 'Closed' },
  { key: 'cancelled', label: 'Cancelled, lost or paused' },
] as const

export const SAMPLE_SELLER_TEXT = 'Seller: CP van der Merwe; town: Ceres. Seller reports 50 Angus cows and 30 calves.'
export const SAMPLE_BUYER_TEXT = [
  'Buyer: Sample Buyer',
  'Species: cattle',
  'Breed: Angus',
  'Type: cows',
  'Quantity: 40-60',
  'Pregnancy: required',
  'Budget: R15000 per head',
  'Destination: Worcester',
].join('\n')
export const SAMPLE_ON_DATE = '2026-10-25'
export const SAMPLE_CAPTURED_AT = '2026-10-20T12:00:00.000Z'

export const sampleViewing: ViewingProposal = {
  status: 'proposed',
  startLabel: '21 Oct 2026, 08:00',
  timezone: 'Africa/Johannesburg',
  location: null,
  duration: null,
  travelTime: null,
  calendarWritten: false,
  sample: true,
}

const AGENT = /^(ai|agent|system|pivot)$/i

export function appendStage(history: readonly StageEvent[], event: StageEvent) {
  const actor = event.actor.trim()
  if (!actor || AGENT.test(actor)) throw new Error('A person must record a stage change.')
  if (!event.reason.trim() || !event.evidence.trim()) throw new Error('A stage change needs a reason and evidence.')
  if (!DEAL_STAGES.some((stage) => stage.key === event.to)) throw new Error('Unknown livestock stage.')
  const last = history[history.length - 1]
  if (last && last.from === event.from && last.to === event.to && last.at === event.at && last.reason === event.reason && last.actor === actor) {
    return [...history]
  }
  const expectedFrom = last ? last.to : null
  if (event.from !== expectedFrom) throw new Error('Stage history is append-only.')
  return [...history, { ...event, actor }]
}

export function recommendedDealStage(stock: SellerStock, context: CompletenessContext) {
  const capture = assessCompleteness(stock, 'capture', context)
  const listing = assessCompleteness(stock, 'listing', context)
  if (!capture.ready || !listing.ready) {
    return {
      key: 'find_out_information' as const,
      label: 'Find out information',
      reason: capture.ready
        ? 'Capture has a seller, place and animals. Listing facts are still open, so the pipeline stays on find out information.'
        : 'The seller record is still missing capture facts. Nothing was moved forward.',
    }
  }
  return {
    key: 'listing_preparation' as const,
    label: 'Listing preparation',
    reason: 'Listing facts are present. A person still reviews the draft. Nothing was published.',
  }
}

export type LivestockCase = {
  id: string
  entity: 'digikraal'
  capability: '005'
  sample: boolean
  seller: SellerStock
  buyer?: BuyerRequirement
  viewing?: ViewingProposal
  permit?: MovementPermit
  sent: false
  published: false
  calendarWritten: false
}

export function buildCase(input: {
  sellerText?: string
  seller?: SellerStock
  buyerText?: string
  buyer?: BuyerRequirement
  capturedAt: string
  onDate: string
  sample?: boolean
  viewing?: ViewingProposal
  permit?: MovementPermit
}): LivestockCase {
  assertDay(input.onDate)
  const seller = input.seller ?? proposeSellerFromText(input.sellerText ?? '', input.capturedAt, { sample: input.sample })
  const buyer = input.buyer ?? (input.buyerText ? proposeBuyerFromText(input.buyerText, input.capturedAt, { sample: input.sample }) : undefined)
  return {
    id: seller.id,
    entity: 'digikraal',
    capability: '005',
    sample: input.sample === true || seller.sample,
    seller,
    buyer,
    viewing: input.viewing,
    permit: input.permit,
    sent: false,
    published: false,
    calendarWritten: false,
  }
}

export function sampleCase() {
  return buildCase({
    sellerText: SAMPLE_SELLER_TEXT,
    buyerText: SAMPLE_BUYER_TEXT,
    capturedAt: SAMPLE_CAPTURED_AT,
    onDate: SAMPLE_ON_DATE,
    sample: true,
    viewing: sampleViewing,
  })
}

export type DeskFact = { label: string; value: string; badge: string }
export type DeskModel = {
  audience: 'founder'
  sample: boolean
  title: string
  subtitle: string
  nextLabel: string
  nextDetail: string
  sellerLine: string
  sellerBadge: string
  groups: { heading: string; lines: DeskFact[] }[]
  heldBack: string[]
  missing: string[]
  requestBody: string
  requestSent: false
  matchScore: string
  matchLines: string[]
  separations: string[]
  buyerDraft: string
  sellerMatchDraft: string
  permitDetail: string
  gates: { label: string; detail: string }[]
  viewingDetail: string
  pipeline: string
  privacy: string
}

const GATES = [
  'Outgoing message',
  'Listing publication',
  'Health or pregnancy confirmation',
  'Binding price',
  'Calendar write',
  'Sharing seller or buyer identity',
  'Transport booking',
  'Loading release',
]

export function buildDeskModel(livestockCase: LivestockCase, onDate: string): DeskModel {
  const context = { onDate, permit: livestockCase.permit }
  const capture = assessCompleteness(livestockCase.seller, 'capture', context)
  const stage: CompletenessStage = capture.ready ? 'listing' : 'capture'
  const request = draftInformationRequest(livestockCase.seller, stage, context)
  const stageName = recommendedDealStage(livestockCase.seller, context)
  const match = livestockCase.buyer ? explainMatch(livestockCase.seller, livestockCase.buyer) : undefined
  const permit = assessPermit(livestockCase.permit, onDate)
  return {
    audience: 'founder',
    sample: livestockCase.sample,
    title: 'Livestock agency',
    subtitle: 'Digikraal · inside Pivot OS',
    nextLabel: request.askedFields.length ? 'Review the draft request' : 'Review the listing facts',
    nextDetail: 'Drikus checks this draft. Saving an approval does not send it, publish it, or write a calendar event.',
    sellerLine: livestockCase.seller.sellerName
      ? `${livestockCase.seller.sellerName.value}${livestockCase.seller.location ? `, ${livestockCase.seller.location.value}` : ''}`
      : 'Seller name was not supplied.',
    sellerBadge: livestockCase.seller.sellerName ? 'Seller stated · not verified' : 'Not supplied',
    groups: livestockCase.seller.groups.map((group) => ({
      heading: group.originalWording,
      lines: [
        { label: 'Species', value: group.conflicts.length ? 'Not settled' : group.species, badge: group.conflicts.length ? 'Not chosen' : 'Classified from the words · not inspected' },
        ...factLine('Breed', group.breed),
        ...factLine('Type', group.typeSex),
        ...factLine('Quantity', group.quantity),
        ...factLine('Pregnancy', group.pregnancy),
        ...factLine('Age', group.ageOrTooth),
        ...factLine('Weight', group.weight),
        ...factLine('Health', group.health),
      ],
    })),
    heldBack: livestockCase.seller.unassignedNotes,
    missing: assessCompleteness(livestockCase.seller, stage, context).gaps.map((gap) => gap.label),
    requestBody: request.body,
    requestSent: false,
    matchScore: match ? `${match.score}% explained match` : 'No buyer is attached.',
    matchLines: match ? [...match.hardMatches, ...match.compromises, ...match.hardMismatches, ...match.missingInformation, match.recommendedAction] : ['Nothing was matched.'],
    separations: match?.separations ?? [],
    buyerDraft: match?.draftMessages.buyer.body ?? 'No buyer draft.',
    sellerMatchDraft: match?.draftMessages.seller.body ?? 'No seller draft.',
    permitDetail: permit.detail,
    gates: GATES.map((label) => ({ label, detail: 'Blocked until Drikus approves it in the shared approval record.' })),
    viewingDetail: livestockCase.viewing
      ? `${livestockCase.viewing.startLabel}, ${livestockCase.viewing.timezone}. Place, duration and travel time were not supplied. Nothing was written to a calendar.`
      : 'No viewing is attached.',
    pipeline: `${stageName.label}. ${stageName.reason}`,
    privacy: 'These records stay with Digikraal. Accounting stays in the ledger. The bank stays at the bank. The public website stays the listing record.',
  }
}

export function sampleDeskModel() {
  return buildDeskModel(sampleCase(), SAMPLE_ON_DATE)
}

function factLine(label: string, fact?: { value: string | number; verification: string }) {
  if (!fact) return []
  const badge = fact.verification === 'seller_stated' ? 'Seller stated · not verified'
    : fact.verification === 'agent_observed' ? 'Agent observed'
      : fact.verification === 'veterinarian_confirmed' ? 'Veterinarian confirmed'
        : fact.verification === 'document_confirmed' ? 'Document confirmed'
          : 'Not verified'
  return [{ label, value: String(fact.value), badge }]
}
