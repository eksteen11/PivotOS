import {
  CUSTODY_LOCATIONS,
  STOCK_MOVEMENT_TYPES,
  type CashCount,
  type CashEvent,
  type CashKind,
  type CashPosition,
  type CustodyException,
  type CustodyLocation,
  type JointApproval,
  type OfficeSafeEquation,
  type OpeningCash,
  type PartnerBooks,
  type PartnerSafeEquation,
  type PostedCash,
  type PostedStock,
  type Reconciliation,
  type StockLine,
  type StockMovement,
  type StockMovementType,
} from './contract'

const PARTNER = 'operating-partner-safe'
const OFFICE = 'digikraal-office-safe'
const TRANSIT = 'bank-deposit-in-transit'
const BANK = 'bank-account'

const cashKinds = new Set<CashKind>([
  'sale-receipt', 'earlier-sale-collection', 'other-receipt', 'expense', 'stock-purchase', 'handover',
  'direct-deposit', 'office-receipt', 'office-spend', 'bank-handover', 'bank-confirmation', 'reversal',
])

type CashBucket =
  | 'sale-receipt'
  | 'earlier-sale-collection'
  | 'other-receipt'
  | 'expense'
  | 'stock-purchase'
  | 'handover-in'
  | 'handover-office-out'
  | 'handover-other-out'
  | 'direct-deposit-out'
  | 'direct-deposit-in'
  | 'office-receipt'
  | 'office-spend'
  | 'bank-handover-out'
  | 'bank-handover-in'
  | 'bank-confirmation-out'
  | 'bank-confirmation-in'
  | 'reversal'

type CashDelta = { location: CustodyLocation; bucket: CashBucket; cents: number }

type StockBucket =
  | 'receipt'
  | 'transfer-in'
  | 'transfer-out'
  | 'delivery'
  | 'return'
  | 'loss'
  | 'processing-in'
  | 'processing-out'
  | 'reversal'

type StockDelta = {
  batchId: string
  productId: string
  location: string
  unit: string
  expectedDelta: number
  adjustmentDelta: number
  bucket: StockBucket | 'adjustment'
}

type Position = {
  batchId: string
  productId: string
  location: string
  unit: string
  openingMilli: number
  buckets: Map<StockBucket, number>
  adjustmentMilli: number
  custodianId: string | null
  countEvidence: string[]
  latestCountId: string | null
  physicalMilli: number | null
  adjustmentCountIds: string[]
}

