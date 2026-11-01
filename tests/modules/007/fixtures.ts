import type { JointApproval, PartnerBooks, WaterfallInput } from '../../../lib/modules/007/contract'

export const partnershipId = 'p-example'
export const hiddenEvidence = 'hidden-partner-evidence-9f3a'

const both: readonly JointApproval[] = [
  { role: 'founder', personId: 'founder-1' },
  { role: 'operating-partner', personId: 'partner-1' },
]

export const varianceBooks: PartnerBooks = {
  partnershipId,
  openings: {
    cash: [{ partnershipId, location: 'operating-partner-safe', cents: 100_000, custodianId: 'partner-1', evidenceId: 'open-cash' }],
    stock: [{ partnershipId, batchId: 'batch-1', productId: 'cattle', unit: 'head', location: 'pen', quantityMilli: 3_000, custodianId: 'partner-1', evidenceId: 'open-stock' }],
  },
  cashEvents: [{
    id: 'hidden-cash', partnershipId: 'p-other', at: '2026-10-25T07:00:00.000Z', kind: 'sale-receipt', cents: 999, location: 'operating-partner-safe', custodianId: 'other-person', evidenceId: hiddenEvidence,
  }],
  stockMovements: [],
  cashCounts: [{ id: 'count-cash', partnershipId, location: 'operating-partner-safe', cents: 95_000, countedBy: 'partner-1', at: '2026-10-25T18:00:00.000Z', evidenceId: 'count-sheet' }],
  stockCounts: [{ id: 'count-stock', partnershipId, batchId: 'batch-1', productId: 'cattle', location: 'pen', unit: 'head', quantityMilli: 3_000, countedBy: 'partner-1', at: '2026-10-25T18:00:00.000Z', evidenceId: 'stock-sheet' }],
}

export const unsignedWaterfall: WaterfallInput = {
  partnershipId,
  dealId: 'deal-1',
  verifiedReconciledCents: 100_000,
  refundedOrDisputedCents: 5_000,
  allocatedPurchaseCapitalCents: 40_000,
  approvedDirectAndSharedCostsCents: 10_000,
  approvedCapitalInterestCents: 5_000,
  investorReturnCents: 0,
  agreement: {
    signed: false,
    formulaVersion: '007-supplied-v1',
    partnerShareBps: 5_000,
    digikraalShareBps: 5_000,
    investorReturnFrom: 'digikraal-share',
    lossPolicy: 'signed-shares',
  },
  receiptsReconciled: true,
  invoiceIssued: true,
  accrualRecorded: true,
  stockResolved: true,
  costsCompleteOrAccrued: true,
  vatReviewed: true,
  exceptionsResolvedOrDisclosed: true,
  statementGenerated: true,
  preparedBy: 'partner-1',
  independentlyVerifiedBy: 'finance-1',
  approvals: both,
}
