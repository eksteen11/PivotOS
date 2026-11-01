import { describeGroup } from './intake'
import { assessPermit } from './gates'
import { assertLivestockScope } from './scope'
import type {
  CompletenessAssessment,
  CompletenessContext,
  CompletenessStage,
  Gap,
  InformationRequest,
  LivestockGroup,
  SellerStock,
  Species,
} from './types'

const RANK: Record<CompletenessStage, number> = {
  capture: 0,
  listing: 1,
  buyer_presentation: 2,
  contract: 3,
  loading: 4,
}

const NO_PREGNANCY = new Set(['calf', 'bull', 'ox', 'weaner', 'lamb', 'wether', 'ram', 'kid', 'slaughter'])
const WOOL_BREEDS = ['merino', 'dohne', 'afrino', 'lettelle']
const FEMALE = new Set(['cow', 'heifer', 'ewe', 'doe'])

type Rule = {
  field: string
  from: CompletenessStage
  level: 'stock' | 'group'
  species: 'all' | Species[]
  required: boolean
  label: (group: LivestockGroup | null) => string
  present: (stock: SellerStock, group: LivestockGroup | null, context: CompletenessContext) => boolean
  blocked?: (stock: SellerStock, group: LivestockGroup | null) => boolean
  applies?: (group: LivestockGroup | null) => boolean
}

