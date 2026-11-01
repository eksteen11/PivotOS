import { COMMERCIAL_STAGES, stageForProcess, type Stage } from '../../engines/stages'
import { clampText, intakeSourceLabels, type IntakeSourceLabel } from '../../intake/shared'
import { getSystem, systemFitsCompany } from '../../workspace/catalogue'

export const moduleCode = '003' as const
export const propertySegments = ['farm', 'residential', 'industrial', 'commercial'] as const
export const transactionTypes = ['sale', 'rental'] as const
export const sourceKinds = ['manual', 'whatsapp', 'phone', 'email', 'referral', 'network', 'meeting', 'property24_stated', 'propverse_stated', 'other'] as const
export const dealStages = ['lead', 'qualified', 'property_matched', 'viewing', 'negotiation', 'otp_preparation', 'otp_signed', 'northpoint_scrutiny', 'conditions_outstanding', 'transfer_instructed', 'transfer_in_progress', 'registered_or_lease_commenced', 'commission_due', 'commission_paid', 'closed'] as const
export const requirementFlow = ['new', 'needs_qualification', 'qualified', 'matching', 'properties_sent', 'viewing_requested', 'viewing_completed', 'interested', 'negotiating', 'offer_or_otp'] as const
export const requirementTerminals = ['not_ready', 'closed_won', 'closed_lost'] as const
export const requirementStages = [...requirementFlow, ...requirementTerminals] as const
export const qualificationKeys = ['intent', 'proofOfFunds', 'decisionMakers', 'propertyFit', 'ficaReadiness'] as const
export const documentCatalogue = [
  { key: 'mandate', label: 'Signed mandate' },
  { key: 'annexure_b', label: 'Annexure B' },
  { key: 'annexure_e', label: 'Annexure E' },
  { key: 'otp', label: 'OTP or lease' },
  { key: 'buyer_fica', label: 'Buyer FICA' },
  { key: 'seller_fica', label: 'Seller FICA' },
  { key: 'condition_report', label: 'Property condition report' },
] as const
export const factKeys = {
  farm: ['water', 'zoning', 'servitudes', 'infrastructure', 'land_size'],
  residential: ['bedrooms', 'bathrooms'],
  industrial: ['gross_lettable_area', 'occupation'],
  commercial: ['gross_lettable_area', 'use'],
} as const
export const matchFactKeys = {
  farm: ['water', 'zoning', 'servitudes', 'infrastructure'],
  residential: [] as const,
  industrial: ['gross_lettable_area'],
  commercial: ['use'],
} as const

export type PropertySegment = (typeof propertySegments)[number]
export type TransactionType = (typeof transactionTypes)[number]
export type SourceKind = (typeof sourceKinds)[number]
export type DealStage = (typeof dealStages)[number]
export type RequirementStage = (typeof requirementStages)[number]
export type QualificationKey = (typeof qualificationKeys)[number]
export type DocumentKey = (typeof documentCatalogue)[number]['key']
export type FactKey = (typeof factKeys)[PropertySegment][number]
export type EvidenceLevel = 0 | 1 | 2 | 3 | 4 | 5
export type Result<T> = { ok: true; value: T } | { ok: false; error: string }

