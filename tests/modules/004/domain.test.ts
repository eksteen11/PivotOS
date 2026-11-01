import assert from 'node:assert/strict'
import { test } from 'node:test'
import { approvalStillCovers, decideMargin } from '../../../lib/modules/004/approval'
import { WORKBOOK_MASTER_FORMULAS } from '../../../lib/modules/004/contract'
import { captureEnquiry, classifyQueueItem, emptyDraft, enquiryStage, type EnquiryDraft } from '../../../lib/modules/004/enquiry'
import { appendStage, reconcileDelivery } from '../../../lib/modules/004/fulfilment'
import { planFulfilment, proposeMatch } from '../../../lib/modules/004/match'
import { recomputeWorkbookLine, workbookBrokenSummary, workbookCacheMatchesKilogramHeader, workbookExVatDifference } from '../../../lib/modules/004/pricing'
import { COMMERCIAL_STAGES, stageForProcess } from '../../../lib/engines/stages'

function draft(overrides: Partial<EnquiryDraft> & Pick<EnquiryDraft, 'side'>): EnquiryDraft {
  return {
    ...emptyDraft(overrides.side, overrides.id || overrides.side),
    productText: 'Oats',
    quantityText: '30',
    unit: 'tonne',
    gradeText: 'feed grade',
    qualityLevel: '3',
    qualitySource: 'Laboratory certificate',
    packagingText: 'Losmaat',
    placeText: overrides.side === 'supply' ? 'Piketberg collection' : 'Malmesbury delivery',
    priceText: overrides.side === 'supply' ? '4000' : '5750',
    vatTreatment: 'exclusive',
    counterpartyName: overrides.side === 'supply' ? 'Sarel Venter' : 'Anna Buyer',
    commercialRole: 'principal',
    originalWording: overrides.side === 'supply' ? 'Hawer losmaat' : 'Soek hawer',
    ...overrides,
  }
}

const waive = ['loading', 'storage_handling', 'agent_commission', 'insurance', 'finance_cost', 'export_shipping', 'other'] as const

test('workbook formulas are recomputed and the cached VAT and kilogram header are not trusted', () => {
  assert.equal(WORKBOOK_MASTER_FORMULAS.length, 16)
  assert.equal(WORKBOOK_MASTER_FORMULAS.find((row) => row.cell === 'J26')?.formula, 'G26/#REF!')
  assert.deepEqual(workbookBrokenSummary(), { usable: false, cell: 'J26', formula: 'G26/#REF!' })
  const line = recomputeWorkbookLine({ qtyMilli: 30000, factorMilli: 1000, rateCents: 575000, vatTreatment: 'exclusive', vatRateBps: 1500, vatRateVersion: 'workbook-hardcoded-15pct' })
  assert.equal(line.exVatCents, 17250000)
  assert.equal(line.vatCents, 2587500)
  assert.equal(line.inclusiveCents, 19837500)
  assert.equal(line.pricePerOriginalQtyCents, 575000)
  assert.equal(line.isDeliveredMargin, false)
  const withoutRate = recomputeWorkbookLine({ qtyMilli: 30000, factorMilli: 1000, rateCents: 575000, vatTreatment: 'unknown', vatRateBps: null, vatRateVersion: null })
  assert.equal(withoutRate.vatCents, null)
  assert.equal(withoutRate.status, 'vat_unknown')
  assert.equal(recomputeWorkbookLine({ qtyMilli: null, factorMilli: 1000, rateCents: 575000, vatTreatment: 'unknown', vatRateBps: null, vatRateVersion: null }).exVatCents, null)
  const zero = recomputeWorkbookLine({ qtyMilli: 0, factorMilli: 1000, rateCents: 575000, vatTreatment: 'unknown', vatRateBps: null, vatRateVersion: null })
  assert.equal(zero.status, 'div0')
  assert.equal(zero.pricePerOriginalQtyCents, null)
  assert.equal(workbookCacheMatchesKilogramHeader(30, 5750, 172500), false)
  const asKilograms = recomputeWorkbookLine({ qtyMilli: 30000, factorMilli: 1000000, rateCents: 575000, vatTreatment: 'unknown', vatRateBps: null, vatRateVersion: null })
  assert.notEqual(asKilograms.exVatCents, 17250000)
  const selling = recomputeWorkbookLine({ qtyMilli: 30000, factorMilli: 1000, rateCents: 575000, vatTreatment: 'not_applicable', vatRateBps: null, vatRateVersion: 'stated' })
  const firstCost = recomputeWorkbookLine({ qtyMilli: 30000, factorMilli: 1000, rateCents: 395000, vatTreatment: 'not_applicable', vatRateBps: null, vatRateVersion: 'stated' })
  const secondCost = recomputeWorkbookLine({ qtyMilli: 30000, factorMilli: 1000, rateCents: 85000, vatTreatment: 'not_applicable', vatRateBps: null, vatRateVersion: 'stated' })
  const wins = workbookExVatDifference(selling.exVatCents, (firstCost.exVatCents ?? 0) + (secondCost.exVatCents ?? 0))
  assert.equal(wins.cents, 2850000)
  assert.equal(wins.isDeliveredMargin, false)
})