const RULES: Rule[] = [
  { field: 'seller', from: 'capture', level: 'stock', species: 'all', required: true, label: () => 'Seller or owner', present: (stock) => Boolean(stock.sellerName?.value) },
  { field: 'species', from: 'capture', level: 'group', species: 'all', required: true, label: (group) => group ? `Species for ${describeGroup(group)}` : 'Species', present: (_stock, group) => Boolean(group && group.species !== 'other' && group.conflicts.length === 0), blocked: (_stock, group) => Boolean(group?.conflicts.length) },
  { field: 'quantity', from: 'capture', level: 'group', species: 'all', required: true, label: (group) => group ? `Quantity for ${describeGroup(group)}` : 'Approximate quantity', present: (_stock, group) => Boolean(group?.quantity && group.quantity.value >= 1) },
  { field: 'location', from: 'capture', level: 'stock', species: 'all', required: true, label: () => 'Location', present: (stock) => Boolean(stock.location?.value) },
  { field: 'breed', from: 'listing', level: 'group', species: ['cattle', 'sheep', 'goats'], required: true, label: (group) => `Breed for ${group ? describeGroup(group) : 'the group'}`, present: (_stock, group) => Boolean(group?.breed?.value) },
  { field: 'typeSex', from: 'listing', level: 'group', species: ['cattle', 'sheep', 'goats'], required: true, label: (group) => `Type or sex for ${group ? describeGroup(group) : 'the group'}`, present: (_stock, group) => Boolean(group?.typeSex?.value) },
  { field: 'price', from: 'listing', level: 'stock', species: 'all', required: true, label: () => 'Expected price', present: (stock) => Boolean(stock.expectedPrice?.value) },
  { field: 'availability', from: 'listing', level: 'stock', species: 'all', required: true, label: () => 'Availability', present: (stock) => Boolean(stock.availability?.value) },
  { field: 'contactPermission', from: 'listing', level: 'stock', species: 'all', required: true, label: (group) => group ? 'Contact permission' : 'Contact permission', present: (stock) => stock.contactPermission?.value === 'granted', blocked: (stock) => stock.contactPermission?.value === 'refused' },
  { field: 'media', from: 'listing', level: 'stock', species: 'all', required: true, label: () => 'One walking video or clear photos of the full group', present: (stock) => stock.media.length > 0 },
  { field: 'ageOrTooth', from: 'buyer_presentation', level: 'group', species: ['cattle', 'sheep', 'goats'], required: true, label: (group) => ageLabel(group), present: (_stock, group) => Boolean(group?.ageOrTooth?.value), applies: (group) => !youngKind(group) },
  { field: 'youngAge', from: 'buyer_presentation', level: 'group', species: ['cattle', 'sheep', 'goats'], required: true, label: (group) => ageLabel(group), present: (_stock, group) => Boolean(group?.ageOrTooth?.value), applies: (group) => Boolean(youngKind(group)) },
  { field: 'weight', from: 'buyer_presentation', level: 'group', species: ['cattle', 'sheep', 'goats'], required: true, label: (group) => `Weight for ${group ? describeGroup(group) : 'the group'}`, present: (_stock, group) => Boolean(group?.weight?.value) },
  { field: 'pregnancy', from: 'buyer_presentation', level: 'group', species: ['cattle', 'sheep', 'goats'], required: true, label: (group) => `Pregnancy status for ${group ? describeGroup(group) : 'the group'}`, present: (_stock, group) => Boolean(group?.pregnancy?.value), applies: asksPregnancy },
  { field: 'sire', from: 'buyer_presentation', level: 'group', species: ['cattle', 'sheep', 'goats'], required: true, label: (group) => group?.species === 'cattle' ? `Bulls used for ${group ? describeGroup(group) : 'the group'}` : `Rams used for ${group ? describeGroup(group) : 'the group'}`, present: (_stock, group) => Boolean(group?.sire?.value), applies: (group) => Boolean(group?.typeSex && FEMALE.has(group.typeSex.value.toLowerCase())) },
  { field: 'wool', from: 'buyer_presentation', level: 'group', species: ['sheep'], required: true, label: (group) => `Wool information for ${group ? describeGroup(group) : 'the sheep'}`, present: (_stock, group) => Boolean(group?.woolOrFibre?.value), applies: woolRelevant },
  { field: 'fibre', from: 'buyer_presentation', level: 'group', species: ['goats'], required: true, label: (group) => `Hair or fibre for ${group ? describeGroup(group) : 'the goats'}`, present: (_stock, group) => Boolean(group?.woolOrFibre?.value), applies: fibreRelevant },
  { field: 'dairy', from: 'buyer_presentation', level: 'group', species: ['cattle'], required: true, label: (group) => `Dairy detail for ${group ? describeGroup(group) : 'the cattle'}`, present: (_stock, group) => Boolean(group?.dairy?.value), applies: asksDairy },
  { field: 'health', from: 'buyer_presentation', level: 'group', species: ['cattle', 'sheep', 'goats'], required: true, label: (group) => `Health wording for ${group ? describeGroup(group) : 'the group'}`, present: (_stock, group) => Boolean(group?.health?.value) },
  { field: 'vat', from: 'buyer_presentation', level: 'stock', species: 'all', required: true, label: () => 'VAT status', present: (stock) => Boolean(stock.vat?.value) },
  { field: 'transport', from: 'buyer_presentation', level: 'stock', species: 'all', required: true, label: () => 'Transport basis', present: (stock) => Boolean(stock.transport?.value) },
  { field: 'ownership', from: 'contract', level: 'stock', species: 'all', required: true, label: () => 'Who owns the livestock and who may sell', present: (stock) => Boolean(stock.ownership?.value) },
  { field: 'mandate', from: 'contract', level: 'stock', species: 'all', required: true, label: () => 'Digikraal mandate or commercial permission', present: (stock) => Boolean(stock.mandate?.value) },
  { field: 'priceBasis', from: 'contract', level: 'stock', species: 'all', required: true, label: () => 'Price basis', present: (stock) => Boolean(stock.priceBasis?.value) },
  { field: 'loadingLocation', from: 'loading', level: 'stock', species: 'all', required: true, label: () => 'Loading location', present: (stock) => Boolean(stock.loadingLocation?.value) },
  { field: 'quantityVerified', from: 'loading', level: 'group', species: 'all', required: true, label: (group) => `Quantity checked beyond the seller statement for ${group ? describeGroup(group) : 'the group'}`, present: (_stock, group) => Boolean(group?.quantity && group.quantity.verification !== 'seller_stated' && group.quantity.verification !== 'not_verified') },
  { field: 'pregnancyEvidence', from: 'loading', level: 'group', species: ['cattle', 'sheep', 'goats'], required: true, label: (group) => `Pregnancy wording still needs a document or veterinarian for ${group ? describeGroup(group) : 'the group'}`, present: (_stock, group) => group?.pregnancy?.verification === 'document_confirmed' || group?.pregnancy?.verification === 'veterinarian_confirmed', applies: (group) => Boolean(group?.pregnancy) },
  { field: 'movementPermit', from: 'loading', level: 'stock', species: 'all', required: true, label: () => 'Movement permit', present: (_stock, _group, context) => !assessPermit(context.permit, context.onDate).blocksLoading },
  { field: 'ratio', from: 'listing', level: 'group', species: ['cattle', 'sheep', 'goats'], required: false, label: () => 'Male/female ratio', present: () => false },
  { field: 'earTag', from: 'listing', level: 'group', species: ['cattle'], required: false, label: () => 'Brand or ear tag', present: () => false },
]

