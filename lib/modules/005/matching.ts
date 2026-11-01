import { describeGroup } from './intake'
import { normaliseText } from './facts'
import { assertLivestockScope } from './scope'
import type { BuyerRequirement, DraftMessage, LivestockGroup, MatchExplanation, SellerStock } from './types'

type State = 'match' | 'compromise' | 'missing' | 'mismatch' | 'not_compared'
type Dimension = { state: State; text: string; weight: number }

const NO_ESTIMATE = 'No transport cost, margin or delivered price was estimated.'

export function explainMatch(seller: SellerStock, buyer: BuyerRequirement, options?: { disclosureApproved?: boolean }): MatchExplanation {
  assertLivestockScope(seller)
  assertLivestockScope(buyer)
  const hideIdentity = seller.offMarket || options?.disclosureApproved !== true
  if (!buyer.species) return blank(seller, 'The buyer requirement has no species. Nothing was matched.')
  if (!seller.groups.length) return blank(seller, 'No livestock group was captured.')
  const judged = seller.groups.map((group) => ({ group, dimensions: judgeGroup(group, buyer, seller) }))
  judged.sort((left, right) => scoreOf(right.dimensions) - scoreOf(left.dimensions) || mismatches(left.dimensions) - mismatches(right.dimensions))
  const chosen = judged[0]
  const dimensions = chosen.dimensions
  const hardMismatches = texts(dimensions, 'mismatch')
  const missingInformation = texts(dimensions, 'missing')
  const compromises = texts(dimensions, 'compromise')
  const hardMatches = texts(dimensions, 'match')
  const distance = dimensions.find((item) => item.weight === 5 && /distance|places|records name/i.test(item.text))?.text ?? 'No distance was calculated.'
  const readyToReview = hardMismatches.length === 0 && missingInformation.length === 0 && compromises.length === 0
  const buyerMessage = buyerDraft(chosen.group, hideIdentity)
  const sellerMessage = sellerDraft()
  return {
    score: scoreOf(dimensions),
    readyToReview,
    hardMatches,
    compromises,
    hardMismatches,
    missingInformation,
    assumptions: [],
    separations: seller.groups.filter((group) => group.id !== chosen.group.id).map((group) => `${describeGroup(group)} kept as its own group. Counts were not combined.`),
    distanceAndTransportImpact: distance,
    estimatedDeliveredCost: null,
    estimatedMargin: null,
    risks: [NO_ESTIMATE, 'Seller statements stay unverified until a person records a check or a document.'],
    recommendedAction: actionFor(readyToReview, hardMismatches.length > 0),
    draftMessages: { buyer: buyerMessage, seller: sellerMessage },
    componentId: chosen.group.id,
    internalSummary: internalLine(seller, chosen.group),
    buyerFacingSummary: buyerMessage.body,
    outreachStarted: false,
    sourcingOpened: false,
  }
}

function judgeGroup(group: LivestockGroup, buyer: BuyerRequirement, seller: SellerStock): Dimension[] {
  if (group.conflicts.length || group.species === 'other') {
    return [{ state: 'missing', text: 'Species was not settled. No match was made for this group.', weight: 25 }]
  }
  if (group.species !== buyer.species?.value) {
    return [{ state: 'mismatch', text: `Species ${group.species} does not match ${buyer.species?.value}. No further comparison was made for this group.`, weight: 25 }]
  }
  return [
    { state: 'match', text: `Species matches: ${group.species}.`, weight: 25 },
    judgeBreed(group, buyer),
    judgeType(group, buyer),
    judgeQuantity(group, buyer),
    judgePregnancy(group, buyer),
    judgeHealth(group, buyer),
    judgeTextFact(group.ageOrTooth?.value, buyer.ageOrTooth?.value, 'Age or tooth class', 5),
    judgeTextFact(group.weight?.value, buyer.weight?.value, 'Weight', 5),
    judgePrice(seller.expectedPrice?.value, buyer.budget?.value),
    judgeLocation(seller.location?.value, buyer.destination?.value),
  ].filter((item): item is Dimension => Boolean(item))
}

function judgeBreed(group: LivestockGroup, buyer: BuyerRequirement): Dimension {
  if (!buyer.breed) return { state: 'not_compared', text: '', weight: 15 }
  if (!group.breed) return { state: 'missing', text: 'Breed was not supplied.', weight: 15 }
  if (normaliseText(group.breed.value) === normaliseText(buyer.breed.value)) {
    return { state: 'match', text: `Breed wording matches: ${group.breed.value}.`, weight: 15 }
  }
  if (buyer.acceptableBreeds.some((breed) => normaliseText(breed) === normaliseText(group.breed?.value ?? ''))) {
    return { state: 'compromise', text: `${group.breed.value} is on the acceptable breed list. It is not the first breed asked for.`, weight: 15 }
  }
  return { state: 'mismatch', text: `Breed ${group.breed.value} does not match ${buyer.breed.value}.`, weight: 15 }
}

