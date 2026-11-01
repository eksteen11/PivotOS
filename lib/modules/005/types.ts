/** Digikraal livestock agency records. These types stay inside Pivot OS. */

export const MODULE_ID = '005' as const
export const MODULE_COMPANY = 'digikraal' as const

export type Species = 'cattle' | 'sheep' | 'goats' | 'other'

export type VerificationLevel =
  | 'seller_stated'
  | 'agent_observed'
  | 'veterinarian_confirmed'
  | 'document_confirmed'
  | 'not_verified'

export type CompletenessStage = 'capture' | 'listing' | 'buyer_presentation' | 'contract' | 'loading'

export type Fact<T> = {
  value: T
  originalWording: string
  source: string
  suppliedBy: string
  capturedAt: string
  verification: VerificationLevel
  confidence: 'stated' | 'confirmed'
  lastConfirmedAt?: string
}

/** A buyer requirement is what the buyer asked for. It is not proof about an animal. */
export type RequirementFact<T> = {
  value: T
  originalWording: string
  source: string
  suppliedBy: string
  capturedAt: string
  confirmed: false
}

export type LivestockGroup = {
  id: string
  species: Species
  originalWording: string
  conflicts: string[]
  breed?: Fact<string>
  typeSex?: Fact<string>
  quantity?: Fact<number>
  ageOrTooth?: Fact<string>
  weight?: Fact<string>
  pregnancy?: Fact<string>
  sire?: Fact<string>
  woolOrFibre?: Fact<string>
  health?: Fact<string>
  dairy?: Fact<string>
  pairing?: Fact<'pairs'>
}

export type MediaNote = {
  id: string
  kind: 'photo' | 'video' | 'voice' | 'certificate' | 'other'
  source: string
  capturedAt: string
  note: string
}

export type SellerStock = {
  id: string
  entity: typeof MODULE_COMPANY
  capability: typeof MODULE_ID
  originalText: string
  source: string
  capturedAt: string
  sample: boolean
  offMarket: true
  sellerName?: Fact<string>
  location?: Fact<string>
  province?: Fact<string>
  expectedPrice?: Fact<string>
  vat?: Fact<string>
  availability?: Fact<string>
  contactPermission?: Fact<'granted' | 'refused' | 'unknown'>
  ownership?: Fact<string>
  mandate?: Fact<string>
  transport?: Fact<string>
  priceBasis?: Fact<string>
  loadingLocation?: Fact<string>
  groups: LivestockGroup[]
  media: MediaNote[]
  unassignedNotes: string[]
}

export type BuyerLifecycle =
  | 'new'
  | 'needs_qualification'
  | 'qualified'
  | 'searching_stock'
  | 'sourcing'
  | 'matches_proposed'
  | 'buyer_reviewing'
  | 'viewing_requested'
  | 'negotiating'
  | 'contracting'
  | 'loading'
  | 'closed_won'
  | 'closed_lost'
  | 'paused'
  | 'expired'

export type BuyerRequirement = {
  id: string
  entity: typeof MODULE_COMPANY
  capability: typeof MODULE_ID
  originalText: string
  source: string
  capturedAt: string
  sample: boolean
  confidential: true
  status: 'new'
  proposedLifecycle: 'needs_qualification' | 'searching_stock'
  buyerName?: RequirementFact<string>
  species?: RequirementFact<Species>
  breed?: RequirementFact<string>
  acceptableBreeds: string[]
  typeSex?: RequirementFact<string>
  quantityMin?: RequirementFact<number>
  quantityMax?: RequirementFact<number>
  quantityWording?: string
  quantityUnusable?: boolean
  ageOrTooth?: RequirementFact<string>
  weight?: RequirementFact<string>
  pregnancyRequired?: RequirementFact<boolean>
  healthRequired?: RequirementFact<string>
  destination?: RequirementFact<string>
  budget?: RequirementFact<string>
  requiredBy?: RequirementFact<string>
  paymentReady?: RequirementFact<'unknown' | 'stated'>
  exclusions: string[]
}

export type GroupInput = {
  species: Species
  originalWording: string
  breed?: string
  typeSex?: string
  quantity?: number
  ageOrTooth?: string
  weight?: string
  pregnancy?: string
  sire?: string
  woolOrFibre?: string
  health?: string
  dairy?: string
  pairing?: 'pairs'
}

export type SellerInput = {
  originalText: string
  capturedAt: string
  source?: string
  sample?: boolean
  entity?: string
  capability?: string
  sellerName?: string
  location?: string
  province?: string
  expectedPrice?: string
  vat?: string
  availability?: string
  contactPermission?: 'granted' | 'refused' | 'unknown'
  ownership?: string
  mandate?: string
  transport?: string
  priceBasis?: string
  loadingLocation?: string
  media?: MediaNote[]
  groups: GroupInput[]
}

export type BuyerInput = {
  originalText: string
  capturedAt: string
  source?: string
  sample?: boolean
  entity?: string
  capability?: string
  buyerName?: string
  species?: Species
  breed?: string
  acceptableBreeds?: string[]
  typeSex?: string
  quantityMin?: number
  quantityMax?: number
  quantityWording?: string
  ageOrTooth?: string
  weight?: string
  pregnancyRequired?: boolean
  pregnancyWording?: string
  healthRequired?: string
  destination?: string
  budget?: string
  requiredBy?: string
  paymentReady?: 'unknown' | 'stated'
  exclusions?: string[]
}

export type MovementPermit = {
  exactWording: string
  issuer?: string
  issuedOn?: string
  expiresOn?: string
  documentConfirmed: boolean
}

export type CompletenessContext = {
  onDate: string
  permit?: MovementPermit
}

export type Gap = {
  field: string
  label: string
  stage: CompletenessStage
  componentId: string
  kind: 'missing' | 'blocked'
  species: Species | 'stock'
}

export type CompletenessAssessment = {
  stage: CompletenessStage
  ready: boolean
  gaps: Gap[]
  optional: Gap[]
  satisfied: string[]
}

export type DraftMessage = {
  status: 'draft'
  sent: false
  requiresApproval: true
  audience: 'seller' | 'buyer'
  body: string
}

export type InformationRequest = DraftMessage & {
  audience: 'seller'
  askedFields: string[]
}

export type MatchExplanation = {
  score: number
  readyToReview: boolean
  hardMatches: string[]
  compromises: string[]
  hardMismatches: string[]
  missingInformation: string[]
  assumptions: string[]
  separations: string[]
  distanceAndTransportImpact: string
  estimatedDeliveredCost: null
  estimatedMargin: null
  risks: string[]
  recommendedAction: string
  draftMessages: { buyer: DraftMessage; seller: DraftMessage }
  componentId: string
  internalSummary: string
  buyerFacingSummary: string
  outreachStarted: false
  sourcingOpened: false
}

export type GateId =
  | 'outgoing_message'
  | 'listing_publication'
  | 'health_or_pregnancy_confirmation'
  | 'binding_price'
  | 'calendar_write'
  | 'confidential_share'
  | 'transport_booking'
  | 'loading_release'

export type Approval = {
  gate: GateId
  payload: string
  approver: string
  approvedAt: string
}

export type PermitAssessment = {
  state: 'missing' | 'expired' | 'unverified' | 'usable'
  blocksLoading: boolean
  detail: string
}

export type StageEvent = {
  from: string | null
  to: string
  at: string
  actor: string
  reason: string
  evidence: string
}

export type ViewingProposal = {
  status: 'proposed'
  startLabel: string
  timezone: 'Africa/Johannesburg'
  location: null
  duration: null
  travelTime: null
  calendarWritten: false
  sample: boolean
}
