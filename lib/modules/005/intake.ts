import { statedFact, normaliseText } from './facts'
import { assertCaptureScope, assertCapturedAt, stableId } from './scope'
import type {
  BuyerInput,
  BuyerRequirement,
  Fact,
  GroupInput,
  LivestockGroup,
  RequirementFact,
  SellerInput,
  SellerStock,
  Species,
} from './types'

const BREEDS: { name: string; species: Species; words: string[] }[] = [
  { name: 'Santa Gertrudis', species: 'cattle', words: ['santa', 'gertrudis'] },
  { name: 'Ile de France', species: 'sheep', words: ['ile', 'de', 'france'] },
  { name: 'Drakensberger', species: 'cattle', words: ['drakensberger'] },
  { name: 'Beefmaster', species: 'cattle', words: ['beefmaster'] },
  { name: 'Simmentaler', species: 'cattle', words: ['simmentaler'] },
  { name: 'Bonsmara', species: 'cattle', words: ['bonsmara'] },
  { name: 'Brahman', species: 'cattle', words: ['brahman'] },
  { name: 'Hereford', species: 'cattle', words: ['hereford'] },
  { name: 'Charolais', species: 'cattle', words: ['charolais'] },
  { name: 'Limousin', species: 'cattle', words: ['limousin'] },
  { name: 'Nguni', species: 'cattle', words: ['nguni'] },
  { name: 'Boran', species: 'cattle', words: ['boran'] },
  { name: 'Sussex', species: 'cattle', words: ['sussex'] },
  { name: 'Angus', species: 'cattle', words: ['angus'] },
  { name: 'Meatmaster', species: 'sheep', words: ['meatmaster'] },
  { name: 'Van Rooy', species: 'sheep', words: ['van', 'rooy'] },
  { name: 'Merino', species: 'sheep', words: ['merino'] },
  { name: 'Dorper', species: 'sheep', words: ['dorper'] },
  { name: 'Dohne', species: 'sheep', words: ['dohne'] },
  { name: 'Afrino', species: 'sheep', words: ['afrino'] },
  { name: 'Lettelle', species: 'sheep', words: ['lettelle'] },
  { name: 'Damara', species: 'sheep', words: ['damara'] },
  { name: 'Kalahari', species: 'goats', words: ['kalahari'] },
  { name: 'Angora', species: 'goats', words: ['angora'] },
  { name: 'Boerbok', species: 'goats', words: ['boerbok'] },
  { name: 'Savanna', species: 'goats', words: ['savanna'] },
]

const TYPES: { key: string; species: Species | 'ambiguous'; type: string }[] = [
  { key: 'heifers', species: 'cattle', type: 'heifer' },
  { key: 'heifer', species: 'cattle', type: 'heifer' },
  { key: 'weaners', species: 'cattle', type: 'weaner' },
  { key: 'weaner', species: 'cattle', type: 'weaner' },
  { key: 'calves', species: 'cattle', type: 'calf' },
  { key: 'calf', species: 'cattle', type: 'calf' },
  { key: 'bulls', species: 'cattle', type: 'bull' },
  { key: 'bull', species: 'cattle', type: 'bull' },
  { key: 'cows', species: 'cattle', type: 'cow' },
  { key: 'cow', species: 'cattle', type: 'cow' },
  { key: 'oxen', species: 'cattle', type: 'ox' },
  { key: 'ox', species: 'cattle', type: 'ox' },
  { key: 'wethers', species: 'sheep', type: 'wether' },
  { key: 'wether', species: 'sheep', type: 'wether' },
  { key: 'sheep', species: 'sheep', type: 'sheep' },
  { key: 'ewes', species: 'sheep', type: 'ewe' },
  { key: 'ewe', species: 'sheep', type: 'ewe' },
  { key: 'lambs', species: 'sheep', type: 'lamb' },
  { key: 'lamb', species: 'sheep', type: 'lamb' },
  { key: 'goats', species: 'goats', type: 'goat' },
  { key: 'goat', species: 'goats', type: 'goat' },
  { key: 'rams', species: 'ambiguous', type: 'ram' },
  { key: 'ram', species: 'ambiguous', type: 'ram' },
  { key: 'does', species: 'ambiguous', type: 'doe' },
  { key: 'doe', species: 'ambiguous', type: 'doe' },
  { key: 'kids', species: 'ambiguous', type: 'kid' },
  { key: 'kid', species: 'ambiguous', type: 'kid' },
  { key: 'slaughter', species: 'ambiguous', type: 'slaughter' },
]