export const evidenceLevelLabels: Record<EvidenceLevel, string> = {
  0: 'Not verified',
  1: 'Stated by the other party',
  2: 'Observed by the agent',
  3: 'Confirmed by a document',
  4: 'Confirmed by a professional',
  5: 'Legally registered or audited',
}
export const sourceKindLabels: Record<SourceKind, string> = {
  manual: 'Manual note',
  whatsapp: 'WhatsApp',
  phone: 'Phone',
  email: 'Email',
  referral: 'Referral',
  network: 'Network',
  meeting: 'Meeting',
  property24_stated: 'Property24, as stated',
  propverse_stated: 'Propverse, as stated',
  other: 'Other',
}
export const dealStageLabels: Record<DealStage, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  property_matched: 'Property matched',
  viewing: 'Viewing',
  negotiation: 'Negotiation',
  otp_preparation: 'OTP preparation',
  otp_signed: 'OTP signed, as recorded',
  northpoint_scrutiny: 'Northpoint scrutiny',
  conditions_outstanding: 'Conditions outstanding',
  transfer_instructed: 'Transfer instructed',
  transfer_in_progress: 'Transfer in progress',
  registered_or_lease_commenced: 'Registered or lease commenced',
  commission_due: 'Commission due',
  commission_paid: 'Commission paid',
  closed: 'Closed',
}
export const requirementStageLabels: Record<RequirementStage, string> = {
  new: 'New',
  needs_qualification: 'Needs qualification',
  qualified: 'Qualified',
  matching: 'Matching',
  properties_sent: 'Properties sent, as recorded',
  viewing_requested: 'Viewing requested',
  viewing_completed: 'Viewing completed',
  interested: 'Interested',
  negotiating: 'Negotiating',
  offer_or_otp: 'Offer or OTP',
  not_ready: 'Not ready',
  closed_won: 'Closed won',
  closed_lost: 'Closed lost',
}
export const qualificationQuestions: Record<QualificationKey, string> = {
  intent: 'Was real intent stated?',
  proofOfFunds: 'Was proof of funds or financing stated?',
  decisionMakers: 'Were the decision-makers stated?',
  propertyFit: 'Was the property fit stated?',
  ficaReadiness: 'Was FICA readiness stated? This is not FICA clearance.',
}
export const factLabels: Record<FactKey, string> = {
  water: 'Water rights',
  zoning: 'Zoning',
  servitudes: 'Servitudes',
  infrastructure: 'Infrastructure',
  land_size: 'Land size',
  bedrooms: 'Bedrooms',
  bathrooms: 'Bathrooms',
  gross_lettable_area: 'Gross lettable area',
  occupation: 'Occupation',
  use: 'Use',
}
export const portalStatus = [
  { id: 'property24', status: 'not_connected' as const, detail: 'No feed, API or write access is configured. A typed reference is not publication.' },
  { id: 'propverse', status: 'not_connected' as const, detail: 'No API, export or webhook is configured.' },
]

const blockedPerson = /^(ai|a\.i\.|system|pivot|pivot os|automatic|automation|model|agent|bot|chatgpt|gpt|openai|claude|cursor)$/i
const bannedKeys = new Set(['commissionAmount', 'commissionPercent', 'commissionShare', 'vatAmount', 'legalApproval', 'legalComplete', 'legallyComplete', 'published', 'portalConnected', 'sent', 'messageSent', 'approvedByHeadOffice'])
const lensPhrase: Record<DealStage, string> = {
  lead: 'lead enquiry',
  qualified: 'listing qualify',
  property_matched: 'match',
  viewing: 'view',
  negotiation: 'negotiate offer',
  otp_preparation: 'otp document',
  otp_signed: 'otp document',
  northpoint_scrutiny: 'otp document',
  conditions_outstanding: 'document conditions',
  transfer_instructed: 'transfer',
  transfer_in_progress: 'transfer',
  registered_or_lease_commenced: 'transfer sold',
  commission_due: 'close',
  commission_paid: 'paid',
  closed: 'close',
}

