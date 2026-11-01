import { expect, test } from '@playwright/test'
import { MODULE_007_INTEGRATION, profitStates } from '../../../lib/modules/007/contract'
import { composePartnerDesk } from '../../../lib/modules/007/desk'
import { reconcilePartnerBooks } from '../../../lib/modules/007/ledger'
import { assessWaterfall } from '../../../lib/modules/007/waterfall'
import type { CashEvent, PartnerBooks, SplitAgreement, StockMovement, WaterfallInput } from '../../../lib/modules/007/contract'
import { hiddenEvidence, partnershipId, unsignedWaterfall, varianceBooks } from './fixtures'
import * as api from '../../../lib/modules/007'

const both = [
  { role: 'founder' as const, personId: 'founder-1' },
  { role: 'operating-partner' as const, personId: 'partner-1' },
]

function books(patch: Partial<PartnerBooks> = {}): PartnerBooks {
  return {
    partnershipId,
    openings: { cash: [], stock: [] },
    cashEvents: [],
    stockMovements: [],
    cashCounts: [],
    stockCounts: [],
    ...patch,
  }
}

function cash(event: Partial<CashEvent> & Pick<CashEvent, 'id' | 'kind' | 'cents'>): CashEvent {
  return {
    partnershipId,
    at: '2026-10-25T08:00:00.000Z',
    location: 'operating-partner-safe',
    custodianId: 'partner-1',
    evidenceId: `${event.id}-evidence`,
    ...event,
  }
}

function stock(movement: Partial<StockMovement> & Pick<StockMovement, 'id' | 'type' | 'quantityMilli'>): StockMovement {
  return {
    partnershipId,
    at: '2026-10-25T08:00:00.000Z',
    batchId: 'batch-1',
    productId: 'cattle',
    unit: 'head',
    fromLocation: 'pen',
    responsiblePersonId: 'partner-1',
    evidenceId: `${movement.id}-evidence`,
    ...movement,
  }
}

function handover(cents: number, patch: Partial<CashEvent> = {}): CashEvent {
  return cash({
    id: 'handover',
    kind: 'handover',
    cents,
    destination: 'digikraal-office-safe',
    receivingCustodianId: 'office-1',
    acknowledgedBy: ['partner-1', 'office-1'],
    countedCents: cents,
    ...patch,
  })
}

const signed = (patch: Partial<SplitAgreement> = {}): SplitAgreement => ({
  signed: true,
  formulaVersion: '007-supplied-v1',
  partnerShareBps: 7_000,
  digikraalShareBps: 3_000,
  investorReturnFrom: 'digikraal-share',
  lossPolicy: 'signed-shares',
  ...patch,
})

function waterfall(patch: Partial<WaterfallInput> = {}): WaterfallInput {
  return {
    partnershipId,
    dealId: 'deal-1',
    verifiedReconciledCents: 100_000,
    refundedOrDisputedCents: 5_000,
    allocatedPurchaseCapitalCents: 40_000,
    approvedDirectAndSharedCostsCents: 10_000,
    approvedCapitalInterestCents: 5_000,
    investorReturnCents: 0,
    agreement: null,
    receiptsReconciled: true,
    invoiceIssued: false,
    accrualRecorded: false,
    stockResolved: false,
    costsCompleteOrAccrued: false,
    vatReviewed: false,
    exceptionsResolvedOrDisclosed: false,
    statementGenerated: false,
    preparedBy: null,
    independentlyVerifiedBy: null,
    approvals: [],
    ...patch,
  }
}

const settled = (): WaterfallInput => waterfall({
  agreement: signed(),
  investorReturnCents: 3_000,
  stockResolved: true,
  costsCompleteOrAccrued: true,
  vatReviewed: true,
  exceptionsResolvedOrDisclosed: true,
  statementGenerated: true,
  preparedBy: 'partner-1',
  independentlyVerifiedBy: 'finance-1',
  approvals: both,
})