const PREGNANCY_WORDS = new Set(['pregnant', 'dragtig', 'open'])
const STOP_WORDS = new Set(['and', 'in', 'at', 'near', 'with', 'the', 'a', 'of', 'for', 'to', 'from', 'town', 'seller'])

type Token = { raw: string; key: string }

export function describeGroup(group: LivestockGroup) {
  return group.originalWording.trim()
}

export function captureSeller(input: SellerInput): SellerStock {
  assertCaptureScope(input.entity, input.capability)
  assertCapturedAt(input.capturedAt)
  if (input.originalText.length > 20000) throw new Error('The seller text is too long to capture in one record.')
  const source = input.source?.trim() || 'pasted text'
  const suppliedBy = input.sellerName?.trim() || 'seller'
  const fact = <T>(value: T, wording: string) => statedFact(value, wording, source, suppliedBy, input.capturedAt)
  const groups = input.groups.map((group, index) => groupFromInput(group, input, source, suppliedBy, index))
  return {
    id: stableId('seller', `${input.capturedAt}\n${input.originalText}`),
    entity: 'digikraal',
    capability: '005',
    originalText: input.originalText,
    source,
    capturedAt: input.capturedAt,
    sample: input.sample === true,
    offMarket: true,
    sellerName: optionalFact(fact, input.sellerName),
    location: optionalFact(fact, input.location),
    province: optionalFact(fact, input.province),
    expectedPrice: optionalFact(fact, input.expectedPrice),
    vat: optionalFact(fact, input.vat),
    availability: optionalFact(fact, input.availability),
    contactPermission: input.contactPermission ? fact(input.contactPermission, input.contactPermission) : undefined,
    ownership: optionalFact(fact, input.ownership),
    mandate: optionalFact(fact, input.mandate),
    transport: optionalFact(fact, input.transport),
    priceBasis: optionalFact(fact, input.priceBasis),
    loadingLocation: optionalFact(fact, input.loadingLocation),
    groups,
    media: input.media ?? [],
    unassignedNotes: [],
  }
}