export type Evidence = { level: EvidenceLevel; statement: string; sourceRef: string; recordedBy: string; recordedAt: string; channel: 'internal' | 'external_head_office' }
export type SourceRecord = { kind: SourceKind; note: string; recordedBy: string; recordedAt: string; connected: false }
export type StatedAmount = { state: 'unknown' } | { state: 'stated'; amount: number; currency: 'ZAR'; evidence: Evidence }
export type MandateEvent = { at: string; kind: 'proposed' | 'terms' | 'submitted' | 'accepted' | 'returned' | 'signature'; actor: string; note: string }
export type Mandate = { status: 'missing' | 'proposed' | 'terms_recorded' | 'awaiting_review' | 'reviewed' | 'signature_recorded'; type: 'sole' | 'open' | 'joint' | null; commissionTerms: string | null; expiry: string | null; preparedBy: string | null; reviewedBy: string | null; events: MandateEvent[]; signatureEvidence: Evidence | null; legalDetermination: 'none'; headOffice: 'external_and_not_replaceable' }
export type FactRecord = { key: FactKey; statement: string; evidence: Evidence }
export type DocumentReference = { reference: string; evidence: Evidence }
export type DocumentSlot = { key: DocumentKey; label: string; clearance: 'not_determined'; references: DocumentReference[] }
export type StageMove = { at: string; from: string; to: string; skipped: string[]; actor: string; reviewer: string; reason: string; evidence: Evidence; requirementId: string | null }
export type PropertyRecord = {
  id: string
  label: string
  segment: PropertySegment
  transaction: TransactionType
  partyLabel: string
  partyRole: 'seller' | 'landlord'
  locationHistory: { value: string; evidence: Evidence }[]
  asking: StatedAmount
  askingHistory: Extract<StatedAmount, { state: 'stated' }>[]
  confidential: boolean
  source: SourceRecord
  mandate: Mandate
  facts: FactRecord[]
  documents: DocumentSlot[]
  stage: DealStage
  history: StageMove[]
  publication: { property24: 'not_connected'; propverse: 'not_connected'; manualReference: string | null }
  attorney: { current: string | null; history: { value: string; at: string }[] }
  scrutiny: { state: 'not_sent' | 'sent' | 'response_recorded'; responseIsApproval: false }
  legalDetermination: 'none'
  visibility: 'internal'
  capturedAt: string
}
export type QualificationState = { state: 'unknown' } | { state: 'stated'; evidence: Evidence }
export type RequirementRecord = {
  id: string
  partyLabel: string
  role: 'buyer' | 'tenant' | 'investor'
  segment: PropertySegment
  transaction: TransactionType
  locations: { value: string; evidence: Evidence }[]
  budgetMin: StatedAmount
  budgetMax: StatedAmount
  timeframe: string | null
  mustHaves: string | null
  exclusions: string | null
  textHistory: { field: 'timeframe' | 'mustHaves' | 'exclusions'; value: string; evidence: Evidence }[]
  qualification: Record<QualificationKey, QualificationState>
  consent: 'unknown' | 'stated_yes' | 'stated_no'
  consentHistory: { value: 'stated_yes' | 'stated_no'; evidence: Evidence }[]
  statements: FactRecord[]
  source: SourceRecord
  stage: RequirementStage
  history: StageMove[]
  visibility: 'internal'
  outbound: 'not_enabled'
  sentByPivot: false
  capturedAt: string
}
export type NorthpointState = { version: 1; module: '003'; company: 'northpoint'; name: string; visibility: 'internal'; properties: PropertyRecord[]; requirements: RequirementRecord[] }
export type MatchReport = { propertyId: string; requirementId: string; withheld: boolean; hardMatches: string[]; compromises: string[]; hardMismatches: string[]; missing: string[]; aligned: string | null; recommendedAction: string; clientMessage: null; sent: false; published: false }

export function ok<T>(value: T): Result<T> { return { ok: true, value } }
export function fail<T>(error: string): Result<T> { return { ok: false, error } }

export function moduleIdentity() {
  const system = getSystem(moduleCode)
  if (!system || system.company !== 'northpoint' || !systemFitsCompany(system, 'northpoint')) throw new Error('Catalogue 003 is not available as Northpoint Realty.')
  return { module: moduleCode, company: 'northpoint' as const, name: system.name, summary: system.summary }
}