export function assessCompleteness(stock: SellerStock, stage: CompletenessStage, context: CompletenessContext): CompletenessAssessment {
  assertLivestockScope(stock)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(context.onDate)) throw new Error('A calendar date is required.')
  const gaps: Gap[] = []
  const optional: Gap[] = []
  const satisfied: string[] = []
  for (const rule of RULES) {
    if (RANK[stage] < RANK[rule.from]) continue
    for (const group of targets(rule, stock)) {
      if (rule.applies && !rule.applies(group)) continue
      const componentId = group?.id ?? 'stock'
      const gap = toGap(rule, group, componentId, stage)
      if (rule.blocked?.(stock, group)) {
        gaps.push({ ...gap, kind: 'blocked', label: blockedLabel(rule, group) })
        continue
      }
      if (rule.present(stock, group, context)) {
        if (rule.required) satisfied.push(`${rule.field}:${componentId}`)
        continue
      }
      if (rule.required) gaps.push(gap)
      else optional.push(gap)
    }
  }
  return { stage, ready: gaps.length === 0, gaps, optional, satisfied }
}

export function draftInformationRequest(stock: SellerStock, stage: CompletenessStage, context: CompletenessContext): InformationRequest {
  const assessment = assessCompleteness(stock, stage, context)
  if (assessment.gaps.some((gap) => gap.field === 'contactPermission' && gap.kind === 'blocked')) {
    return held('Draft held. Contact permission was refused. Nothing was sent.', assessment.gaps)
  }
  const known = knownSentence(stock)
  const questions = assessment.gaps.map((gap) => gap.label)
  const body = [
    'Draft only. This has not been sent.',
    known,
    'These details are seller statements and are not verified.',
    questions.length ? `Please confirm: ${questions.join('; ')}.` : 'Nothing further is required for this stage.',
  ].join(' ')
  return { status: 'draft', sent: false, requiresApproval: true, audience: 'seller', body, askedFields: assessment.gaps.map(gapKey) }
}

function held(body: string, gaps: Gap[]): InformationRequest {
  return { status: 'draft', sent: false, requiresApproval: true, audience: 'seller', body, askedFields: gaps.map(gapKey) }
}

function gapKey(gap: Gap) {
  return `${gap.field}:${gap.componentId}`
}

function toGap(rule: Rule, group: LivestockGroup | null, componentId: string, stage: CompletenessStage): Gap {
  return {
    field: rule.field,
    label: rule.label(group),
    stage,
    componentId,
    kind: 'missing',
    species: group?.species ?? 'stock',
  }
}

function blockedLabel(rule: Rule, group: LivestockGroup | null) {
  if (rule.field === 'species' && group?.conflicts[0]) return group.conflicts[0]
  if (rule.field === 'contactPermission') return 'Contact permission was refused. Do not list or contact them.'
  return rule.label(group)
}

function targets(rule: Rule, stock: SellerStock) {
  if (rule.level === 'stock') return [null]
  if (rule.species === 'all') return stock.groups.length ? stock.groups : [null]
  return stock.groups.filter((group) => rule.species !== 'all' && rule.species.includes(group.species))
}

function knownSentence(stock: SellerStock) {
  const animals = stock.groups.map(describeGroup).join(' and ')
  const who = stock.sellerName ? `${stock.sellerName.value} reports ` : 'The message reports '
  const place = stock.location ? ` in ${stock.location.value}` : ''
  return `${who}${animals || 'livestock without a counted group'}${place}.`
}

function asksPregnancy(group: LivestockGroup | null) {
  if (!group?.species || group.species === 'other') return false
  if (!group.typeSex) return true
  return !NO_PREGNANCY.has(group.typeSex.value.toLowerCase())
}

function youngKind(group: LivestockGroup | null) {
  const type = group?.typeSex?.value.toLowerCase()
  if (type === 'calf') return 'Calf ages and sizes'
  if (type === 'lamb') return 'Lamb ages'
  if (type === 'kid') return 'Kid ages'
  return null
}

function ageLabel(group: LivestockGroup | null) {
  return `${youngKind(group) ?? 'Age or tooth class'} for ${group ? describeGroup(group) : 'the group'}`
}

function woolRelevant(group: LivestockGroup | null) {
  const breed = group?.breed?.value.toLowerCase() ?? ''
  return WOOL_BREEDS.some((item) => breed.includes(item)) || /wool/i.test(group?.originalWording ?? '')
}

function fibreRelevant(group: LivestockGroup | null) {
  const breed = group?.breed?.value.toLowerCase() ?? ''
  return breed.includes('angora') || /fibre|fiber|hair/i.test(group?.originalWording ?? '')
}

function asksDairy(group: LivestockGroup | null) {
  return /dairy|\bmilk\b/i.test(`${group?.typeSex?.value ?? ''} ${group?.originalWording ?? ''}`)
}