export function proposeSellerFromText(text: string, capturedAt: string, options?: { sample?: boolean; source?: string }): SellerStock {
  assertCapturedAt(capturedAt)
  const source = options?.source?.trim() || 'pasted text'
  const labels = labelMap(text)
  const sellerName = cleanLabel(labels.get('seller'))
  const location = cleanLabel(labels.get('town') ?? labels.get('location'))
  const suppliedBy = sellerName || 'unidentified sender'
  const fact = <T>(value: T, wording: string) => statedFact(value, wording, source, suppliedBy, capturedAt)
  const id = stableId('seller', `${capturedAt}\n${text}`)
  const groups = narrativeGroups(text, id, source, suppliedBy, capturedAt)
  const notes: string[] = []
  if (!groups.length && (labels.get('species') || labels.get('quantity') || labels.get('type') || labels.get('breed'))) {
    const species = speciesFromLabel(labels.get('species'))
    groups.push(groupFromInput({
      species: species ?? 'other',
      originalWording: [labels.get('quantity'), labels.get('breed'), labels.get('type')].filter(Boolean).join(' ') || text.slice(0, 180),
      breed: cleanLabel(labels.get('breed')),
      typeSex: cleanLabel(labels.get('type')),
      quantity: integerLabel(labels.get('quantity')),
    }, { originalText: text, capturedAt, source }, source, suppliedBy, 0))
    if (!species) notes.push('Species was not settled from the label. It was not guessed.')
  }
  applySingleGroupLabel(groups, 'breed', labels.get('breed'), fact, notes)
  applySingleGroupLabel(groups, 'pregnancy', labels.get('pregnancy'), fact, notes)
  applySingleGroupLabel(groups, 'ageOrTooth', labels.get('age'), fact, notes)
  applySingleGroupLabel(groups, 'weight', labels.get('weight'), fact, notes)
  applySingleGroupLabel(groups, 'health', labels.get('health'), fact, notes)
  const permission = permissionFromLabel(labels.get('permission'))
  return {
    id,
    entity: 'digikraal',
    capability: '005',
    originalText: text,
    source,
    capturedAt,
    sample: options?.sample === true,
    offMarket: true,
    sellerName: sellerName ? fact(sellerName, sellerName) : undefined,
    location: location ? fact(location, location) : undefined,
    province: labelFact(fact, labels.get('province')),
    expectedPrice: labelFact(fact, labels.get('price') ?? labels.get('asking')),
    vat: labelFact(fact, labels.get('vat')),
    availability: labelFact(fact, labels.get('availability')),
    contactPermission: permission ? fact(permission, permission) : undefined,
    ownership: labelFact(fact, labels.get('owner') ?? labels.get('ownership')),
    mandate: labelFact(fact, labels.get('mandate')),
    transport: labelFact(fact, labels.get('transport')),
    priceBasis: labelFact(fact, labels.get('basis')),
    loadingLocation: labelFact(fact, labels.get('loading')),
    groups,
    media: [],
    unassignedNotes: notes,
  }
}

export function captureBuyer(input: BuyerInput): BuyerRequirement {
  assertCaptureScope(input.entity, input.capability)
  assertCapturedAt(input.capturedAt)
  const source = input.source?.trim() || 'pasted text'
  const suppliedBy = input.buyerName?.trim() || 'buyer'
  const fact = <T>(value: T, wording: string): RequirementFact<T> => ({
    value,
    originalWording: wording.trim(),
    source,
    suppliedBy,
    capturedAt: input.capturedAt,
    confirmed: false,
  })
  const quantityWording = input.quantityWording?.trim()
    || (input.quantityMin !== undefined && input.quantityMax !== undefined ? `${input.quantityMin}-${input.quantityMax}` : undefined)
  const quantityUnusable = input.quantityMin !== undefined && input.quantityMax !== undefined && input.quantityMin > input.quantityMax
  const coreReady = Boolean(input.species && input.quantityMin !== undefined && input.quantityMax !== undefined && !quantityUnusable)
  return {
    id: stableId('buyer', `${input.capturedAt}\n${input.originalText}`),
    entity: 'digikraal',
    capability: '005',
    originalText: input.originalText,
    source,
    capturedAt: input.capturedAt,
    sample: input.sample === true,
    confidential: true,
    status: 'new',
    proposedLifecycle: coreReady ? 'searching_stock' : 'needs_qualification',
    buyerName: input.buyerName?.trim() ? fact(input.buyerName.trim(), input.buyerName) : undefined,
    species: input.species ? fact(input.species, input.species) : undefined,
    breed: input.breed?.trim() ? fact(input.breed.trim(), input.breed) : undefined,
    acceptableBreeds: input.acceptableBreeds ?? [],
    typeSex: input.typeSex?.trim() ? fact(input.typeSex.trim(), input.typeSex) : undefined,
    quantityMin: input.quantityMin !== undefined && quantityWording ? fact(input.quantityMin, quantityWording) : undefined,
    quantityMax: input.quantityMax !== undefined && quantityWording ? fact(input.quantityMax, quantityWording) : undefined,
    quantityWording,
    quantityUnusable: quantityUnusable || undefined,
    ageOrTooth: input.ageOrTooth?.trim() ? fact(input.ageOrTooth.trim(), input.ageOrTooth) : undefined,
    weight: input.weight?.trim() ? fact(input.weight.trim(), input.weight) : undefined,
    pregnancyRequired: input.pregnancyRequired === undefined
      ? undefined
      : fact(input.pregnancyRequired, input.pregnancyWording?.trim() || (input.pregnancyRequired ? 'required' : 'not required')),
    healthRequired: input.healthRequired?.trim() ? fact(input.healthRequired.trim(), input.healthRequired) : undefined,
    destination: input.destination?.trim() ? fact(input.destination.trim(), input.destination) : undefined,
    budget: input.budget?.trim() ? fact(input.budget.trim(), input.budget) : undefined,
    requiredBy: input.requiredBy?.trim() ? fact(input.requiredBy.trim(), input.requiredBy) : undefined,
    paymentReady: input.paymentReady ? fact(input.paymentReady, input.paymentReady) : undefined,
    exclusions: input.exclusions ?? [],
  }
}