test('a delivered margin keeps unknown costs unknown and shows per unit and total', () => {
  const supply = captureEnquiry(draft({ side: 'supply' }))
  const demand = captureEnquiry(draft({ side: 'demand' }))
  assert.ok(!('error' in supply) && !('error' in demand))
  if ('error' in supply || 'error' in demand) return
  assert.equal(supply.enquiry.productKey, 'oats')
  assert.equal(supply.enquiry.productOriginal, 'Oats')
  assert.equal(supply.enquiry.originalWording, 'Hawer losmaat')
  assert.equal(supply.enquiry.packagingKey, 'bulk')
  assert.equal(supply.enquiry.company, 'farm-feed')
  const blocked = proposeMatch(supply.enquiry, demand.enquiry, { minimumMarginBps: 500 })
  assert.equal(blocked.margin.isDeliveredMargin, false)
  assert.equal(blocked.margin.scenarios[1].profitCents, null)
  assert.ok(blocked.margin.unknown.includes('transport'))
  const proposal = proposeMatch(supply.enquiry, demand.enquiry, { transportCents: 1500000, waivedCosts: [...waive], minimumMarginBps: 500 })
  assert.equal(proposal.stage.key, 'match')
  assert.ok(COMMERCIAL_STAGES.some((stage) => stage.key === proposal.stage.key))
  assert.equal(proposal.margin.scenarios[1].profitCents, 3750000)
  assert.equal(proposal.margin.scenarios[1].profitPerUnitCents, 125000)
  assert.equal(proposal.margin.scenarios[0].profitCents, proposal.margin.scenarios[2].profitCents)
  assert.match(proposal.margin.sensitivity, /No transport band/)
  assert.equal(proposal.sends, false)
  assert.equal(proposal.draftMessage.includes('Sarel Venter'), false)
  assert.equal(proposal.draftMessage.includes('Anna Buyer'), false)
  assert.equal(proposal.internalParties.supply, 'Sarel Venter')
  const band = proposeMatch(supply.enquiry, demand.enquiry, { transportCents: 1500000, transportLowCents: 1000000, transportHighCents: 2000000, waivedCosts: [...waive], minimumMarginBps: 500 })
  assert.equal(band.margin.scenarios[0].profitCents, 4250000)
  assert.equal(band.margin.scenarios[2].profitCents, 3250000)
  const lowPrice = proposeMatch(supply.enquiry, captureEnquiry(draft({ side: 'demand', priceText: '4100' })).enquiry, { transportCents: 600000, waivedCosts: [...waive], minimumMarginBps: 500 })
  assert.match(lowPrice.margin.reasons.join(' '), /below the stated minimum/)
  assert.notEqual(lowPrice.margin.scenarios[1].profitCents, 0)
})

test('matching explains quantity, quality, units and does not sort suppliers by price', () => {
  const demand = captureEnquiry(draft({ side: 'demand', quantityText: '30', acceptsSubstitutesText: 'hay' }))
  const shortSupply = captureEnquiry(draft({ side: 'supply', id: 'short', quantityText: '10', qualityLevel: '1', qualitySource: 'Seller said so' }))
  const other = captureEnquiry(draft({ side: 'supply', id: 'dear', quantityText: '25', priceText: '5000' }))
  const hay = captureEnquiry(draft({ side: 'supply', id: 'hay', productText: 'oat hay', quantityText: '30' }))
  assert.ok(!('error' in demand) && !('error' in shortSupply) && !('error' in other) && !('error' in hay))
  if ('error' in demand || 'error' in shortSupply || 'error' in other || 'error' in hay) return
  const partial = proposeMatch(shortSupply.enquiry, demand.enquiry, { transportCents: 1, waivedCosts: [...waive], minimumMarginBps: 100 })
  assert.ok(partial.matchTypes.includes('partial_quantity'))
  assert.match(partial.compromises.join(' '), /part of the demand/)
  assert.match(partial.compromises.join(' '), /not document-confirmed/)
  const plan = planFulfilment(demand.enquiry, [other.enquiry, shortSupply.enquiry, hay.enquiry])
  assert.deepEqual(plan.slices.map((slice) => slice.supplyId), ['dear', 'short'])
  assert.equal(plan.uncoveredGrams, 0)
  assert.match(plan.notes.join(' '), /not from cheapest/)
  const bale = captureEnquiry(draft({ side: 'supply', unit: 'bale', quantityText: '12', kgPerBaleText: '' }))
  assert.ok(!('error' in bale))
  if ('error' in bale) return
  assert.match(proposeMatch(bale.enquiry, demand.enquiry).hardMismatches.join(' '), /bale/i)
  const grams = captureEnquiry(draft({ side: 'demand', unit: 'kg', quantityText: '30000', priceText: '5.75' }))
  assert.ok(!('error' in grams))
  if ('error' in grams) return
  assert.match(proposeMatch(captureEnquiry(draft({ side: 'supply' })).enquiry, grams.enquiry).hardMatches.join(' '), /covers the requested quantity/)
  assert.equal(enquiryStage(captureEnquiry(draft({ side: 'demand', quantityText: '' })).enquiry).key, 'intake')
})