test('the public surface does not pay, post or delete', () => {
  expect(Object.keys(api).sort()).toEqual([
    'CUSTODY_LOCATIONS', 'MODULE_007_ASSUMPTIONS', 'MODULE_007_ID', 'MODULE_007_INTEGRATION', 'STOCK_MOVEMENT_TYPES',
    'assessWaterfall', 'cashEquationHolds', 'composePartnerDesk', 'formatCents', 'formatMilli', 'officeEquationHolds',
    'profitStates', 'reconcilePartnerBooks', 'stockEquationHolds',
  ])
  expect(profitStates).not.toContain('paid')
  expect(MODULE_007_INTEGRATION.placement).toBe('internal-module')
  expect(MODULE_007_INTEGRATION.execution).toContain('false')
})

test('partner cash ties to the custody equation and does not credit the bank early', () => {
  const result = reconcilePartnerBooks(books({
    openings: {
      cash: [{ partnershipId, location: 'operating-partner-safe', cents: 100_000, custodianId: 'partner-1', evidenceId: 'open-cash' }],
      stock: [],
    },
    cashEvents: [
      cash({ id: 'sale', kind: 'sale-receipt', cents: 50_000 }),
      cash({ id: 'earlier', kind: 'earlier-sale-collection', cents: 20_000 }),
      cash({ id: 'spend', kind: 'expense', cents: 10_000 }),
      cash({ id: 'buy', kind: 'stock-purchase', cents: 15_000 }),
      handover(20_000),
      cash({ id: 'deposit', kind: 'direct-deposit', cents: 5_000, destination: 'bank-deposit-in-transit' }),
      handover(4_000, { id: 'transit', destination: 'authorised-person-in-transit', receivingCustodianId: 'driver-1', acknowledgedBy: ['partner-1', 'driver-1'] }),
    ],
  }))
  expect(result.moneyMoved).toBe(false)
  expect(result.partnerSafe).toMatchObject({
    openingCents: 100_000,
    saleReceiptsCents: 50_000,
    earlierCollectionsCents: 20_000,
    expensesCents: 10_000,
    stockPurchasesCents: 15_000,
    officeHandoversCents: 20_000,
    directDepositsCents: 5_000,
    otherHandoversOutCents: 4_000,
    expectedCloseCents: 116_000,
    holds: true,
    custodianId: 'partner-1',
  })
  expect(result.officeSafe).toMatchObject({ acceptedHandoversCents: 20_000, expectedCloseCents: 20_000, holds: true, custodianId: 'office-1' })
  expect(result.cash.find((row) => row.location === 'bank-account')?.expectedCents).toBe(0)
  expect(result.cash.find((row) => row.location === 'bank-deposit-in-transit')?.expectedCents).toBe(5_000)
  expect(result.cash.find((row) => row.location === 'authorised-person-in-transit')?.expectedCents).toBe(4_000)
  expect(result.cash.reduce((sum, row) => sum + row.expectedCents, 0)).toBe(145_000)
  expect(result.exceptions.some((item) => item.id === 'equation-break')).toBe(false)
})

test('a handover moves custody only when both people acknowledge the counted amount', () => {
  const opening = { cash: [{ partnershipId, location: 'operating-partner-safe', cents: 20_000, custodianId: 'partner-1', evidenceId: 'open-cash' }], stock: [] }
  const oneSided = reconcilePartnerBooks(books({ openings: opening, cashEvents: [handover(20_000, { acknowledgedBy: ['partner-1'] })] }))
  expect(oneSided.postedCash).toEqual([])
  expect(oneSided.partnerSafe.expectedCloseCents).toBe(20_000)
  expect(oneSided.officeSafe.expectedCloseCents).toBe(0)
  expect(oneSided.rejections.map((item) => item.reason).join(' ')).toContain('both people')
  const mismatch = reconcilePartnerBooks(books({ openings: opening, cashEvents: [handover(20_000, { countedCents: 19_000 })] }))
  expect(mismatch.postedCash).toEqual([])
  expect(mismatch.rejections.map((item) => item.reason).join(' ')).toContain('joint count')
  const accepted = reconcilePartnerBooks(books({ openings: opening, cashEvents: [handover(20_000)] }))
  expect(accepted.partnerSafe.expectedCloseCents).toBe(0)
  expect(accepted.officeSafe.expectedCloseCents).toBe(20_000)
  expect(accepted.officeSafe.custodianId).toBe('office-1')
})