export function proposeBuyerFromText(text: string, capturedAt: string, options?: { sample?: boolean; source?: string }): BuyerRequirement {
  const labels = labelMap(text)
  const quantity = quantityLabel(labels.get('quantity'))
  const pregnancy = labels.get('pregnancy')
  const pregnancyRequired = pregnancy ? /^(required|yes|pregnant|in calf|in lamb)$/i.test(pregnancy) : undefined
  const payment = labels.get('payment')
  return captureBuyer({
    originalText: text,
    capturedAt,
    source: options?.source,
    sample: options?.sample,
    buyerName: cleanLabel(labels.get('buyer')),
    species: speciesFromLabel(labels.get('species')),
    breed: cleanLabel(labels.get('breed')),
    acceptableBreeds: (labels.get('also') ?? '').split(',').map((item) => item.trim()).filter(Boolean),
    typeSex: cleanLabel(labels.get('type')),
    quantityMin: quantity?.min,
    quantityMax: quantity?.max,
    quantityWording: quantity?.wording,
    ageOrTooth: cleanLabel(labels.get('age')),
    weight: cleanLabel(labels.get('weight')),
    pregnancyRequired: pregnancyRequired === undefined ? undefined : pregnancyRequired,
    pregnancyWording: pregnancy,
    healthRequired: cleanLabel(labels.get('health')),
    destination: cleanLabel(labels.get('destination')),
    budget: cleanLabel(labels.get('budget')),
    requiredBy: cleanLabel(labels.get('by')),
    paymentReady: payment ? (/unknown/i.test(payment) ? 'unknown' : 'stated') : undefined,
    exclusions: (labels.get('exclude') ?? '').split(',').map((item) => item.trim()).filter(Boolean),
  })
}

export function buyerReadiness(buyer: BuyerRequirement) {
  const items = [
    { label: 'Species', state: buyer.species ? 'stated' as const : 'missing' as const },
    { label: 'Quantity', state: buyer.quantityMin && buyer.quantityMax ? 'stated' as const : 'missing' as const },
    { label: 'Budget', state: buyer.budget ? 'stated' as const : 'missing' as const },
    { label: 'Payment readiness', state: buyer.paymentReady ? 'stated' as const : 'missing' as const },
    { label: 'Destination', state: buyer.destination ? 'stated' as const : 'missing' as const },
  ]
  return { notACreditDecision: true as const, items }
}

function optionalFact<T extends string>(fact: <U>(value: U, wording: string) => Fact<U>, value: T | undefined) {
  const cleaned = value?.trim()
  return cleaned ? fact(cleaned, cleaned) : undefined
}

function labelFact<T extends string>(fact: <U>(value: U, wording: string) => Fact<U>, value: T | undefined) {
  return optionalFact(fact, cleanLabel(value))
}

