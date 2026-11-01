import { COMMERCIAL_STAGES, type Stage } from '@/lib/engines/stages'
import type { CostComponent, Enquiry } from './contract'
import { qualifyGaps } from './enquiry'
import { lineCents } from './money'
import { deliveredMargin, emptyCostStack, withCost, type DeliveredMargin } from './pricing'
import { formatQuantity, sameOrConvertible } from './units'

export type MatchProposal = {
  moduleId: '004'
  company: 'farm-feed'
  stage: Stage
  viable: boolean
  matchTypes: string[]
  hardMatches: string[]
  compromises: string[]
  hardMismatches: string[]
  missing: string[]
  assumptions: string[]
  allocatedMilli: number | null
  quantityLabel: string
  margin: DeliveredMargin
  internalParties: { supply: string; demand: string }
  draftMessage: string
  recommendedAction: string
  execution: 'not_executed'
  sends: false
  identityReleased: false
}

export function proposeMatch(supply: Enquiry, demand: Enquiry, options: {
  transportCents?: number | null
  transportLowCents?: number | null
  transportHighCents?: number | null
  waivedCosts?: CostComponent['key'][]
  minimumMarginBps?: number | null
} = {}): MatchProposal {
  if (supply.side !== 'supply' || demand.side !== 'demand') throw new Error('A match needs one supply enquiry and one demand enquiry.')
  if (supply.company !== 'farm-feed' || demand.company !== 'farm-feed') throw new Error('Farm Feed enquiries stay inside Farm Feed.')
  const missing = [...qualifyGaps(supply).map((gap) => `Supply: ${gap}`), ...qualifyGaps(demand).map((gap) => `Demand: ${gap}`)]
  const hardMatches: string[] = []
  const compromises: string[] = []
  const hardMismatches: string[] = []
  const assumptions: string[] = ['Kilograms and tonnes use 1 tonne = 1 000 kg. The workbook factor cell is not used for this conversion.']
  const matchTypes: string[] = []

  const sameWording = Boolean(supply.productOriginal && supply.productOriginal.toLowerCase() === demand.productOriginal.toLowerCase())
  const productMatched = Boolean(supply.productKey && supply.productKey === demand.productKey) || (sameWording && !supply.productKey)
  const substitute = Boolean(supply.productKey && demand.acceptsSubstitutes.includes(supply.productKey))
  if (productMatched) {
    hardMatches.push(supply.productKey ? `Product matches: ${supply.productOriginal}.` : 'Original product wording matches. It is not in the Farm Feed list yet.')
    matchTypes.push('exact_product')
  } else if (substitute) {
    compromises.push(`Demand accepts ${supply.productOriginal} as a substitute.`)
    matchTypes.push('product_substitute')
  } else hardMismatches.push('Product does not match and is not an accepted substitute.')

  if (supply.gradeKey && (supply.gradeKey === demand.gradeKey || demand.acceptedGrades.includes(supply.gradeKey))) {
    hardMatches.push('Grade matches the demand.')
  } else if (supply.gradeOriginal && demand.gradeOriginal && supply.gradeOriginal.toLowerCase() === demand.gradeOriginal.toLowerCase()) {
    hardMatches.push('Grade text matches. It is not yet a listed grade.')
  } else if (supply.gradeOriginal && demand.acceptedGrades.map((grade) => grade.toLowerCase()).includes(supply.gradeOriginal.toLowerCase())) {
    compromises.push('Grade is an accepted compromise.')
  } else if (supply.gradeOriginal || demand.gradeOriginal) hardMismatches.push('Grade does not match.')

  if (supply.qualityLevel !== null && demand.qualityMinimum !== null && supply.qualityLevel < demand.qualityMinimum) {
    hardMismatches.push('Quality evidence is below the level the buyer requires.')
  } else if (supply.qualityLevel === 0) compromises.push('Quality is not verified.')
  else if (supply.qualityLevel !== null && supply.qualityLevel < 3) compromises.push('Quality is stated or observed, not document-confirmed.')
  else if (supply.qualityLevel !== null && supply.qualityLevel >= 3) hardMatches.push('Quality evidence meets a document or professional level.')

  let allocatedMilli: number | null = null
  if (supply.quantity && demand.quantity) {
    const compared = sameOrConvertible(supply.quantity, demand.quantity, supply.kgPerBaleMilli, demand.kgPerBaleMilli)
    if ('error' in compared) hardMismatches.push(compared.error)
    else if (compared.gramsLeft <= 0 || compared.gramsRight <= 0) hardMismatches.push('Quantity must be greater than zero.')
    else if (compared.gramsLeft < compared.gramsRight) {
      compromises.push(`Supply covers part of the demand: ${formatQuantity(supply.quantity)} of ${formatQuantity(demand.quantity)}.`)
      matchTypes.push('partial_quantity')
      allocatedMilli = supply.quantity.unit === demand.quantity.unit ? supply.quantity.milli : null
      if (allocatedMilli === null) assumptions.push('Partial quantity is in different units. The allocated amount stays in grams until a unit is chosen for the price.')
    } else {
      hardMatches.push('Supply covers the requested quantity.')
      matchTypes.push('full_quantity')
      allocatedMilli = supply.quantity.unit === demand.quantity.unit ? demand.quantity.milli : null
      if (supply.quantity.unit !== demand.quantity.unit) assumptions.push('Quantity converts for comparison, but price stays blocked until both sides use one unit.')
    }
  }
  if (supply.vatTreatment !== 'unknown' && demand.vatTreatment !== 'unknown' && supply.vatTreatment !== demand.vatTreatment) {
    hardMismatches.push('VAT treatment differs. Compare both sides on one basis.')
  }

  if (!supply.placeOriginal || !demand.placeOriginal) missing.push('Collection and delivery are both needed before a delivered price.')
  else hardMatches.push('Collection and delivery points are both recorded.')

  const quantityForPrice = allocatedMilli
  const acquisition = supply.priceCents !== null && quantityForPrice !== null && supply.quantity?.unit === demand.quantity?.unit
    ? lineCents(supply.priceCents, quantityForPrice).cents
    : null
  const revenue = demand.priceCents !== null && quantityForPrice !== null ? lineCents(demand.priceCents, quantityForPrice).cents : null
  let components = emptyCostStack(acquisition)
  const waived = new Set(options.waivedCosts ?? [])
  for (const key of waived) components = withCost(components, key, 'not_applicable', null, 'Marked not applicable for this enquiry.')
  if (options.transportCents != null) components = withCost(components, 'transport', options.transportCents === 0 ? 'explicit_zero' : 'known', options.transportCents, 'Entered transport amount.')
  const margin = deliveredMargin({
    quantityMilli: quantityForPrice,
    revenueCents: revenue,
    components,
    transportLowCents: options.transportLowCents ?? null,
    transportExpectedCents: options.transportCents ?? null,
    transportHighCents: options.transportHighCents ?? null,
    minimumMarginBps: options.minimumMarginBps ?? null,
  })
  if (supply.commercialRole === 'agent' || demand.commercialRole === 'agent') assumptions.push('Agent role: a commission still has to be entered. Principal gross profit is not the agent result.')
  if (!supply.commercialRole || !demand.commercialRole) assumptions.push('Commercial role is incomplete, so the margin is evidence only.')

  const viable = hardMismatches.length === 0 && missing.length === 0
  const stage = COMMERCIAL_STAGES.find((item) => item.key === (viable ? 'match' : 'qualify')) as Stage
  return {
    moduleId: '004',
    company: 'farm-feed',
    stage,
    viable,
    matchTypes,
    hardMatches,
    compromises,
    hardMismatches,
    missing,
    assumptions,
    allocatedMilli: quantityForPrice,
    quantityLabel: quantityForPrice !== null && demand.quantity ? formatQuantity({ milli: quantityForPrice, unit: demand.quantity.unit }) : demand.quantity ? formatQuantity(demand.quantity) : 'Quantity unknown',
    margin,
    internalParties: { supply: supply.counterpartyName || 'Supply name missing', demand: demand.counterpartyName || 'Demand name missing' },
    draftMessage: draftMessage(supply, demand, quantityForPrice),
    recommendedAction: viable ? 'Review the margin evidence and record an explicit decision. Nothing is sent.' : 'Resolve the missing facts or mismatches before offering this.',
    execution: 'not_executed',
    sends: false,
    identityReleased: false,
  }
}