export function commercialStage(stage: DealStage): Stage {
  const key = stageForProcess(lensPhrase[stage], moduleCode, 'commercial')
  const found = COMMERCIAL_STAGES.find((item) => item.key === key)
  if (!found) throw new Error('Shared commercial stages no longer match Northpoint.')
  return found
}

export function intakeSourceFor(kind: SourceKind): IntakeSourceLabel | null {
  const label = kind === 'manual' ? 'Manual' : kind === 'whatsapp' || kind === 'phone' ? 'WhatsApp/text/voice/call' : kind === 'email' ? 'Email' : null
  return label && intakeSourceLabels.includes(label) ? label : null
}

export function commissionPosition(statedTerms: string | null) {
  return { status: 'not_calculated' as const, statedTerms, reason: 'No commission split, VAT treatment or share is configured. Stated words are kept. Nothing is calculated.' }
}

export function bannedField(value: unknown, depth = 0): string | null {
  if (depth > 10 || !value || typeof value !== 'object') return null
  for (const key of Object.keys(value as object)) {
    if (bannedKeys.has(key)) return key
    const nested = bannedField((value as Record<string, unknown>)[key], depth + 1)
    if (nested) return nested
  }
  return null
}

export function requiredText(value: unknown, limit: number, label: string): Result<string> {
  if (typeof value !== 'string') return fail(`${label} is required.`)
  if (value.trim().length > limit) return fail(`${label} is too long.`)
  const text = clampText(value, limit)
  if (!text) return fail(`${label} is required.`)
  return ok(text)
}

export function personName(value: unknown, label: string): Result<string> {
  const name = requiredText(value, 80, label)
  if (!name.ok) return name
  if (blockedPerson.test(name.value)) return fail(`${label} must be a person. Pivot cannot review or approve its own move.`)
  return name
}

export function timestamp(value: unknown): Result<string> {
  const text = requiredText(value, 40, 'Date and time')
  if (!text.ok) return text
  const parsed = Date.parse(text.value)
  if (!Number.isFinite(parsed)) return fail('A real date and time is required.')
  return ok(new Date(parsed).toISOString())
}