function groupFromInput(group: GroupInput, input: Pick<SellerInput, 'originalText' | 'capturedAt' | 'source'>, source: string, suppliedBy: string, index: number): LivestockGroup {
  const fact = <T>(value: T, wording: string) => statedFact(value, wording || group.originalWording, source, suppliedBy, input.capturedAt)
  const wording = group.originalWording.trim()
  if (!wording) throw new Error('Each livestock group needs the original wording.')
  return {
    id: `${stableId('seller', `${input.capturedAt}\n${input.originalText}`)}-${index + 1}`,
    species: group.species,
    originalWording: wording,
    conflicts: [],
    breed: group.breed ? fact(group.breed, group.breed) : undefined,
    typeSex: group.typeSex ? fact(group.typeSex, group.typeSex) : undefined,
    quantity: group.quantity === undefined ? undefined : fact(group.quantity, wording),
    ageOrTooth: group.ageOrTooth ? fact(group.ageOrTooth, group.ageOrTooth) : undefined,
    weight: group.weight ? fact(group.weight, group.weight) : undefined,
    pregnancy: group.pregnancy ? fact(group.pregnancy, group.pregnancy) : undefined,
    sire: group.sire ? fact(group.sire, group.sire) : undefined,
    woolOrFibre: group.woolOrFibre ? fact(group.woolOrFibre, group.woolOrFibre) : undefined,
    health: group.health ? fact(group.health, group.health) : undefined,
    dairy: group.dairy ? fact(group.dairy, group.dairy) : undefined,
    pairing: group.pairing === 'pairs' ? fact('pairs', wording) : undefined,
  }
}

function narrativeGroups(text: string, id: string, source: string, suppliedBy: string, capturedAt: string) {
  const groups: LivestockGroup[] = []
  const pattern = /\b(\d{1,6})\b/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text))) {
    const before = text[match.index - 1] ?? ''
    if (before === 'R' || before === 'r' || before === '/' || before === '-') continue
    const quantity = Number(match[1])
    const tokens = tokensAfter(text, match.index + match[1].length)
    const parsed = parseAnimalPhrase(tokens)
    if (!parsed) continue
    const wording = `${quantity} ${parsed.words.join(' ')}`.trim()
    const fact = <T>(value: T, original: string) => statedFact(value, original, source, suppliedBy, capturedAt)
    groups.push({
      id: `${id}-${groups.length + 1}`,
      species: parsed.species,
      originalWording: wording,
      conflicts: parsed.conflicts,
      breed: parsed.breed ? fact(parsed.breed, parsed.breed) : undefined,
      typeSex: parsed.type ? fact(parsed.type, parsed.type) : undefined,
      quantity: fact(quantity, wording),
      pregnancy: parsed.pregnancy ? fact(parsed.pregnancy, parsed.pregnancy) : undefined,
    })
  }
  return groups
}

function parseAnimalPhrase(tokens: Token[]) {
  let index = 0
  let pregnancy: string | undefined
  if (tokens[index] && PREGNANCY_WORDS.has(tokens[index].key)) {
    pregnancy = tokens[index].raw.toLowerCase()
    index += 1
  }
  const breed = matchBreed(tokens.slice(index))
  if (breed) index += breed.words.length
  let unknownBreed: string | undefined
  if (!breed && tokens[index] && !STOP_WORDS.has(tokens[index].key) && !matchType(tokens[index].key) && /^[A-Z]/.test(tokens[index].raw)) {
    unknownBreed = tokens[index].raw
    index += 1
  }
  const type = tokens[index] ? matchType(tokens[index].key) : undefined
  if (type) index += 1
  if (!breed && !unknownBreed && !type) return null
  const breedSpecies = breed?.species ?? null
  const typeSpecies = type?.species ?? null
  let species: Species = 'other'
  const conflicts: string[] = []
  if (breedSpecies && typeSpecies && typeSpecies !== 'ambiguous' && breedSpecies !== typeSpecies) {
    conflicts.push(`Breed points to ${breedSpecies} and the animal word points to ${typeSpecies}. Neither was chosen.`)
  } else if (breedSpecies) species = breedSpecies
  else if (typeSpecies && typeSpecies !== 'ambiguous') species = typeSpecies
  const used = tokens.slice(0, index).map((token) => token.raw)
  return {
    species,
    conflicts,
    breed: breed?.name ?? unknownBreed,
    type: type?.type,
    pregnancy,
    words: used,
  }
}