function hasText(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isLocation(value: string): value is CustodyLocation {
  return (CUSTODY_LOCATIONS as readonly string[]).includes(value)
}

function isStockType(value: string): value is StockMovementType {
  return (STOCK_MOVEMENT_TYPES as readonly string[]).includes(value)
}

function stockKey(batchId: string, location: string, unit: string) {
  return `${batchId}\u0000${location}\u0000${unit}`
}

function joint(approvals: readonly JointApproval[] | undefined) {
  const founder = approvals?.filter((item) => item.role === 'founder' && hasText(item.personId)) ?? []
  const partner = approvals?.filter((item) => item.role === 'operating-partner' && hasText(item.personId)) ?? []
  return founder.length === 1 && partner.length === 1 && founder[0].personId !== partner[0].personId
}

function bucketSum(buckets: Map<CashBucket, number>, name: CashBucket) {
  return buckets.get(name) ?? 0
}

function positiveIn(sum: number, other: { value: number }) {
  if (sum >= 0) return sum
  other.value += sum
  return 0
}

function positiveOut(sum: number, other: { value: number }) {
  if (sum <= 0) return -sum
  other.value += sum
  return 0
}

export function cashEquationHolds(equation: PartnerSafeEquation) {
  const expected = equation.openingCents
    + equation.saleReceiptsCents
    + equation.earlierCollectionsCents
    + equation.otherReceiptsCents
    + equation.handoversInCents
    + equation.reversalNetCents
    + equation.otherNetCents
    - equation.expensesCents
    - equation.stockPurchasesCents
    - equation.officeHandoversCents
    - equation.otherHandoversOutCents
    - equation.directDepositsCents
  return expected === equation.expectedCloseCents
}

export function officeEquationHolds(equation: OfficeSafeEquation) {
  const expected = equation.openingCents
    + equation.acceptedHandoversCents
    + equation.officeReceiptsCents
    + equation.reversalNetCents
    + equation.otherNetCents
    - equation.officeSpendCents
    - equation.bankHandoversCents
  return expected === equation.expectedCloseCents
}

export function stockEquationHolds(line: StockLine) {
  const expected = line.openingMilli
    + line.receiptsMilli
    + line.transfersInMilli
    + line.returnsMilli
    + line.processingInMilli
    + line.reversalNetMilli
    + line.otherNetMilli
    - line.transfersOutMilli
    - line.deliveriesMilli
    - line.lossesMilli
    - line.processingOutMilli
  return expected === line.expectedMilli && line.bookMilli === line.expectedMilli + line.adjustmentMilli
}

function classifyCash(event: CashEvent): { deltas: CashDelta[] } | { reason: string } {
  if (!hasText(event.id) || !hasText(event.evidenceId) || !hasText(event.custodianId)) return { reason: 'Cash event needs an id, custodian and evidence.' }
  if (!cashKinds.has(event.kind)) return { reason: 'Cash event type is not recognised.' }
  if (!Number.isSafeInteger(event.cents) || event.cents <= 0) return { reason: 'Cash amount must be a positive number of cents.' }
  if (!isLocation(event.location)) return { reason: 'Cash location is not a custody place.' }
  if (event.kind === 'sale-receipt' || event.kind === 'earlier-sale-collection' || event.kind === 'other-receipt') {
    return { deltas: [{ location: event.location, bucket: event.kind, cents: event.cents }] }
  }
  if (event.kind === 'expense' || event.kind === 'stock-purchase') {
    return { deltas: [{ location: event.location, bucket: event.kind, cents: -event.cents }] }
  }
  if (event.kind === 'office-receipt' || event.kind === 'office-spend') {
    if (event.location !== OFFICE) return { reason: 'Office cash must be in the office safe.' }
    return { deltas: [{ location: OFFICE, bucket: event.kind, cents: event.kind === 'office-receipt' ? event.cents : -event.cents }] }
  }
  if (event.kind === 'direct-deposit') {
    if (event.location !== PARTNER || event.destination !== TRANSIT) return { reason: 'A direct deposit leaves the partner safe for bank deposit in transit.' }
    return { deltas: [
      { location: PARTNER, bucket: 'direct-deposit-out', cents: -event.cents },
      { location: TRANSIT, bucket: 'direct-deposit-in', cents: event.cents },
    ] }
  }
  if (event.kind === 'bank-handover') {
    if (event.location !== OFFICE || event.destination !== TRANSIT) return { reason: 'A bank handover leaves the office safe for bank deposit in transit.' }
    return { deltas: [
      { location: OFFICE, bucket: 'bank-handover-out', cents: -event.cents },
      { location: TRANSIT, bucket: 'bank-handover-in', cents: event.cents },
    ] }
  }
  if (event.kind === 'bank-confirmation') {
    if (event.location !== TRANSIT || event.destination !== BANK) return { reason: 'Bank confirmation moves deposit-in-transit into the bank account.' }
    if (!hasText(event.bankLineId)) return { reason: 'Bank confirmation needs a bank line.' }
    return { deltas: [
      { location: TRANSIT, bucket: 'bank-confirmation-out', cents: -event.cents },
      { location: BANK, bucket: 'bank-confirmation-in', cents: event.cents },
    ] }
  }
  if (event.kind === 'handover') {
    if (!event.destination || !isLocation(event.destination)) return { reason: 'Handover needs a custody destination.' }
    if (event.destination === event.location) return { reason: 'Handover needs two different custody places.' }
    if (!hasText(event.receivingCustodianId) || event.receivingCustodianId === event.custodianId) return { reason: 'Handover needs two different people.' }
    const acknowledgements = event.acknowledgedBy ?? []
    if (!acknowledgements.includes(event.custodianId) || !acknowledgements.includes(event.receivingCustodianId)) return { reason: 'Handover waits until both people acknowledge it.' }
    if (event.countedCents !== event.cents) return { reason: 'Handover amount must match the joint count.' }
    const leavingPartnerForOffice = event.location === PARTNER && event.destination === OFFICE
    return { deltas: [
      { location: event.location, bucket: leavingPartnerForOffice ? 'handover-office-out' : 'handover-other-out', cents: -event.cents },
      { location: event.destination, bucket: 'handover-in', cents: event.cents },
    ] }
  }
  return { deltas: [] }
}

function lineOf(batchId: string, productId: string, location: string, unit: string, expectedDelta: number, bucket: StockBucket): StockDelta {
  return { batchId, productId, location, unit, expectedDelta, adjustmentDelta: 0, bucket }
}

function classifyStock(movement: StockMovement): { deltas: StockDelta[] } | { reason: string } {
  if (!hasText(movement.id) || !hasText(movement.evidenceId) || !hasText(movement.responsiblePersonId) || !hasText(movement.batchId) || !hasText(movement.productId) || !hasText(movement.unit)) {
    return { reason: 'Stock movement needs an id, batch, product, unit, person and evidence.' }
  }
  if (!isStockType(movement.type)) return { reason: 'Stock movement type is not recognised.' }
  if (!Number.isSafeInteger(movement.quantityMilli) || movement.quantityMilli <= 0) return { reason: 'Stock quantity must be a positive number of thousandths.' }
  const quantity = movement.quantityMilli
  if (movement.type === 'receipt' || movement.type === 'return') {
    if (!hasText(movement.toLocation)) return { reason: 'Stock coming in needs a place.' }
    return { deltas: [lineOf(movement.batchId, movement.productId, movement.toLocation, movement.unit, quantity, movement.type === 'receipt' ? 'receipt' : 'return')] }
  }
  if (movement.type === 'sale-delivery' || movement.type === 'mortality' || movement.type === 'theft' || movement.type === 'write-off' || movement.type === 'internal-use') {
    if (!hasText(movement.fromLocation)) return { reason: 'Stock leaving needs a place.' }
    const bucket: StockBucket = movement.type === 'sale-delivery' ? 'delivery' : 'loss'
    return { deltas: [lineOf(movement.batchId, movement.productId, movement.fromLocation, movement.unit, -quantity, bucket)] }
  }
  if (movement.type === 'transfer') {
    if (!hasText(movement.fromLocation) || !hasText(movement.toLocation) || movement.fromLocation === movement.toLocation) return { reason: 'A transfer needs two different places.' }
    return { deltas: [
      lineOf(movement.batchId, movement.productId, movement.fromLocation, movement.unit, -quantity, 'transfer-out'),
      lineOf(movement.batchId, movement.productId, movement.toLocation, movement.unit, quantity, 'transfer-in'),
    ] }
  }
  if (movement.type === 'processing') {
    const counterpart = movement.counterpart
    if (!hasText(movement.fromLocation) || !counterpart || !hasText(counterpart.batchId) || !hasText(counterpart.productId) || !hasText(counterpart.unit) || !hasText(counterpart.location)) {
      return { reason: 'Processing needs the resulting stock as its own quantity.' }
    }
    if (!Number.isSafeInteger(counterpart.quantityMilli) || counterpart.quantityMilli <= 0) return { reason: 'Processing needs the resulting stock as its own quantity.' }
    return { deltas: [
      lineOf(movement.batchId, movement.productId, movement.fromLocation, movement.unit, -quantity, 'processing-out'),
      lineOf(counterpart.batchId, counterpart.productId, counterpart.location, counterpart.unit, counterpart.quantityMilli, 'processing-in'),
    ] }
  }
  if (movement.type === 'count-adjustment') {
    if (movement.direction !== 'in' && movement.direction !== 'out') return { reason: 'A count adjustment must say whether stock moves in or out.' }
    if (!hasText(movement.reason) || !hasText(movement.countId) || !hasText(movement.fromLocation)) return { reason: 'A count adjustment needs a place, a reason and the count it explains.' }
    if (!joint(movement.approvedBy)) return { reason: 'A count adjustment needs the founder and the operating partner.' }
    const sign = movement.direction === 'in' ? 1 : -1
    return { deltas: [{
      batchId: movement.batchId,
      productId: movement.productId,
      location: movement.fromLocation,
      unit: movement.unit,
      expectedDelta: 0,
      adjustmentDelta: sign * quantity,
      bucket: 'adjustment',
    }] }
  }
  return { deltas: [] }
}

export function reconcilePartnerBooks(books: PartnerBooks): Reconciliation {
  const rejections: { id: string; reason: string }[] = []
  let hiddenOtherPartnerships = 0
  const own = <T extends { partnershipId: string }>(rows: readonly T[]) => {
    const kept: T[] = []
    for (const row of rows) {
      if (row.partnershipId === books.partnershipId) kept.push(row)
      else hiddenOtherPartnerships += 1
    }
    return kept
  }
  const cashOpenings = own(books.openings.cash)
  const stockOpenings = own(books.openings.stock)
  const cashEvents = own(books.cashEvents)
  const stockMovements = own(books.stockMovements)
  const cashCountRows = own(books.cashCounts)
  const stockCountRows = own(books.stockCounts)

  const balances = new Map<CustodyLocation, number>(CUSTODY_LOCATIONS.map((location) => [location, 0]))
  const cashBuckets = new Map<CustodyLocation, Map<CashBucket, number>>(CUSTODY_LOCATIONS.map((location) => [location, new Map()]))
  const openings = new Map<CustodyLocation, OpeningCash>()
  const cashDeltas = new Map<string, CashDelta[]>()
  const postedCashEvents: CashEvent[] = []
  const postedCash: PostedCash[] = []
  const seenCash = new Set<string>()

  const rejectCash = (id: string, reason: string) => {
    rejections.push({ id, reason })
  }

  const fits = (deltas: CashDelta[]) => {
    const next = new Map(balances)
    for (const delta of deltas) {
      const value = (next.get(delta.location) ?? 0) + delta.cents
      if (value < 0 || !Number.isSafeInteger(value)) return false
      next.set(delta.location, value)
    }
    return true
  }

  const commitCash = (event: CashEvent, deltas: CashDelta[]) => {
    for (const delta of deltas) {
      balances.set(delta.location, (balances.get(delta.location) ?? 0) + delta.cents)
      const buckets = cashBuckets.get(delta.location)
      if (buckets) buckets.set(delta.bucket, (buckets.get(delta.bucket) ?? 0) + delta.cents)
    }
    cashDeltas.set(event.id, deltas)
    postedCashEvents.push(event)
    postedCash.push({ id: event.id, kind: event.kind, cents: event.cents })
    seenCash.add(event.id)
  }

  for (const opening of cashOpenings) {
    if (!hasText(opening.evidenceId) || !hasText(opening.custodianId) || !isLocation(opening.location)) {
      rejectCash(opening.location, 'Opening cash needs a place, custodian and evidence.')
      continue
    }
    if (!Number.isSafeInteger(opening.cents) || opening.cents < 0) {
      rejectCash(opening.location, 'Opening cash must be zero or a positive number of cents.')
      continue
    }
    if (openings.has(opening.location)) {
      rejectCash(opening.location, 'Opening cash is already recorded for this place.')
      continue
    }
    openings.set(opening.location, opening)
    balances.set(opening.location, opening.cents)
  }

  const reversalActive = (id: string, trail: Set<string>): boolean => {
    if (trail.has(id)) return false
    const next = new Set(trail)
    next.add(id)
    const reversal = postedCashEvents.find((event) => event.kind === 'reversal' && event.reversesId === id)
    return Boolean(reversal && !reversalActive(reversal.id, next))
  }

  for (const event of cashEvents) {
    if (seenCash.has(event.id)) {
      rejectCash(event.id, 'Cash event id is already posted.')
      continue
    }
    if (event.kind === 'reversal') {
      if (!hasText(event.reversesId) || !hasText(event.id) || !hasText(event.evidenceId)) {
        rejectCash(event.id, 'Reversal needs the original event and evidence.')
        continue
      }
      const target = postedCashEvents.find((item) => item.id === event.reversesId)
      const targetDeltas = cashDeltas.get(event.reversesId)
      if (!target || !targetDeltas) {
        rejectCash(event.id, 'Reversal needs a posted event.')
        continue
      }
      if (target.cents !== event.cents) {
        rejectCash(event.id, 'Reversal must match the original amount.')
        continue
      }
      if (reversalActive(target.id, new Set())) {
        rejectCash(event.id, 'That event already has a reversal.')
        continue
      }
      const inverted = targetDeltas.map((delta) => ({ location: delta.location, bucket: 'reversal' as const, cents: -delta.cents }))
      if (!fits(inverted)) {
        rejectCash(event.id, 'That cash movement would take a custody place below zero.')
        continue
      }
      commitCash(event, inverted)
      continue
    }
    const classified = classifyCash(event)
    if ('reason' in classified) {
      rejectCash(event.id, classified.reason)
      continue
    }
    if (!fits(classified.deltas)) {
      rejectCash(event.id, 'That cash movement would take a custody place below zero.')
      continue
    }
    commitCash(event, classified.deltas)
  }

  const custodianFor = (location: CustodyLocation) => {
    let custodian = openings.get(location)?.custodianId ?? null
    for (const event of postedCashEvents) {
      if (event.kind !== 'handover' || event.destination !== location || !hasText(event.receivingCustodianId)) continue
      if (reversalActive(event.id, new Set())) continue
      custodian = event.receivingCustodianId
    }
    return custodian
  }

  const counts = new Map<CustodyLocation, CashCount>()
  const countEvidence = new Map<CustodyLocation, string[]>()
  for (const count of cashCountRows) {
    if (!isLocation(count.location) || !hasText(count.evidenceId) || !hasText(count.countedBy) || !Number.isSafeInteger(count.cents) || count.cents < 0) {
      rejectCash(count.id, 'Cash count needs a place, person, evidence and a zero or positive amount.')
      continue
    }
    counts.set(count.location, count)
    countEvidence.set(count.location, [...(countEvidence.get(count.location) ?? []), count.evidenceId])
  }

  const partnerBuckets = cashBuckets.get(PARTNER) ?? new Map()
  const officeBuckets = cashBuckets.get(OFFICE) ?? new Map()
  const partnerOther = { value: 0 }
  const officeOther = { value: 0 }
  const partnerNamed = new Set<CashBucket>(['sale-receipt', 'earlier-sale-collection', 'other-receipt', 'handover-in', 'reversal', 'expense', 'stock-purchase', 'handover-office-out', 'handover-other-out', 'direct-deposit-out'])
  const officeNamed = new Set<CashBucket>(['handover-in', 'office-receipt', 'reversal', 'office-spend', 'bank-handover-out'])
  for (const [bucket, cents] of partnerBuckets) if (!partnerNamed.has(bucket)) partnerOther.value += cents
  for (const [bucket, cents] of officeBuckets) if (!officeNamed.has(bucket)) officeOther.value += cents

  const partnerSafe: PartnerSafeEquation = {
    openingCents: openings.get(PARTNER)?.cents ?? 0,
    saleReceiptsCents: positiveIn(bucketSum(partnerBuckets, 'sale-receipt'), partnerOther),
    earlierCollectionsCents: positiveIn(bucketSum(partnerBuckets, 'earlier-sale-collection'), partnerOther),
    otherReceiptsCents: positiveIn(bucketSum(partnerBuckets, 'other-receipt'), partnerOther),
    handoversInCents: positiveIn(bucketSum(partnerBuckets, 'handover-in'), partnerOther),
    reversalNetCents: bucketSum(partnerBuckets, 'reversal'),
    otherNetCents: partnerOther.value,
    expensesCents: positiveOut(bucketSum(partnerBuckets, 'expense'), partnerOther),
    stockPurchasesCents: positiveOut(bucketSum(partnerBuckets, 'stock-purchase'), partnerOther),
    officeHandoversCents: positiveOut(bucketSum(partnerBuckets, 'handover-office-out'), partnerOther),
    otherHandoversOutCents: positiveOut(bucketSum(partnerBuckets, 'handover-other-out'), partnerOther),
    directDepositsCents: positiveOut(bucketSum(partnerBuckets, 'direct-deposit-out'), partnerOther),
    expectedCloseCents: balances.get(PARTNER) ?? 0,
    physicalCountCents: counts.get(PARTNER)?.cents ?? null,
    varianceCents: counts.has(PARTNER) ? (counts.get(PARTNER)?.cents ?? 0) - (balances.get(PARTNER) ?? 0) : null,
    custodianId: custodianFor(PARTNER),
    holds: false,
  }
  partnerSafe.otherNetCents = partnerOther.value
  partnerSafe.holds = cashEquationHolds(partnerSafe)

  const officeSafe: OfficeSafeEquation = {
    openingCents: openings.get(OFFICE)?.cents ?? 0,
    acceptedHandoversCents: positiveIn(bucketSum(officeBuckets, 'handover-in'), officeOther),
    officeReceiptsCents: positiveIn(bucketSum(officeBuckets, 'office-receipt'), officeOther),
    reversalNetCents: bucketSum(officeBuckets, 'reversal'),
    otherNetCents: officeOther.value,
    officeSpendCents: positiveOut(bucketSum(officeBuckets, 'office-spend'), officeOther),
    bankHandoversCents: positiveOut(bucketSum(officeBuckets, 'bank-handover-out'), officeOther),
    expectedCloseCents: balances.get(OFFICE) ?? 0,
    physicalCountCents: counts.get(OFFICE)?.cents ?? null,
    varianceCents: counts.has(OFFICE) ? (counts.get(OFFICE)?.cents ?? 0) - (balances.get(OFFICE) ?? 0) : null,
    custodianId: custodianFor(OFFICE),
    holds: false,
  }
  officeSafe.otherNetCents = officeOther.value
  officeSafe.holds = officeEquationHolds(officeSafe)

  const positions = new Map<string, Position>()
  const stockDeltas = new Map<string, StockDelta[]>()
  const postedStockEvents: StockMovement[] = []
  const postedStock: PostedStock[] = []
  const seenStock = new Set<string>()

  const blankPosition = (delta: StockDelta): Position => ({
    batchId: delta.batchId,
    productId: delta.productId,
    location: delta.location,
    unit: delta.unit,
    openingMilli: 0,
    buckets: new Map(),
    adjustmentMilli: 0,
    custodianId: null,
    countEvidence: [],
    latestCountId: null,
    physicalMilli: null,
    adjustmentCountIds: [],
  })
  const productConflict = (delta: StockDelta) => {
    const existing = positions.get(stockKey(delta.batchId, delta.location, delta.unit))
    if (existing && existing.productId !== delta.productId) return 'Stock product does not match the batch place.'
    return null
  }
  const materialise = (delta: StockDelta) => {
    const key = stockKey(delta.batchId, delta.location, delta.unit)
    if (!positions.has(key)) positions.set(key, blankPosition(delta))
  }

  const bookOf = (delta: StockDelta, extraExpected = 0, extraAdjustment = 0) => {
    const position = positions.get(stockKey(delta.batchId, delta.location, delta.unit))
    const expected = (position?.openingMilli ?? 0) + extraExpected + [...(position?.buckets.values() ?? [])].reduce((sum, value) => sum + value, 0)
    return expected + (position?.adjustmentMilli ?? 0) + extraAdjustment
  }

  const stockFits = (deltas: StockDelta[]) => {
    const grouped = new Map<string, { delta: StockDelta; expected: number; adjustment: number }>()
    for (const delta of deltas) {
      const key = stockKey(delta.batchId, delta.location, delta.unit)
      const current = grouped.get(key) ?? { delta, expected: 0, adjustment: 0 }
      current.expected += delta.expectedDelta
      current.adjustment += delta.adjustmentDelta
      grouped.set(key, current)
    }
    for (const group of grouped.values()) {
      const next = bookOf(group.delta, group.expected, group.adjustment)
      if (next < 0 || !Number.isSafeInteger(next)) return false
    }
    return true
  }

  const commitStock = (movement: StockMovement, deltas: StockDelta[]) => {
    for (const delta of deltas) {
      materialise(delta)
      const position = positions.get(stockKey(delta.batchId, delta.location, delta.unit))
      if (!position) continue
      if (delta.bucket === 'adjustment') position.adjustmentMilli += delta.adjustmentDelta
      else position.buckets.set(delta.bucket, (position.buckets.get(delta.bucket) ?? 0) + delta.expectedDelta)
      if (movement.type === 'count-adjustment' && hasText(movement.countId)) position.adjustmentCountIds.push(movement.countId)
      if (!reversalWillSkip(movement)) position.custodianId = movement.responsiblePersonId
    }
    stockDeltas.set(movement.id, deltas)
    postedStockEvents.push(movement)
    postedStock.push({ id: movement.id, type: movement.type, quantityMilli: movement.quantityMilli })
    seenStock.add(movement.id)
  }

  function reversalWillSkip(movement: StockMovement) {
    return movement.type === 'reversal'
  }

  const stockReversalActive = (id: string, trail: Set<string>): boolean => {
    if (trail.has(id)) return false
    const next = new Set(trail)
    next.add(id)
    const reversal = postedStockEvents.find((event) => event.type === 'reversal' && event.reversesId === id)
    return Boolean(reversal && !stockReversalActive(reversal.id, next))
  }

  for (const opening of stockOpenings) {
    if (!hasText(opening.batchId) || !hasText(opening.productId) || !hasText(opening.unit) || !hasText(opening.location) || !hasText(opening.custodianId) || !hasText(opening.evidenceId)) {
      rejections.push({ id: opening.batchId, reason: 'Opening stock needs a batch, place, custodian and evidence.' })
      continue
    }
    if (!Number.isSafeInteger(opening.quantityMilli) || opening.quantityMilli < 0) {
      rejections.push({ id: opening.batchId, reason: 'Opening stock must be zero or a positive quantity.' })
      continue
    }
    const key = stockKey(opening.batchId, opening.location, opening.unit)
    if (positions.has(key)) {
      rejections.push({ id: opening.batchId, reason: 'Opening stock is already recorded for this batch and place.' })
      continue
    }
    positions.set(key, {
      batchId: opening.batchId,
      productId: opening.productId,
      location: opening.location,
      unit: opening.unit,
      openingMilli: opening.quantityMilli,
      buckets: new Map(),
      adjustmentMilli: 0,
      custodianId: opening.custodianId,
      countEvidence: [],
      latestCountId: null,
      physicalMilli: null,
      adjustmentCountIds: [],
    })
  }

  const negativeExceptions: CustodyException[] = []

  for (const movement of stockMovements) {
    if (seenStock.has(movement.id)) {
      rejections.push({ id: movement.id, reason: 'Stock movement id is already posted.' })
      continue
    }
    if (movement.type === 'reversal') {
      if (!hasText(movement.reversesId) || !hasText(movement.id) || !hasText(movement.evidenceId)) {
        rejections.push({ id: movement.id, reason: 'Reversal needs the original movement and evidence.' })
        continue
      }
      const target = postedStockEvents.find((item) => item.id === movement.reversesId)
      const targetDeltas = stockDeltas.get(movement.reversesId)
      if (!target || !targetDeltas) {
        rejections.push({ id: movement.id, reason: 'Reversal needs a posted movement.' })
        continue
      }
      if (target.quantityMilli !== movement.quantityMilli) {
        rejections.push({ id: movement.id, reason: 'Reversal must match the original quantity.' })
        continue
      }
      if (stockReversalActive(target.id, new Set())) {
        rejections.push({ id: movement.id, reason: 'That movement already has a reversal.' })
        continue
      }
      const inverted = targetDeltas.map((delta) => ({
        ...delta,
        expectedDelta: -delta.expectedDelta,
        adjustmentDelta: -delta.adjustmentDelta,
        bucket: delta.bucket === 'adjustment' ? 'adjustment' as const : 'reversal' as const,
      }))
      const productMismatch = inverted.map(productConflict).find((reason) => reason)
      if (productMismatch) {
        rejections.push({ id: movement.id, reason: productMismatch })
        continue
      }
      if (!stockFits(inverted)) {
        rejections.push({ id: movement.id, reason: 'That stock movement would take a batch below zero.' })
        continue
      }
      commitStock(movement, inverted)
      continue
    }

    const classified = classifyStock(movement)
    if ('reason' in classified) {
      rejections.push({ id: movement.id, reason: classified.reason })
      continue
    }
    const productMismatch = classified.deltas.map(productConflict).find((reason) => reason)
    if (productMismatch) {
      rejections.push({ id: movement.id, reason: productMismatch })
      continue
    }
    if (!stockFits(classified.deltas)) {
      const override = movement.negativeOverride
      if (!override || !hasText(override.reason) || !hasText(override.evidenceId) || !joint(override.approvedBy)) {
        rejections.push({ id: movement.id, reason: 'That stock movement would take a batch below zero.' })
        continue
      }
      commitStock(movement, classified.deltas)
      const after = classified.deltas.reduce((lowest, delta) => Math.min(lowest, bookOf(delta)), 0)
      negativeExceptions.push({
        id: `negative:${movement.id}`,
        kind: 'negative-stock-override',
        partnershipId: books.partnershipId,
        subject: movement.batchId,
        expected: 0,
        actual: after,
        variance: after,
        custodianId: movement.responsiblePersonId,
        evidenceIds: [movement.evidenceId, override.evidenceId],
        status: 'open',
        closableByDeletion: false,
      })
      continue
    }
    commitStock(movement, classified.deltas)
  }

  for (const count of stockCountRows) {
    if (!hasText(count.batchId) || !hasText(count.productId) || !hasText(count.location) || !hasText(count.unit) || !hasText(count.countedBy) || !hasText(count.evidenceId)) {
      rejections.push({ id: count.id, reason: 'Stock count needs a batch, place, person and evidence.' })
      continue
    }
    if (!Number.isSafeInteger(count.quantityMilli) || count.quantityMilli < 0) {
      rejections.push({ id: count.id, reason: 'Stock count must be zero or a positive quantity.' })
      continue
    }
    const counted: StockDelta = { batchId: count.batchId, productId: count.productId, location: count.location, unit: count.unit, expectedDelta: 0, adjustmentDelta: 0, bucket: 'receipt' }
    const mismatch = productConflict(counted)
    if (mismatch) {
      rejections.push({ id: count.id, reason: mismatch })
      continue
    }
    const position = positions.get(stockKey(count.batchId, count.location, count.unit))
    if (!position) {
      materialise(counted)
    }
    const countedPosition = positions.get(stockKey(count.batchId, count.location, count.unit))
    if (!countedPosition) continue
    countedPosition.physicalMilli = count.quantityMilli
    countedPosition.latestCountId = count.id
    countedPosition.countEvidence.push(count.evidenceId)
  }

  for (const position of positions.values()) {
    let custodian = position.custodianId
    const opening = stockOpenings.find((item) => item.batchId === position.batchId && item.location === position.location && item.unit === position.unit)
    if (opening) custodian = opening.custodianId
    for (const movement of postedStockEvents) {
      if (stockReversalActive(movement.id, new Set())) continue
      const deltas = stockDeltas.get(movement.id) ?? []
      if (deltas.some((delta) => delta.batchId === position.batchId && delta.location === position.location && delta.unit === position.unit)) custodian = movement.responsiblePersonId
    }
    position.custodianId = custodian
  }

  const stock: StockLine[] = [...positions.values()].map((position) => {
    const other = { value: 0 }
    const named = new Set<StockBucket>(['receipt', 'transfer-in', 'transfer-out', 'delivery', 'return', 'loss', 'processing-in', 'processing-out', 'reversal'])
    for (const [bucket, value] of position.buckets) if (!named.has(bucket)) other.value += value
    const expected = position.openingMilli + [...position.buckets.values()].reduce((sum, value) => sum + value, 0)
    const line: StockLine = {
      batchId: position.batchId,
      productId: position.productId,
      location: position.location,
      unit: position.unit,
      openingMilli: position.openingMilli,
      receiptsMilli: positiveIn(position.buckets.get('receipt') ?? 0, other),
      transfersInMilli: positiveIn(position.buckets.get('transfer-in') ?? 0, other),
      transfersOutMilli: positiveOut(position.buckets.get('transfer-out') ?? 0, other),
      deliveriesMilli: positiveOut(position.buckets.get('delivery') ?? 0, other),
      returnsMilli: positiveIn(position.buckets.get('return') ?? 0, other),
      lossesMilli: positiveOut(position.buckets.get('loss') ?? 0, other),
      processingInMilli: positiveIn(position.buckets.get('processing-in') ?? 0, other),
      processingOutMilli: positiveOut(position.buckets.get('processing-out') ?? 0, other),
      reversalNetMilli: position.buckets.get('reversal') ?? 0,
      otherNetMilli: other.value,
      expectedMilli: expected,
      adjustmentMilli: position.adjustmentMilli,
      bookMilli: expected + position.adjustmentMilli,
      physicalMilli: position.physicalMilli,
      varianceMilli: position.physicalMilli === null ? null : position.physicalMilli - expected,
      custodianId: position.custodianId,
      holds: false,
    }
    line.otherNetMilli = other.value
    line.holds = stockEquationHolds(line)
    return line
  })

  const exceptions: CustodyException[] = [...negativeExceptions]
  for (const location of CUSTODY_LOCATIONS) {
    const equation = location === PARTNER ? partnerSafe : location === OFFICE ? officeSafe : null
    const physical = equation ? equation.physicalCountCents : counts.get(location)?.cents ?? null
    const expected = balances.get(location) ?? 0
    const variance = physical === null ? null : physical - expected
    if (variance === null || variance === 0) continue
    exceptions.push({
      id: `cash:${location}`,
      kind: 'cash-variance',
      partnershipId: books.partnershipId,
      subject: location,
      expected,
      actual: physical ?? 0,
      variance,
      custodianId: location === PARTNER || location === OFFICE ? equation?.custodianId ?? null : custodianFor(location),
      evidenceIds: countEvidence.get(location) ?? [],
      status: 'open',
      closableByDeletion: false,
    })
  }

  for (const line of stock) {
    const position = positions.get(stockKey(line.batchId, line.location, line.unit))
    if (line.varianceMilli === null || line.varianceMilli === 0 || !position) continue
    const explained = line.adjustmentMilli === line.varianceMilli && position.latestCountId !== null && position.adjustmentCountIds.includes(position.latestCountId)
    exceptions.push({
      id: `stock:${line.batchId}:${line.location}:${line.unit}`,
      kind: 'stock-variance',
      partnershipId: books.partnershipId,
      subject: line.batchId,
      expected: line.expectedMilli,
      actual: line.physicalMilli ?? 0,
      variance: line.varianceMilli,
      custodianId: line.custodianId,
      evidenceIds: position.countEvidence,
      status: explained ? 'explained' : 'open',
      closableByDeletion: false,
    })
  }

  if (!partnerSafe.holds || !officeSafe.holds || stock.some((line) => !line.holds)) {
    exceptions.push({
      id: 'equation-break',
      kind: 'cash-variance',
      partnershipId: books.partnershipId,
      subject: 'equation',
      expected: 0,
      actual: 0,
      variance: 0,
      custodianId: null,
      evidenceIds: [],
      status: 'open',
      closableByDeletion: false,
    })
  }

  const cash: CashPosition[] = CUSTODY_LOCATIONS.map((location) => {
    const expectedCents = balances.get(location) ?? 0
    const physicalCountCents = counts.get(location)?.cents ?? null
    return {
      location,
      expectedCents,
      physicalCountCents,
      varianceCents: physicalCountCents === null ? null : physicalCountCents - expectedCents,
      custodianId: custodianFor(location),
    }
  })

  return {
    moduleId: '007',
    partnershipId: books.partnershipId,
    moneyMoved: false,
    executes: false,
    hiddenOtherPartnerships,
    cash,
    stock,
    partnerSafe,
    officeSafe,
    postedCash,
    postedStock,
    rejections,
    exceptions,
  }
}