function judgeType(group: LivestockGroup, buyer: BuyerRequirement): Dimension {
  if (!buyer.typeSex) return { state: 'not_compared', text: '', weight: 15 }
  if (!group.typeSex) return { state: 'missing', text: 'Type or sex was not supplied.', weight: 15 }
  if (canonicalType(group.typeSex.value) === canonicalType(buyer.typeSex.value)) {
    return { state: 'match', text: `Type matches: ${canonicalType(group.typeSex.value)}.`, weight: 15 }
  }
  return { state: 'mismatch', text: `Type ${group.typeSex.value} does not match ${buyer.typeSex.value}.`, weight: 15 }
}

function judgeQuantity(group: LivestockGroup, buyer: BuyerRequirement): Dimension {
  if (buyer.quantityMin === undefined || buyer.quantityMax === undefined) return { state: 'not_compared', text: '', weight: 15 }
  if (buyer.quantityUnusable || buyer.quantityMin.value > buyer.quantityMax.value) {
    return { state: 'missing', text: 'Quantity range could not be used because the high number is below the low number.', weight: 15 }
  }
  if (!group.quantity) return { state: 'missing', text: 'Quantity was not supplied.', weight: 15 }
  const quantity = group.quantity.value
  if (quantity >= buyer.quantityMin.value && quantity <= buyer.quantityMax.value) {
    return { state: 'match', text: `Quantity ${quantity} sits inside ${buyer.quantityWording ?? `${buyer.quantityMin.value}-${buyer.quantityMax.value}`}. It is not verified.`, weight: 15 }
  }
  if (quantity > buyer.quantityMax.value) {
    return { state: 'compromise', text: `The group count ${quantity} is larger than the request. Splitting it was not assumed.`, weight: 15 }
  }
  return { state: 'mismatch', text: `Quantity ${quantity} is below the request.`, weight: 15 }
}

function judgePregnancy(group: LivestockGroup, buyer: BuyerRequirement): Dimension {
  if (!buyer.pregnancyRequired?.value) return { state: 'not_compared', text: '', weight: 10 }
  if (!group.pregnancy) return { state: 'missing', text: 'Pregnancy status was not supplied.', weight: 10 }
  const verified = group.pregnancy.verification === 'document_confirmed' || group.pregnancy.verification === 'veterinarian_confirmed'
  if (!verified) {
    return { state: 'compromise', text: `Pregnancy wording is only a seller statement: ${group.pregnancy.originalWording}. It was not treated as verified.`, weight: 10 }
  }
  return { state: 'match', text: `Pregnancy document wording: ${group.pregnancy.originalWording}. No extra veterinary conclusion was added.`, weight: 10 }
}

function judgeHealth(group: LivestockGroup, buyer: BuyerRequirement): Dimension {
  if (!buyer.healthRequired) return { state: 'not_compared', text: '', weight: 5 }
  if (!group.health) return { state: 'missing', text: 'Health requirement was not matched to supplied wording.', weight: 5 }
  const verified = group.health.verification === 'document_confirmed' || group.health.verification === 'veterinarian_confirmed'
  if (!verified) {
    return { state: 'compromise', text: `Health wording is only a seller statement: ${group.health.originalWording}. It was not read as a test result.`, weight: 5 }
  }
  return { state: 'match', text: `Health wording on file: ${group.health.originalWording}.`, weight: 5 }
}

function judgeTextFact(sellerValue: string | undefined, buyerValue: string | undefined, label: string, weight: number): Dimension {
  if (!buyerValue) return { state: 'not_compared', text: '', weight }
  if (!sellerValue) return { state: 'missing', text: `${label} was not supplied.`, weight }
  if (normaliseText(sellerValue) === normaliseText(buyerValue)) {
    return { state: 'match', text: `${label} wording matches: ${sellerValue}. It was not recalculated.`, weight }
  }
  return { state: 'mismatch', text: `${label} wording ${sellerValue} does not match ${buyerValue}.`, weight }
}

function judgePrice(sellerPrice: string | undefined, buyerBudget: string | undefined): Dimension {
  if (!buyerBudget) return { state: 'not_compared', text: '', weight: 10 }
  if (!sellerPrice) return { state: 'missing', text: `Buyer budget wording: ${buyerBudget}. No seller price was supplied, so the two were not compared.`, weight: 10 }
  const seller = parsePrice(sellerPrice)
  const buyer = parsePrice(buyerBudget)
  if (!seller || !buyer || seller.basis !== buyer.basis) {
    return { state: 'missing', text: 'Price wording could not be compared. No delivered price was calculated.', weight: 10 }
  }
  if (seller.amount <= buyer.amount) {
    return { state: 'match', text: 'Asking price is inside the stated budget. Transport was not added.', weight: 10 }
  }
  return { state: 'mismatch', text: 'Asking price is above the stated budget. Transport was not added.', weight: 10 }
}

