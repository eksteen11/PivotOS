import assert from 'node:assert/strict'
import { test } from 'node:test'
import { recommendCeiling } from '../../../lib/modules/006/ceiling'
import { createCostLine, sumRole } from '../../../lib/modules/006/costs'
import { applyDeskAction, autoRaiseCeiling, ceilingFor, exampleCeilingCents, exampleDeskState, visibleToCompany } from '../../../lib/modules/006/desk'
import { achievedSaleRange, createEvidencePoint, presentEvidence } from '../../../lib/modules/006/evidence'
import { captureOpportunity, wrongLaneMessage } from '../../../lib/modules/006/opportunity'

const baseCeiling = {
  conservativeExitCents: 100_000_000,
  exitEvidenceGrade: 'registered_transfer' as const,
  sellingCostCents: 5_000_000,
  otherKnownCostCents: 8_000_000,
  unknownCostNames: [] as string[],
  provisionalCostNames: [] as string[],
  minimumNetProfitCents: 15_000_000,
  marginOfSafetyBps: 1000,
  minimumReturnOnCashBps: 2000,
  maximumCapitalCents: 20_000_000,
  depositBps: 1000,
  immediateNonPurchaseCents: 2_000_000,
  formulaReviewed: true,
}

test('asking prices, estimates, municipal values and auction claims are not achieved sales', () => {
  const asking = createEvidencePoint({ id: 'asking', grade: 'active_asking_price', amountCents: 120_000_000, adjustmentCents: null, adjustmentStated: false, source: 'Listing', sourceDate: '2026-10-01', originalWording: 'Asking R1 200 000' })
  const auction = createEvidencePoint({ id: 'auction', grade: 'auction_marketing_claim', amountCents: 90_000_000, adjustmentCents: null, adjustmentStated: false, source: 'Brochure', sourceDate: '2026-10-02', originalWording: 'Claims R900 000' })
  const automated = createEvidencePoint({ id: 'auto', grade: 'automated_estimate', amountCents: 110_000_000, adjustmentCents: null, adjustmentStated: false, source: 'Portal estimate', sourceDate: '2026-10-03', originalWording: 'Estimate R1 100 000' })
  const municipal = createEvidencePoint({ id: 'municipal', grade: 'municipal_valuation', amountCents: 70_000_000, adjustmentCents: null, adjustmentStated: false, source: 'Municipal roll', sourceDate: '2026-10-04', originalWording: 'Municipal value R700 000' })
  assert.equal(asking.ok && auction.ok && automated.ok && municipal.ok, true)
  if (!asking.ok || !auction.ok || !automated.ok || !municipal.ok) return
  assert.match(presentEvidence(asking.point).caution, /not an achieved sale/)
  assert.match(presentEvidence(auction.point).caution, /cannot set the achieved-sale range/)
  assert.match(presentEvidence(automated.point).caution, /cannot set the achieved-sale range/)
  assert.match(presentEvidence(municipal.point).caution, /cannot set the achieved-sale range/)
  const range = achievedSaleRange([asking.point, auction.point, automated.point, municipal.point])
  assert.equal(range.lowCents, null)
  assert.equal(range.highCents, null)
  assert.equal(range.professionalValuation, false)
  assert.match(range.statement, /not filled with an estimate/)
  assert.equal(createEvidencePoint({ id: 'bad', grade: 'active_asking_price', amountCents: 1, adjustmentCents: 0, adjustmentStated: true, source: 'Listing', sourceDate: '2026-10-01', originalWording: 'Asking' }).ok, false)
})

test('an unstated adjustment is not zero and unknown costs are not summed as zero', () => {
  const unstated = createEvidencePoint({ id: 'sale', grade: 'registered_transfer', amountCents: 100_000_000, adjustmentCents: null, adjustmentStated: false, source: 'Deeds office', sourceDate: '2026-08-01', originalWording: 'Registered at R1 000 000' })
  assert.equal(unstated.ok, true)
  if (!unstated.ok) return
  assert.equal(achievedSaleRange([unstated.point]).lowCents, null)
  const silentZero = createCostLine({ id: 'arrears', name: 'Municipal arrears', role: 'other', status: 'unknown', amountCents: 0 })
  assert.equal(silentZero.ok, false)
  const assumedZero = createCostLine({ id: 'sheriff', name: 'Sheriff fee', role: 'other', status: 'known', amountCents: 0, source: 'Fee sheet' })
  assert.equal(assumedZero.ok, false)
  const explicitZero = createCostLine({ id: 'sheriff', name: 'Sheriff fee', role: 'other', status: 'known', amountCents: 0, explicitZero: true, source: 'Fee sheet says nil' })
  const unknown = createCostLine({ id: 'arrears', name: 'Municipal arrears', role: 'other', status: 'unknown' })
  const known = createCostLine({ id: 'transfer', name: 'Transfer and auction costs', role: 'other', status: 'known', amountCents: 8_000_000, source: 'Example cost sheet' })
  assert.equal(explicitZero.ok && unknown.ok && known.ok, true)
  if (!explicitZero.ok || !unknown.ok || !known.ok) return
  const sum = sumRole([explicitZero.line, unknown.line, known.line], 'other')
  assert.equal(sum.ok, false)
  if (sum.ok) return
  assert.deepEqual(sum.unknown, ['Municipal arrears'])
  assert.equal(sumRole([known.line], 'other').ok && sumRole([known.line], 'other').cents, 8_000_000)
})