test('bank cash waits for a bank line and a reversal keeps the original receipt', () => {
  const opening = { cash: [{ partnershipId, location: 'operating-partner-safe', cents: 10_000, custodianId: 'partner-1', evidenceId: 'open-cash' }], stock: [] }
  const deposited = reconcilePartnerBooks(books({
    openings: opening,
    cashEvents: [
      cash({ id: 'deposit', kind: 'direct-deposit', cents: 10_000, destination: 'bank-deposit-in-transit' }),
      cash({ id: 'confirm-missing', kind: 'bank-confirmation', cents: 10_000, location: 'bank-deposit-in-transit', destination: 'bank-account' }),
    ],
  }))
  expect(deposited.cash.find((row) => row.location === 'bank-account')?.expectedCents).toBe(0)
  expect(deposited.cash.find((row) => row.location === 'bank-deposit-in-transit')?.expectedCents).toBe(10_000)
  expect(deposited.rejections.map((item) => item.reason).join(' ')).toContain('bank line')
  const confirmed = reconcilePartnerBooks(books({
    openings: opening,
    cashEvents: [
      cash({ id: 'sale', kind: 'sale-receipt', cents: 5_000 }),
      cash({ id: 'spend', kind: 'expense', cents: 2_000 }),
      cash({ id: 'deposit', kind: 'direct-deposit', cents: 4_000, destination: 'bank-deposit-in-transit' }),
      cash({ id: 'confirm', kind: 'bank-confirmation', cents: 4_000, location: 'bank-deposit-in-transit', destination: 'bank-account', bankLineId: 'bank-line-1' }),
      cash({ id: 'undo-sale', kind: 'reversal', cents: 5_000, reversesId: 'sale' }),
    ],
  }))
  expect(confirmed.postedCash.map((item) => item.id)).toEqual(['sale', 'spend', 'deposit', 'confirm', 'undo-sale'])
  expect(confirmed.postedCash.find((item) => item.id === 'sale')?.cents).toBe(5_000)
  expect(confirmed.cash.find((row) => row.location === 'bank-account')?.expectedCents).toBe(4_000)
  expect(confirmed.cash.find((row) => row.location === 'bank-deposit-in-transit')?.expectedCents).toBe(0)
  expect(confirmed.partnerSafe.saleReceiptsCents).toBe(5_000)
  expect(confirmed.partnerSafe.reversalNetCents).toBe(-5_000)
  expect(confirmed.partnerSafe.expensesCents).toBe(2_000)
  expect(confirmed.partnerSafe.directDepositsCents).toBe(4_000)
  expect(confirmed.partnerSafe.expectedCloseCents).toBe(4_000)
  expect(confirmed.partnerSafe.holds).toBe(true)
})

test('spending does not change the receipt and cannot overdraw the safe', () => {
  const receipt = cash({ id: 'sale', kind: 'sale-receipt', cents: 5_000 })
  const result = reconcilePartnerBooks(books({
    openings: { cash: [{ partnershipId, location: 'operating-partner-safe', cents: 0, custodianId: 'partner-1', evidenceId: 'open-cash' }], stock: [] },
    cashEvents: [cash({ id: 'spend', kind: 'expense', cents: 100 }), receipt],
  }))
  expect(result.postedCash.map((item) => item.id)).toEqual(['sale'])
  expect(receipt.cents).toBe(5_000)
  expect(result.partnerSafe.expectedCloseCents).toBe(5_000)
  expect(result.rejections[0]?.reason).toContain('below zero')
})

