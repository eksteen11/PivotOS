/** Partner Farming and Trading is module 007 inside Pivot OS. It is not a separate app. */

export const MODULE_007_ID = '007' as const

export const CUSTODY_LOCATIONS = [
  'operating-partner-safe',
  'digikraal-office-safe',
  'authorised-person-in-transit',
  'bank-deposit-in-transit',
  'bank-account',
] as const

export type CustodyLocation = (typeof CUSTODY_LOCATIONS)[number]

export const STOCK_MOVEMENT_TYPES = [
  'receipt',
  'transfer',
  'sale-delivery',
  'return',
  'mortality',
  'theft',
  'write-off',
  'internal-use',
  'processing',
  'count-adjustment',
  'reversal',
] as const

export type StockMovementType = (typeof STOCK_MOVEMENT_TYPES)[number]

/** Payable profit stops at approved. This module has no paid state. */
export const profitStates = ['forecast', 'invoiced', 'accrued', 'cash-backed', 'settlement-ready', 'approved'] as const

export type ProfitState = (typeof profitStates)[number]

export type SplitStatus = 'unsigned' | 'signed' | 'blocked'

export type ApprovalRole = 'founder' | 'operating-partner'

export type JointApproval = { role: ApprovalRole; personId: string }

export type SplitAgreement = {
  signed: boolean
  formulaVersion: string
  partnerShareBps: number
  digikraalShareBps: number
  investorReturnFrom: 'digikraal-share' | 'unspecified'
  lossPolicy: 'signed-shares' | 'unspecified'
}

export const MODULE_007_ASSUMPTIONS = [
  'Money is whole cents. Stock quantities are whole thousandths of the named unit. Unknown money stays null and is never written as zero.',
  'Events stay in the order supplied. This module does not sort them and does not load a day from a database.',
  'The five cash places are the custody list in the knowledge base. Stock places are the names on the events. No other cash place is accepted.',
  'A handover changes custody only when two different people both acknowledge the same counted amount. Until then the balance stays where it was.',
  'A direct deposit or an office bank handover moves recorded cash into deposit-in-transit. The bank account increases only when a bank line id is supplied. This module does not confirm the bank.',
  'Spending and stock purchases are separate events. They do not change the original receipt.',
  'The partner-safe and office-safe identities follow the knowledge base. Any other accepted custody move is shown on its own line so the total still ties.',
  'Expected stock excludes count adjustments. An approved adjustment is posted beside the expected quantity and does not erase it.',
  'Variance is the physical count minus expected stock or cash. An explained variance stays on the record. Nothing is closed by deleting evidence.',
  'An unexplained variance stays with the last acknowledged custodian of that place. If nobody has acknowledged it, the owner is unknown. A receipt alone is not an acknowledgement.',
  'The knowledge-base 50/50 wording is not applied. Shares are calculated only from basis points on an agreement marked signed, with a formula version. A loss also needs a signed loss policy.',
  'Investor return is deducted from Digikraal only when the agreement says so. It is never taken from the operating partner. A zero investor return does not need that clause.',
  'Interest is not calculated here. A blank interest amount blocks cash-backed profit. An explicit zero is accepted.',
  'A count adjustment must say in or out, and both the founder and the operating partner must approve it. The direction is not inferred.',
  'Reversal reverses the whole original event. The original stays. A partial reversal is not invented.',
  'This module never marks a payout paid and never moves money, stock or a bank balance outside the records supplied to it.',
  'Showing one partnership on this desk is not access control. Row-level security remains a shared schema gate.',
] as const

export type OpeningCash = {
  partnershipId: string
  location: CustodyLocation
  cents: number
  custodianId: string
  evidenceId: string
}

export type CashKind =
  | 'sale-receipt'
  | 'earlier-sale-collection'
  | 'other-receipt'
  | 'expense'
  | 'stock-purchase'
  | 'handover'
  | 'direct-deposit'
  | 'office-receipt'
  | 'office-spend'
  | 'bank-handover'
  | 'bank-confirmation'
  | 'reversal'