test('the ceiling uses sale evidence, reviewed assumptions and the lower of profit, return and capital', () => {
  assert.deepEqual(recommendCeiling(baseCeiling), { cents: 62_000_000, binding: 'profit', blockers: [], formulaVersion: '006-bid-ceiling-v1' })
  assert.equal(recommendCeiling({ ...baseCeiling, maximumCapitalCents: 5_000_000 }).cents, 30_000_000)
  assert.equal(recommendCeiling({ ...baseCeiling, maximumCapitalCents: 5_000_000 }).binding, 'capital')
  const unknown = recommendCeiling({ ...baseCeiling, unknownCostNames: ['Municipal arrears'], otherKnownCostCents: null })
  assert.equal(unknown.cents, null)
  assert.match(unknown.blockers.join(' '), /Municipal arrears is unknown and was not treated as zero/)
  assert.equal(recommendCeiling({ ...baseCeiling, provisionalCostNames: ['Renovation'], otherKnownCostCents: null }).cents, null)
  assert.equal(recommendCeiling({ ...baseCeiling, exitEvidenceGrade: 'active_asking_price' }).cents, null)
  assert.equal(recommendCeiling({ ...baseCeiling, exitEvidenceGrade: 'automated_estimate' }).cents, null)
  assert.equal(recommendCeiling({ ...baseCeiling, exitEvidenceGrade: 'municipal_valuation' }).cents, null)
  assert.equal(recommendCeiling({ ...baseCeiling, formulaReviewed: false }).cents, null)
  assert.equal(recommendCeiling({ ...baseCeiling, conservativeExitCents: null, exitEvidenceGrade: null }).cents, null)
})

test('module 006 stays on DigiKraal principal property and keeps Northpoint out', () => {
  const northpoint = captureOpportunity({ id: 'agency', company: 'northpoint', role: 'agency', name: 'Listing', address: '1 Agent Road', propertyType: 'House', source: 'Mandate', channel: 'referral', strategy: 'auction_flip', nextAction: 'Call the seller', preparedBy: 'Agent' })
  const personal = captureOpportunity({ id: 'home', company: 'personal', role: 'principal', name: 'Home', address: '1 Private Road', propertyType: 'House', source: 'Note', channel: 'referral', strategy: 'buy_and_hold', nextAction: 'Think', preparedBy: 'Founder' })
  assert.equal(northpoint.ok, false)
  assert.equal(personal.ok, false)
  if (northpoint.ok || personal.ok) return
  assert.equal(northpoint.error, wrongLaneMessage)
  assert.equal(personal.error, wrongLaneMessage)
  const first = captureOpportunity({ id: 'one', company: 'digikraal', role: 'principal', name: 'Example', address: '1 Example Street, Exampleton', propertyType: 'House', source: 'Notice', channel: 'auction', strategy: 'auction_flip', nextAction: 'Research', preparedBy: 'Deal preparer' })
  assert.equal(first.ok, true)
  if (!first.ok) return
  const second = captureOpportunity({ id: 'two', company: 'digikraal', role: 'principal', name: 'Repeat', address: '  1   example street, exampleton ', propertyType: 'House', source: 'Notice', channel: 'auction', strategy: 'auction_flip', nextAction: 'Research', preparedBy: 'Deal preparer' }, [first.opportunity])
  assert.equal(second.ok && second.duplicateOf, 'one')
  assert.equal(first.opportunity.company, 'digikraal')
  assert.equal(first.opportunity.role, 'principal')
  const desk = exampleDeskState()
  assert.equal(visibleToCompany(desk, 'digikraal')?.opportunity.id, desk.opportunity.id)
  assert.equal(visibleToCompany(desk, 'northpoint'), null)
  assert.equal(visibleToCompany(desk, 'personal'), null)
  assert.equal(visibleToCompany(desk, 'farm-feed'), null)
})