test('approval is explicit, drifts when facts change, and never executes', async () => {
  const supply = captureEnquiry(draft({ side: 'supply' }))
  const demand = captureEnquiry(draft({ side: 'demand' }))
  assert.ok(!('error' in supply) && !('error' in demand))
  if ('error' in supply || 'error' in demand) return
  const proposal = proposeMatch(supply.enquiry, demand.enquiry, { transportCents: 1500000, waivedCosts: [...waive], minimumMarginBps: 500 })
  assert.equal('error' in await decideMargin({ proposal, outcome: 'approved', approver: 'Pivot', at: '2026-10-25T12:00:00Z' }), true)
  const incomplete = proposeMatch(supply.enquiry, demand.enquiry, { minimumMarginBps: 500 })
  assert.equal('error' in await decideMargin({ proposal: incomplete, outcome: 'approved', approver: 'Drikus', at: '2026-10-25T12:00:00Z' }), true)
  const approved = await decideMargin({ proposal, outcome: 'approved', approver: 'Drikus', at: '2026-10-25T12:00:00Z' })
  assert.ok(!('error' in approved))
  if ('error' in approved) return
  assert.equal(approved.execution, 'not_executed')
  assert.equal(approved.sends, false)
  assert.equal(approved.ledgerPosted, false)
  assert.equal(approved.identityReleased, false)
  assert.equal(await approvalStillCovers(approved, proposal), true)
  const changed = proposeMatch(supply.enquiry, demand.enquiry, { transportCents: 1600000, waivedCosts: [...waive], minimumMarginBps: 500 })
  assert.equal(await approvalStillCovers(approved, changed), false)
  const bank = captureEnquiry(draft({ side: 'supply', originalWording: 'Please pay account 123456789' }))
  assert.ok('error' in bank)
  if (!('error' in bank)) return
  assert.equal(bank.error.includes('123456789'), false)
})

test('delivery uses the delivered quantity and shared queue stages do not pay or send', () => {
  const closed = reconcileDelivery({ instructed: { milli: 30000, unit: 'tonne' }, loaded: { milli: 30000, unit: 'tonne' }, delivered: { milli: 30000, unit: 'tonne' }, kgPerBaleMilli: null, proofOfDelivery: 'WB-1', qualityRejected: false, marginApproved: true })
  assert.equal(closed.canClose, true)
  assert.equal(closed.stage.key, 'close')
  assert.equal(closed.execution, 'not_executed')
  const short = reconcileDelivery({ instructed: { milli: 30000, unit: 'tonne' }, loaded: { milli: 29000, unit: 'tonne' }, delivered: { milli: 29000, unit: 'tonne' }, kgPerBaleMilli: null, proofOfDelivery: 'WB-1', qualityRejected: false, marginApproved: true })
  assert.equal(short.outcome, 'short')
  assert.equal(short.canClose, false)
  const missing = reconcileDelivery({ instructed: { milli: 30000, unit: 'tonne' }, loaded: null, delivered: null, kgPerBaleMilli: null, proofOfDelivery: '', qualityRejected: false, marginApproved: false })
  assert.match(missing.reasons.join(' '), /not used as the actual quantity/)
  const queue = classifyQueueItem('Betaal', 'Transporter invoice')
  assert.equal(queue.ledger, 'clark')
  assert.equal(queue.execution, 'not_executed')
  assert.equal(queue.stage, stageForProcess('Betaal Transporter invoice', '004', 'finance'))
  assert.equal(classifyQueueItem('Soek', 'Match an oat hay enquiry').stage, 'match')
  assert.throws(() => appendStage([{ id: 'a', stage: 'intake', at: '2026-10-25T12:00:00Z', reason: 'Captured', evidence: 'Enquiry' }], { id: 'a', stage: 'qualify', at: '2026-10-25T12:01:00Z', reason: 'Duplicate', evidence: 'None' }))
})