export type CashEvent = {
  id: string
  partnershipId: string
  at: string
  kind: CashKind
  cents: number
  location: CustodyLocation
  destination?: CustodyLocation
  custodianId: string
  receivingCustodianId?: string
  acknowledgedBy?: readonly string[]
  countedCents?: number
  evidenceId: string
  bankLineId?: string
  reversesId?: string
}

export type CashCount = {
  id: string
  partnershipId: string
  location: CustodyLocation
  cents: number
  countedBy: string
  at: string
  evidenceId: string
}

export type OpeningStock = {
  partnershipId: string
  batchId: string
  productId: string
  unit: string
  location: string
  quantityMilli: number
  custodianId: string
  evidenceId: string
}

export type StockMovement = {
  id: string
  partnershipId: string
  at: string
  batchId: string
  productId: string
  unit: string
  type: StockMovementType
  quantityMilli: number
  fromLocation?: string
  toLocation?: string
  responsiblePersonId: string
  evidenceId: string
  reversesId?: string
  reason?: string
  countId?: string
  direction?: 'in' | 'out'
  approvedBy?: readonly JointApproval[]
  negativeOverride?: { reason: string; evidenceId: string; approvedBy: readonly JointApproval[] }
  counterpart?: { batchId: string; productId: string; unit: string; quantityMilli: number; location: string }
}

export type StockCount = {
  id: string
  partnershipId: string
  batchId: string
  productId: string
  location: string
  unit: string
  quantityMilli: number
  countedBy: string
  at: string
  evidenceId: string
}

export type PartnerBooks = {
  partnershipId: string
  openings: { cash: readonly OpeningCash[]; stock: readonly OpeningStock[] }
  cashEvents: readonly CashEvent[]
  stockMovements: readonly StockMovement[]
  cashCounts: readonly CashCount[]
  stockCounts: readonly StockCount[]
}

export type PartnerSafeEquation = {
  openingCents: number
  saleReceiptsCents: number
  earlierCollectionsCents: number
  otherReceiptsCents: number
  handoversInCents: number
  reversalNetCents: number
  otherNetCents: number
  expensesCents: number
  stockPurchasesCents: number
  officeHandoversCents: number
  otherHandoversOutCents: number
  directDepositsCents: number
  expectedCloseCents: number
  physicalCountCents: number | null
  varianceCents: number | null
  custodianId: string | null
  holds: boolean
}

export type OfficeSafeEquation = {
  openingCents: number
  acceptedHandoversCents: number
  officeReceiptsCents: number
  reversalNetCents: number
  otherNetCents: number
  officeSpendCents: number
  bankHandoversCents: number
  expectedCloseCents: number
  physicalCountCents: number | null
  varianceCents: number | null
  custodianId: string | null
  holds: boolean
}

export type CashPosition = {
  location: CustodyLocation
  expectedCents: number
  physicalCountCents: number | null
  varianceCents: number | null
  custodianId: string | null
}

export type StockLine = {
  batchId: string
  productId: string
  location: string
  unit: string
  openingMilli: number
  receiptsMilli: number
  transfersInMilli: number
  transfersOutMilli: number
  deliveriesMilli: number
  returnsMilli: number
  lossesMilli: number
  processingInMilli: number
  processingOutMilli: number
  reversalNetMilli: number
  otherNetMilli: number
  expectedMilli: number
  adjustmentMilli: number
  bookMilli: number
  physicalMilli: number | null
  varianceMilli: number | null
  custodianId: string | null
  holds: boolean
}

export type CustodyException = {
  id: string
  kind: 'cash-variance' | 'stock-variance' | 'negative-stock-override'
  partnershipId: string
  subject: string
  expected: number
  actual: number
  variance: number
  custodianId: string | null
  evidenceIds: readonly string[]
  status: 'open' | 'explained'
  closableByDeletion: false
}

export type PostedCash = { id: string; kind: CashKind; cents: number }

export type PostedStock = { id: string; type: StockMovementType; quantityMilli: number }