export function calendarDate(value: unknown): Result<string> {
  const text = requiredText(value, 10, 'Expiry date')
  if (!text.ok) return text
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text.value)) return fail('Use the expiry date you were given, as YYYY-MM-DD.')
  const [year, month, day] = text.value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return fail('That expiry date is not a real calendar date.')
  return ok(text.value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function extraKey(row: Record<string, unknown>, keys: readonly string[]) {
  return Object.keys(row).find((key) => !keys.includes(key)) ?? null
}

export function parseEvidence(value: unknown, minLevel = 0): Result<Evidence> {
  if (!isRecord(value)) return fail('Evidence is required. A blank field is not evidence.')
  const extra = extraKey(value, ['level', 'statement', 'sourceRef', 'recordedBy', 'recordedAt', 'channel'])
  if (extra) return fail(`Unexpected evidence field “${extra}”.`)
  const level = value.level
  if (typeof level !== 'number' || !Number.isInteger(level) || level < 0 || level > 5) return fail('Evidence level must be a whole number from 0 to 5.')
  if (level < minLevel) return fail(`This needs evidence at level ${minLevel} or higher. Level ${level} is only “${evidenceLevelLabels[level as EvidenceLevel]}”.`)
  const statement = requiredText(value.statement, 2000, 'Evidence')
  if (!statement.ok) return statement
  const sourceRef = requiredText(value.sourceRef, 300, 'Evidence source')
  if (!sourceRef.ok) return sourceRef
  const recordedBy = personName(value.recordedBy, 'Evidence recorder')
  if (!recordedBy.ok) return recordedBy
  const recordedAt = timestamp(value.recordedAt)
  if (!recordedAt.ok) return recordedAt
  const channel = value.channel === undefined || value.channel === 'internal' ? 'internal' : value.channel === 'external_head_office' ? 'external_head_office' : null
  if (!channel) return fail('Evidence channel must be internal or external head office.')
  return ok({ level: level as EvidenceLevel, statement: statement.value, sourceRef: sourceRef.value, recordedBy: recordedBy.value, recordedAt: recordedAt.value, channel })
}

export function amountFromInput(input: unknown, evidence: unknown): Result<StatedAmount> {
  if (input === undefined || input === null || (typeof input === 'string' && input.trim() === '')) return ok({ state: 'unknown' })
  if (typeof input !== 'string' && typeof input !== 'number') return fail('An amount must be a stated figure above zero. Unknown stays unknown and is not stored as zero.')
  const text = String(input).trim()
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return fail('Use a stated amount above zero, with at most two decimal places. Leave it blank when it is unknown.')
  const amount = Number(text)
  if (!Number.isFinite(amount) || amount <= 0) return fail('An amount must be a stated figure above zero. Unknown stays unknown and is not stored as zero.')
  const parsed = parseEvidence(evidence, 1)
  if (!parsed.ok) return parsed
  return ok({ state: 'stated', amount, currency: 'ZAR', evidence: parsed.value })
}

export function emptyDocuments(): DocumentSlot[] {
  return documentCatalogue.map((item) => ({ key: item.key, label: item.label, clearance: 'not_determined', references: [] }))
}

export function emptyQualification(): Record<QualificationKey, QualificationState> {
  return { intent: { state: 'unknown' }, proofOfFunds: { state: 'unknown' }, decisionMakers: { state: 'unknown' }, propertyFit: { state: 'unknown' }, ficaReadiness: { state: 'unknown' } }
}

export function emptyMandate(): Mandate {
  return { status: 'missing', type: null, commissionTerms: null, expiry: null, preparedBy: null, reviewedBy: null, events: [], signatureEvidence: null, legalDetermination: 'none', headOffice: 'external_and_not_replaceable' }
}

export function latestLocation(property: PropertyRecord) {
  return property.locationHistory.at(-1)?.value ?? null
}

export function latestFact(records: FactRecord[], key: string) {
  return [...records].reverse().find((item) => item.key === key) ?? null
}

export function stagesBetween(from: DealStage, to: DealStage) {
  const start = dealStages.indexOf(from)
  if (to === 'closed') return dealStages.slice(start + 1, dealStages.length - 1).filter((stage) => stage !== 'commission_due' && stage !== 'commission_paid')
  const end = dealStages.indexOf(to)
  if (end <= start) return []
  return dealStages.slice(start + 1, end)
}

export function nextDealStages(from: DealStage): DealStage[] {
  if (from === 'closed') return []
  return dealStages.slice(dealStages.indexOf(from) + 1).filter((stage) => stage !== 'commission_due' && stage !== 'commission_paid')
}

export function requirementSkipped(from: RequirementStage, to: RequirementStage) {
  if ((requirementTerminals as readonly string[]).includes(to)) {
    const start = (requirementFlow as readonly string[]).indexOf(from)
    return start < 0 ? [] : [...requirementFlow.slice(start + 1)]
  }
  const start = (requirementFlow as readonly string[]).indexOf(from)
  const end = (requirementFlow as readonly string[]).indexOf(to)
  if (start < 0 || end <= start) return []
  return [...requirementFlow.slice(start + 1, end)]
}

export function nextRequirementStages(from: RequirementStage): RequirementStage[] {
  if ((requirementTerminals as readonly string[]).includes(from)) return []
  const start = (requirementFlow as readonly string[]).indexOf(from)
  return [...requirementFlow.slice(start + 1), ...requirementTerminals]
}

export function unknownAsking(property: PropertyRecord) {
  return property.asking.state === 'unknown' ? ['Asking price'] : []
}

export function unknownMatchFacts(segment: PropertySegment, facts: FactRecord[]) {
  return matchFactKeys[segment].filter((key) => !latestFact(facts, key)).map((key) => factLabels[key])
}