function judgeLocation(sellerPlace: string | undefined, buyerPlace: string | undefined): Dimension {
  if (!sellerPlace || !buyerPlace) return { state: 'not_compared', text: 'No distance was calculated.', weight: 5 }
  if (normaliseText(sellerPlace) === normaliseText(buyerPlace)) {
    return { state: 'match', text: `Both records name ${sellerPlace}. No distance was calculated.`, weight: 5 }
  }
  return { state: 'missing', text: `${sellerPlace} and ${buyerPlace} are different places. No distance was calculated.`, weight: 5 }
}

function parsePrice(text: string) {
  const amountMatch = text.replace(/[\s,]/g, '').match(/(\d+(?:\.\d+)?)/)
  if (!amountMatch) return null
  const basis = /kg|kilogram/i.test(text) ? 'kg' as const : /group|lot|total/i.test(text) ? 'group' as const : /head|animal|cow|ewe|goat/i.test(text) ? 'head' as const : null
  if (!basis) return null
  return { amount: Number(amountMatch[1]), basis }
}

function canonicalType(value: string) {
  const key = normaliseText(value)
  const map: Record<string, string> = {
    cow: 'cow', cows: 'cow', calf: 'calf', calves: 'calf', bull: 'bull', bulls: 'bull', heifer: 'heifer', heifers: 'heifer',
    ewe: 'ewe', ewes: 'ewe', ram: 'ram', rams: 'ram', lamb: 'lamb', lambs: 'lamb', wether: 'wether', wethers: 'wether',
    doe: 'doe', does: 'doe', kid: 'kid', kids: 'kid', goat: 'goat', goats: 'goat',
  }
  return map[key] ?? key
}

function scoreOf(dimensions: Dimension[]) {
  const judged = dimensions.filter((item) => item.state !== 'not_compared')
  const total = judged.reduce((sum, item) => sum + item.weight, 0)
  if (!total) return 0
  const earned = judged.reduce((sum, item) => sum + (item.state === 'match' ? item.weight : item.state === 'compromise' ? item.weight / 2 : 0), 0)
  return Math.round((earned / total) * 100)
}

function mismatches(dimensions: Dimension[]) {
  return dimensions.filter((item) => item.state === 'mismatch').length
}

function texts(dimensions: Dimension[], state: State) {
  return dimensions.filter((item) => item.state === state && item.text).map((item) => item.text)
}

function actionFor(ready: boolean, blocked: boolean) {
  if (blocked) return 'Do not present this group.'
  if (!ready) return 'Hold the buyer draft. Ask only for the gaps, then Drikus approves before anything is sent.'
  return 'Drikus can review this match. Sending still needs its own approval.'
}

function buyerDraft(group: LivestockGroup, hideIdentity: boolean): DraftMessage {
  const identity = hideIdentity
    ? 'Seller name and place stay inside Pivot OS.'
    : 'Sharing was approved for this review.'
  return {
    status: 'draft',
    sent: false,
    requiresApproval: true,
    audience: 'buyer',
    body: `Draft only. This has not been sent. Recorded group: ${describeGroup(group)}. ${identity}`,
  }
}

function sellerDraft(): DraftMessage {
  return {
    status: 'draft',
    sent: false,
    requiresApproval: true,
    audience: 'seller',
    body: 'Draft only. This has not been sent. A buyer requirement lines up on some recorded points. Buyer name and budget stay inside Pivot OS.',
  }
}

function internalLine(seller: SellerStock, group: LivestockGroup) {
  const who = seller.sellerName?.value ?? 'an unnamed seller'
  const place = seller.location ? ` in ${seller.location.value}` : ''
  return `${describeGroup(group)} is recorded for ${who}${place}.`
}

function blank(seller: SellerStock, reason: string): MatchExplanation {
  const buyerMessage = buyerDraft(seller.groups[0] ?? { id: 'none', species: 'other', originalWording: 'livestock', conflicts: [] }, true)
  return {
    score: 0,
    readyToReview: false,
    hardMatches: [],
    compromises: [],
    hardMismatches: [],
    missingInformation: [reason],
    assumptions: [],
    separations: [],
    distanceAndTransportImpact: 'No distance was calculated.',
    estimatedDeliveredCost: null,
    estimatedMargin: null,
    risks: [NO_ESTIMATE],
    recommendedAction: 'Do not present this group.',
    draftMessages: { buyer: buyerMessage, seller: sellerDraft() },
    componentId: seller.groups[0]?.id ?? '',
    internalSummary: reason,
    buyerFacingSummary: buyerMessage.body,
    outreachStarted: false,
    sourcingOpened: false,
  }
}