export type Reconciliation = {
  moduleId: typeof MODULE_007_ID
  partnershipId: string
  moneyMoved: false
  executes: false
  hiddenOtherPartnerships: number
  cash: readonly CashPosition[]
  stock: readonly StockLine[]
  partnerSafe: PartnerSafeEquation
  officeSafe: OfficeSafeEquation
  postedCash: readonly PostedCash[]
  postedStock: readonly PostedStock[]
  rejections: readonly { id: string; reason: string }[]
  exceptions: readonly CustodyException[]
}

export type WaterfallInput = {
  partnershipId: string
  dealId: string
  verifiedReconciledCents: number | null
  refundedOrDisputedCents: number | null
  allocatedPurchaseCapitalCents: number | null
  approvedDirectAndSharedCostsCents: number | null
  approvedCapitalInterestCents: number | null
  investorReturnCents: number | null
  agreement: SplitAgreement | null
  receiptsReconciled: boolean
  invoiceIssued: boolean
  accrualRecorded: boolean
  stockResolved: boolean
  costsCompleteOrAccrued: boolean
  vatReviewed: boolean
  exceptionsResolvedOrDisclosed: boolean
  statementGenerated: boolean
  preparedBy: string | null
  independentlyVerifiedBy: string | null
  approvals: readonly JointApproval[]
}

export type WaterfallResult = {
  moduleId: typeof MODULE_007_ID
  partnershipId: string
  dealId: string
  state: ProfitState
  distributableCents: number | null
  partnerShareCents: number | null
  digikraalShareCents: number | null
  digikraalNetCents: number | null
  investorReturnCents: number | null
  split: SplitStatus
  payable: boolean
  paid: false
  executes: false
  moneyMoved: false
  reasons: readonly string[]
}

export type DeskAction = {
  id: string
  title: string
  button: string
  detail: string
  executes: false
  pays: false
}

export type PartnerDeskView = {
  moduleId: typeof MODULE_007_ID
  partnershipId: string
  moneyMoved: false
  executes: false
  paid: false
  providerStatus: 'not-connected'
  profitState: ProfitState | 'withheld'
  payable: boolean
  split: SplitStatus | 'withheld'
  splitLabel: string
  action: DeskAction
  cash: readonly { location: CustodyLocation; label: string; expected: string; counted: string; variance: string }[]
  stock: readonly { id: string; label: string; expected: string; counted: string; variance: string }[]
  hiddenOtherPartnerships: number
  assumptions: typeof MODULE_007_ASSUMPTIONS
}

export const MODULE_007_INTEGRATION = {
  moduleId: MODULE_007_ID,
  name: 'Partner Farming and Trading',
  placement: 'internal-module',
  company: 'digikraal',
  ownedPaths: ['lib/modules/007/', 'components/modules/007/', 'tests/modules/007/', 'plan/CURSOR_MODULE_007_STATUS.md'],
  leavesToCeo: ['Shared routes', 'Desk shell', 'Auth', 'Schema', 'Row-level security', 'Approval persistence', 'Bank and payout execution'],
  consumes: [],
  doesNotDuplicate: ['Xero', 'Bank release', 'A shared settlement engine', 'Shell navigation'],
  entry: {
    reconcile: 'reconcilePartnerBooks',
    waterfall: 'assessWaterfall',
    view: 'composePartnerDesk',
    component: 'PartnerFarmingDesk',
  },
  mount: {
    when: 'After the CEO schedules the Digikraal division mount.',
    surface: 'Inside the existing desk. Digikraal, then Partner Farming and Trading. The legacy /workspaces/partner-farming route stays untouched.',
    props: 'books: PartnerBooks; waterfall: WaterfallInput; onOpen(id: string): void',
    onOpen: 'Returns an exception, split or evidence id to the existing work dialog. This module does not approve, pay, deposit or hand cash over.',
  },
  privacy: 'One partnership per view. Other partnerships are counted and omitted. Hiding them here is not the access-control boundary.',
  approval: 'Joint approval and independent verification are inputs. This module does not store the decision and does not mark a payout paid.',
  providers: 'Bank, Xero and payout rails are not connected.',
  execution: 'moneyMoved is always false. There is no paid profit state.',
  attributes: ['data-module="007"', 'data-money-moved="false"', 'data-paid="false"', 'data-provider="not-connected"', 'data-profit-state', 'data-payable', 'data-split'],
} as const