test('stock variance stays visible after an approved count adjustment', () => {
  const result = reconcilePartnerBooks(books({
    openings: { cash: [], stock: [{ partnershipId, batchId: 'batch-1', productId: 'cattle', unit: 'head', location: 'pen', quantityMilli: 10_000, custodianId: 'partner-1', evidenceId: 'open-stock' }] },
    stockMovements: [
      stock({ id: 'in', type: 'receipt', quantityMilli: 2_000, toLocation: 'pen' }),
      stock({ id: 'move', type: 'transfer', quantityMilli: 1_000, toLocation: 'yard' }),
      stock({ id: 'sold', type: 'sale-delivery', quantityMilli: 500 }),
      stock({ id: 'dead', type: 'mortality', quantityMilli: 250 }),
      stock({ id: 'taken', type: 'theft', quantityMilli: 250 }),
      stock({ id: 'adjust', type: 'count-adjustment', quantityMilli: 1_000, direction: 'out', reason: 'Count sheet short', countId: 'count-1', approvedBy: both }),
    ],
    stockCounts: [{ id: 'count-1', partnershipId, batchId: 'batch-1', productId: 'cattle', location: 'pen', unit: 'head', quantityMilli: 9_000, countedBy: 'partner-1', at: '2026-10-25T18:00:00.000Z', evidenceId: 'stock-sheet' }],
  }))
  const pen = result.stock.find((line) => line.location === 'pen')
  const yard = result.stock.find((line) => line.location === 'yard')
  expect(pen).toMatchObject({ openingMilli: 10_000, receiptsMilli: 2_000, transfersOutMilli: 1_000, deliveriesMilli: 500, lossesMilli: 500, expectedMilli: 10_000, adjustmentMilli: -1_000, bookMilli: 9_000, varianceMilli: -1_000, holds: true })
  expect(yard).toMatchObject({ transfersInMilli: 1_000, expectedMilli: 1_000, adjustmentMilli: 0, holds: true })
  const variance = result.exceptions.find((item) => item.id === 'stock:batch-1:pen:head')
  expect(variance).toMatchObject({ status: 'explained', expected: 10_000, actual: 9_000, closableByDeletion: false, custodianId: 'partner-1' })
  expect(result.exceptions.some((item) => item.id === 'equation-break')).toBe(false)
})

test('stock cannot be sold short, processed without a result, or adjusted by one person', () => {
  const opening = { cash: [], stock: [{ partnershipId, batchId: 'batch-1', productId: 'cattle', unit: 'head', location: 'pen', quantityMilli: 5_000, custodianId: 'partner-1', evidenceId: 'open-stock' }] }
  const short = reconcilePartnerBooks(books({ openings: opening, stockMovements: [stock({ id: 'sold', type: 'sale-delivery', quantityMilli: 6_000 })] }))
  expect(short.postedStock).toEqual([])
  expect(short.stock[0]?.expectedMilli).toBe(5_000)
  const lone = reconcilePartnerBooks(books({
    openings: opening,
    stockMovements: [stock({ id: 'adjust', type: 'count-adjustment', quantityMilli: 1_000, direction: 'out', reason: 'Short', countId: 'count-1', approvedBy: [both[0]] })],
  }))
  expect(lone.postedStock).toEqual([])
  expect(lone.rejections[0]?.reason).toContain('founder and the operating partner')
  const unfinished = reconcilePartnerBooks(books({ openings: opening, stockMovements: [stock({ id: 'process', type: 'processing', quantityMilli: 1_000 })] }))
  expect(unfinished.postedStock).toEqual([])
  expect(unfinished.rejections[0]?.reason).toContain('resulting stock')
  const processed = reconcilePartnerBooks(books({
    openings: opening,
    stockMovements: [stock({ id: 'process', type: 'processing', quantityMilli: 5_000, counterpart: { batchId: 'batch-2', productId: 'beef', unit: 'kg', quantityMilli: 4_000, location: 'cold-room' } })],
  }))
  expect(processed.stock.find((line) => line.batchId === 'batch-1')?.expectedMilli).toBe(0)
  expect(processed.stock.find((line) => line.batchId === 'batch-2')).toMatchObject({ expectedMilli: 4_000, unit: 'kg' })
})