function matchBreed(tokens: Token[]) {
  return BREEDS.find((breed) => breed.words.every((word, index) => tokens[index]?.key === word)) ?? null
}

function matchType(key: string) {
  return TYPES.find((type) => type.key === key) ?? null
}

function tokensAfter(text: string, index: number): Token[] {
  const rest = text.slice(index).split(/[.;\n]/)[0] ?? ''
  return rest.split(/\s+/).map(tokenise).filter((token): token is Token => Boolean(token)).slice(0, 5)
}

function tokenise(raw: string): Token | null {
  const cleaned = raw.replace(/^[^A-Za-z]+|[^A-Za-z-]+$/g, '')
  if (!cleaned) return null
  return { raw: cleaned, key: cleaned.toLowerCase() }
}

function labelMap(text: string) {
  const map = new Map<string, string>()
  for (const part of text.split(/\n|;/)) {
    const match = part.match(/^\s*([A-Za-z][A-Za-z ]*):\s*([^.\n]+)/)
    if (!match) continue
    map.set(match[1].trim().toLowerCase(), match[2].trim())
  }
  return map
}

function cleanLabel(value: string | undefined) {
  const cleaned = value?.trim().replace(/\.$/, '')
  return cleaned || undefined
}

function speciesFromLabel(value: string | undefined): Species | undefined {
  const key = normaliseText(value ?? '')
  if (key === 'cattle' || key === 'sheep' || key === 'goats' || key === 'other') return key
  return undefined
}

function integerLabel(value: string | undefined) {
  if (!value || !/^\d{1,6}$/.test(value.trim())) return undefined
  return Number(value.trim())
}

function quantityLabel(value: string | undefined) {
  if (!value) return undefined
  const wording = value.trim().replace(/\.$/, '')
  const range = wording.match(/^(\d{1,6})\s*-\s*(\d{1,6})$/)
  if (range) return { min: Number(range[1]), max: Number(range[2]), wording }
  const single = wording.match(/^(\d{1,6})$/)
  if (single) return { min: Number(single[1]), max: Number(single[1]), wording }
  return undefined
}

function permissionFromLabel(value: string | undefined): 'granted' | 'refused' | 'unknown' | undefined {
  if (!value) return undefined
  if (/^granted$/i.test(value.trim())) return 'granted'
  if (/^refused$/i.test(value.trim())) return 'refused'
  if (/^unknown$/i.test(value.trim())) return 'unknown'
  return undefined
}

function applySingleGroupLabel(
  groups: LivestockGroup[],
  field: 'breed' | 'pregnancy' | 'ageOrTooth' | 'weight' | 'health',
  value: string | undefined,
  fact: <T>(amount: T, wording: string) => Fact<T>,
  notes: string[],
) {
  const cleaned = cleanLabel(value)
  if (!cleaned) return
  const title = field === 'ageOrTooth' ? 'Age' : field[0].toUpperCase() + field.slice(1)
  if (groups.length !== 1) {
    if (groups.length > 1) notes.push(`${title} wording was not copied onto every group: ${cleaned}`)
    return
  }
  const group = groups[0]
  const current = group[field]
  if (current) {
    if (normaliseText(String(current.value)) !== normaliseText(cleaned)) notes.push(`${title} wording was not overwritten: ${cleaned}`)
    return
  }
  group[field] = fact(cleaned, cleaned)
}