function draftMessage(supply: Enquiry, demand: Enquiry, allocatedMilli: number | null): string {
  const quantity = allocatedMilli && demand.quantity ? formatQuantity({ milli: allocatedMilli, unit: demand.quantity.unit }) : 'the quantity still to confirm'
  const product = supply.productOriginal || 'the product'
  const grade = supply.gradeOriginal || 'grade still to confirm'
  return `Draft only, not sent. We can discuss ${quantity} of ${product}, grade ${grade}. Collection and delivery stay in the internal comparison. Counterparty names are not included.`
}

export type FulfilmentSlice = { supplyId: string; grams: number; productOriginal: string }

/** Allocates in the order given. It does not sort by price. */
export function planFulfilment(demand: Enquiry, supplies: Enquiry[]): { slices: FulfilmentSlice[]; uncoveredGrams: number | null; notes: string[] } {
  const notes: string[] = ['Supplies are used in the order provided, not from cheapest to dearest.']
  if (!demand.quantity) return { slices: [], uncoveredGrams: null, notes: [...notes, 'Demand quantity is missing.'] }
  const target = sameOrConvertible(demand.quantity, demand.quantity, demand.kgPerBaleMilli, demand.kgPerBaleMilli)
  if ('error' in target) return { slices: [], uncoveredGrams: null, notes: [...notes, target.error] }
  let remaining = target.gramsLeft
  const slices: FulfilmentSlice[] = []
  for (const supply of supplies) {
    if (remaining <= 0) break
    if (!supply.quantity) {
      notes.push(`${supply.id} has no quantity and was skipped.`)
      continue
    }
    if (supply.productKey !== demand.productKey && !(supply.productKey && demand.acceptsSubstitutes.includes(supply.productKey))) {
      notes.push(`${supply.id} is a different product and was not allocated.`)
      continue
    }
    const available = sameOrConvertible(supply.quantity, demand.quantity, supply.kgPerBaleMilli, demand.kgPerBaleMilli)
    if ('error' in available) {
      notes.push(`${supply.id}: ${available.error}`)
      continue
    }
    const take = Math.min(remaining, available.gramsLeft)
    if (take <= 0) continue
    slices.push({ supplyId: supply.id, grams: take, productOriginal: supply.productOriginal })
    remaining -= take
  }
  if (slices.length > 1) notes.push('More than one supply is needed. This is a multi-supplier fulfilment.')
  return { slices, uncoveredGrams: remaining, notes }
}