test('a joint negative override is kept and a reversal does not delete the original', () => {
  const opening = { cash: [], stock: [{ partnershipId, batchId: 'batch-1', productId: 'cattle', unit: 'head', location: 'pen', quantityMilli: 5_000, custodianId: 'partner-1', evidenceId: 'open-stock' }] }
  const overridden = reconcilePartnerBooks(books({
    openings: opening,
    stockMovements: [stock({ id: 'sold', type: 'sale-delivery', quantityMilli: 6_000, negativeOverride: { reason: 'Counted after loading', evidenceId: 'override-note', approvedBy: both } })],
  }))
  expect(overridden.postedStock.map((item) => item.id)).toEqual(['sold'])
  expect(overridden.stock[0]?.bookMilli).toBe(-1_000)
  expect(overridden.exceptions.find((item) => item.kind === 'negative-stock-override')).toMatchObject({ closableByDeletion: false, status: 'open' })
  const reversed = reconcilePartnerBooks(books({
    openings: { cash: [], stock: [] },
    stockMovements: [
      stock({ id: 'in', type: 'receipt', quantityMilli: 5_000, toLocation: 'pen' }),
      stock({ id: 'undo', type: 'reversal', quantityMilli: 5_000, reversesId: 'in' }),
    ],
  }))
  expect(reversed.postedStock.map((item) => item.id)).toEqual(['in', 'undo'])
  expect(reversed.stock[0]?.expectedMilli).toBe(0)
  expect(reversed.stock[0]?.holds).toBe(true)
})

test('another partnership is omitted and the supplied records stay unchanged', () => {
  const input = varianceBooks
  const before = JSON.stringify(input)
  const frozen = JSON.parse(before) as PartnerBooks
  const result = reconcilePartnerBooks(frozen)
  expect(JSON.stringify(input)).toBe(before)
  expect(result.hiddenOtherPartnerships).toBe(1)
  expect(JSON.stringify(result)).not.toContain(hiddenEvidence)
  expect(result.partnerSafe).toMatchObject({ expectedCloseCents: 100_000, physicalCountCents: 95_000, varianceCents: -5_000, custodianId: 'partner-1', holds: true })
  expect(result.exceptions.find((item) => item.kind === 'cash-variance')).toMatchObject({ id: 'cash:operating-partner-safe', status: 'open', closableByDeletion: false })
})

test('an unsigned 50/50 agreement is not applied and unknown interest is not zero', () => {
  const unsigned = assessWaterfall(unsignedWaterfall)
  expect(unsigned.distributableCents).toBe(40_000)
  expect(unsigned.split).toBe('unsigned')
  expect(unsigned.partnerShareCents).toBeNull()
  expect(unsigned.digikraalShareCents).toBeNull()
  expect(unsigned.state).toBe('cash-backed')
  expect(unsigned.payable).toBe(false)
  expect(unsigned.paid).toBe(false)
  expect(unsigned.moneyMoved).toBe(false)
  expect(unsigned.reasons.join(' ')).toContain('Unsigned knowledge-base default was not applied.')
  const unknown = assessWaterfall(waterfall({ approvedCapitalInterestCents: null }))
  expect(unknown.distributableCents).toBeNull()
  expect(unknown.state).toBe('forecast')
  expect(unknown.reasons.join(' ')).toContain('Interest is unknown and was not treated as zero.')
})

test('a supplied signed split rounds to the cent and keeps investor return on Digikraal', () => {
  const result = assessWaterfall(settled())
  expect(result).toMatchObject({
    state: 'approved',
    distributableCents: 40_000,
    partnerShareCents: 28_000,
    digikraalShareCents: 12_000,
    digikraalNetCents: 9_000,
    split: 'signed',
    payable: true,
    paid: false,
    executes: false,
    moneyMoved: false,
  })
  expect(result.reasons).toEqual(['Payout is not executed by this module.'])
  const rounded = assessWaterfall(waterfall({
    verifiedReconciledCents: 3,
    refundedOrDisputedCents: 0,
    allocatedPurchaseCapitalCents: 0,
    approvedDirectAndSharedCostsCents: 0,
    approvedCapitalInterestCents: 0,
    agreement: signed({ partnerShareBps: 5_000, digikraalShareBps: 5_000 }),
  }))
  expect(rounded.partnerShareCents).toBe(2)
  expect(rounded.digikraalShareCents).toBe(1)
  const blockedInvestor = assessWaterfall(settled())
  const withheld = assessWaterfall({ ...settled(), agreement: signed({ investorReturnFrom: 'unspecified' }) })
  expect(withheld.split).toBe('blocked')
  expect(withheld.partnerShareCents).toBeNull()
  expect(withheld.reasons.join(' ')).toContain('was not deducted')
  expect(blockedInvestor.partnerShareCents).toBe(28_000)
})