test('a reviewed ceiling cannot be self-approved, raised, or turned into a bid, contract or payment', () => {
  let state = exampleDeskState()
  assert.equal(ceilingFor(state).cents, null)
  assert.match(achievedSaleRange(state.evidence).statement, /No achieved-sale range/)
  state = applyDeskAction(state, { type: 'add-sale-evidence', amountRands: '1000000', adjustmentRands: '', source: 'Deeds office example', sourceDate: '2026-08-01', grade: 'registered_transfer', at: '2026-10-25T12:00:00.000Z' })
  assert.match(state.alert, /not treated as zero/)
  assert.equal(state.version, 1)
  state = applyDeskAction(state, { type: 'add-sale-evidence', amountRands: '1000000', adjustmentRands: '0', source: 'Deeds office example', sourceDate: '2026-08-01', grade: 'registered_transfer', at: '2026-10-25T12:00:00.000Z' })
  assert.equal(state.alert, '')
  assert.equal(state.version, 2)
  state = applyDeskAction(state, { type: 'set-cost-known', costId: 'cost-arrears', amountRands: '25000', source: 'Municipal statement example', at: '2026-10-25T12:05:00.000Z' })
  assert.equal(ceilingFor(state).cents, exampleCeilingCents)
  assert.equal(exampleCeilingCents, 59_500_000)
  const preparer = applyDeskAction(state, { type: 'review-ceiling', reviewedBy: 'Deal preparer', approvedRands: '595000', reason: 'Checked the example.', reviewedAt: '2026-10-25T12:10:00.000Z' })
  assert.match(preparer.alert, /preparer cannot review/)
  assert.equal(preparer.review, null)
  const high = applyDeskAction(state, { type: 'review-ceiling', reviewedBy: 'Second reviewer', approvedRands: '600000', reason: 'Trying to bid higher.', reviewedAt: '2026-10-25T12:10:00.000Z' })
  assert.match(high.alert, /above the recommendation/)
  assert.equal(high.review, null)
  state = applyDeskAction(state, { type: 'review-ceiling', reviewedBy: 'Second reviewer', approvedRands: '595000', reason: 'Reviewed under the recommendation.', reviewedAt: '2026-10-25T12:10:00.000Z' })
  assert.equal(state.review?.approvedCeilingCents, 59_500_000)
  assert.match(state.message, /No bid, contract or payment/)
  const raised = applyDeskAction(state, { type: 'review-ceiling', reviewedBy: 'Second reviewer', approvedRands: '596000', reason: 'Trying to raise the ceiling.', reviewedAt: '2026-10-25T12:20:00.000Z' })
  assert.match(raised.alert, /cannot raise/)
  assert.equal(raised.review?.approvedCeilingCents, 59_500_000)
  const lowered = applyDeskAction(state, { type: 'review-ceiling', reviewedBy: 'Second reviewer', approvedRands: '500000', reason: 'Lowered after review.', reviewedAt: '2026-10-25T12:25:00.000Z' })
  assert.equal(lowered.review?.approvedCeilingCents, 50_000_000)
  assert.equal(lowered.history.at(-1)?.review.approvedCeilingCents, 59_500_000)
  const raisedWithin = applyDeskAction(lowered, { type: 'review-ceiling', reviewedBy: 'Second reviewer', approvedRands: '510000', reason: 'Trying to raise inside the formula.', reviewedAt: '2026-10-25T12:26:00.000Z' })
  assert.match(raisedWithin.alert, /cannot raise/)
  assert.equal(raisedWithin.review?.approvedCeilingCents, 50_000_000)
  const autonomous = autoRaiseCeiling(state)
  assert.match(autonomous.error, /cannot be raised autonomously/)
  assert.equal(autonomous.state.review?.approvedCeilingCents, 59_500_000)
  assert.equal(state.review?.approvedCeilingCents, 59_500_000)
  for (const type of ['record-bid', 'prepare-contract', 'release-finance'] as const) {
    const refused = applyDeskAction(state, { type })
    assert.match(refused.alert, /does not/)
    assert.equal(refused.review?.approvedCeilingCents, 59_500_000)
  }
  const changed = applyDeskAction(state, { type: 'set-cost-known', costId: 'cost-other', amountRands: '90000', source: 'Updated example cost sheet', at: '2026-10-25T12:30:00.000Z' })
  assert.equal(changed.review, null)
  assert.equal(changed.history[0]?.review.approvedCeilingCents, 59_500_000)
  assert.match(changed.history[0]?.reason ?? '', /previous review was voided/)
})