test('loss shares and approval both fail closed', () => {
  const loss = assessWaterfall(waterfall({
    verifiedReconciledCents: 10_000,
    allocatedPurchaseCapitalCents: 20_000,
    refundedOrDisputedCents: 0,
    approvedDirectAndSharedCostsCents: 0,
    approvedCapitalInterestCents: 0,
    agreement: signed({ partnerShareBps: 5_000, digikraalShareBps: 5_000, lossPolicy: 'unspecified' }),
    stockResolved: true,
    costsCompleteOrAccrued: true,
    vatReviewed: true,
    exceptionsResolvedOrDisclosed: true,
    statementGenerated: true,
    preparedBy: 'partner-1',
    independentlyVerifiedBy: 'finance-1',
    approvals: both,
  }))
  expect(loss.distributableCents).toBe(-10_000)
  expect(loss.partnerShareCents).toBeNull()
  expect(loss.split).toBe('blocked')
  expect(loss.reasons.join(' ')).toContain('does not sign a loss policy')
  const signedLoss = assessWaterfall(waterfall({
    verifiedReconciledCents: 10_000,
    allocatedPurchaseCapitalCents: 20_000,
    refundedOrDisputedCents: 0,
    approvedDirectAndSharedCostsCents: 0,
    approvedCapitalInterestCents: 0,
    agreement: signed({ partnerShareBps: 5_000, digikraalShareBps: 5_000 }),
    stockResolved: true,
    costsCompleteOrAccrued: true,
    vatReviewed: true,
    exceptionsResolvedOrDisclosed: true,
    statementGenerated: true,
    preparedBy: 'partner-1',
    independentlyVerifiedBy: 'finance-1',
    approvals: both,
  }))
  expect(signedLoss.partnerShareCents).toBe(-5_000)
  expect(signedLoss.digikraalShareCents).toBe(-5_000)
  const waiting = assessWaterfall({ ...settled(), approvals: [] })
  expect(waiting.state).toBe('settlement-ready')
  expect(waiting.payable).toBe(false)
  const samePerson = assessWaterfall({ ...settled(), approvals: [{ role: 'founder', personId: 'founder-1' }, { role: 'operating-partner', personId: 'founder-1' }] })
  expect(samePerson.payable).toBe(false)
  expect(samePerson.reasons.join(' ')).toContain('different people')
  const selfChecked = assessWaterfall({ ...settled(), independentlyVerifiedBy: 'partner-1' })
  expect(selfChecked.payable).toBe(false)
  expect(selfChecked.reasons.join(' ')).toContain('different person')
})

test('the desk asks for one next record and never a payment', () => {
  const variance = composePartnerDesk(varianceBooks, unsignedWaterfall)
  expect(variance.action).toMatchObject({ id: 'cash:operating-partner-safe', button: 'Explain the variance', executes: false, pays: false })
  expect(variance.payable).toBe(false)
  expect(variance.moneyMoved).toBe(false)
  expect(variance.paid).toBe(false)
  expect(variance.splitLabel).toBe('Not signed. No split was applied.')
  expect(variance.hiddenOtherPartnerships).toBe(1)
  const quiet = books({
    openings: { cash: [{ partnershipId, location: 'operating-partner-safe', cents: 100_000, custodianId: 'partner-1', evidenceId: 'open-cash' }], stock: [] },
    cashCounts: [{ id: 'count-cash', partnershipId, location: 'operating-partner-safe', cents: 100_000, countedBy: 'partner-1', at: '2026-10-25T18:00:00.000Z', evidenceId: 'count-sheet' }],
  })
  expect(composePartnerDesk(quiet, waterfall()).action.button).toBe('Hold the unsigned split')
  expect(composePartnerDesk(quiet, settled()).action).toMatchObject({ button: 'Record the external payout', pays: false, executes: false })
  expect(composePartnerDesk(quiet, settled()).payable).toBe(true)
  const held = composePartnerDesk(quiet, { ...settled(), partnershipId: 'p-other' })
  expect(held.profitState).toBe('withheld')
  expect(held.split).toBe('withheld')
  expect(held.payable).toBe(false)
  expect(held.action.button).toBe('Hold this partnership')
  expect(JSON.stringify(held)).not.toContain('R280.00')
})
