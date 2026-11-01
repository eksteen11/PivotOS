import type { JointApproval, ProfitState, SplitAgreement, WaterfallInput, WaterfallResult } from './contract'

function hasText(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function knownNonNegative(value: number | null, label: string, reasons: string[]) {
  if (value === null) {
    reasons.push(`${label} is unknown and was not treated as zero.`)
    return null
  }
  if (!Number.isSafeInteger(value) || value < 0) {
    reasons.push(`${label} must be zero or a positive number of cents.`)
    return null
  }
  return value
}

/** Partner cents round half away from zero. Digikraal keeps the remainder so the shares tie. */
function shareCents(total: number, basisPoints: number) {
  const product = total * basisPoints
  if (!Number.isSafeInteger(product)) return null
  const negative = product < 0
  const rounded = Math.round(Math.abs(product) / 10000)
  const share = negative ? -rounded : rounded
  return Number.isSafeInteger(share) ? share : null
}

function signedShape(agreement: SplitAgreement | null): agreement is SplitAgreement {
  return Boolean(
    agreement
    && agreement.signed === true
    && hasText(agreement.formulaVersion)
    && Number.isInteger(agreement.partnerShareBps)
    && Number.isInteger(agreement.digikraalShareBps)
    && agreement.partnerShareBps >= 0
    && agreement.digikraalShareBps >= 0
    && agreement.partnerShareBps + agreement.digikraalShareBps === 10000,
  )
}

function approvalGate(approvals: readonly JointApproval[], preparedBy: string | null) {
  const founders = approvals.filter((item) => item.role === 'founder' && hasText(item.personId))
  const partners = approvals.filter((item) => item.role === 'operating-partner' && hasText(item.personId))
  if (founders.length !== 1 || partners.length !== 1) return 'Founder and operating partner must both approve.'
  if (founders[0].personId === partners[0].personId) return 'Founder and operating partner must be different people.'
  if (!hasText(preparedBy) || (founders[0].personId === preparedBy && partners[0].personId === preparedBy)) return 'Preparer cannot be the only approver.'
  return null
}

export function assessWaterfall(input: WaterfallInput): WaterfallResult {
  const reasons = ['Payout is not executed by this module.']
  const verified = knownNonNegative(input.verifiedReconciledCents, 'Verified proceeds', reasons)
  const refunds = knownNonNegative(input.refundedOrDisputedCents, 'Refunds', reasons)
  const capital = knownNonNegative(input.allocatedPurchaseCapitalCents, 'Purchase capital', reasons)
  const costs = knownNonNegative(input.approvedDirectAndSharedCostsCents, 'Costs', reasons)
  const interest = knownNonNegative(input.approvedCapitalInterestCents, 'Interest', reasons)
  const investor = knownNonNegative(input.investorReturnCents, 'Investor return', reasons)

  let distributable: number | null = null
  if (verified !== null && refunds !== null && capital !== null && costs !== null && interest !== null) {
    const next = verified - refunds - capital - costs - interest
    if (Number.isSafeInteger(next)) distributable = next
    else reasons.push('The distributable result is too large to calculate exactly.')
  }

  let split: WaterfallResult['split'] = 'unsigned'
  let partner: number | null = null
  let digikraal: number | null = null
  let digikraalNet: number | null = null
  const agreement = input.agreement

  if (!agreement || agreement.signed !== true) {
    reasons.push('Unsigned knowledge-base default was not applied.')
  } else if (!signedShape(agreement)) {
    split = 'blocked'
    reasons.push('The signed split was not applied because the basis points or formula version are incomplete.')
  } else if (distributable === null) {
    split = 'blocked'
    reasons.push('The signed split was not applied because the distributable result is unknown.')
  } else if (distributable < 0 && agreement.lossPolicy !== 'signed-shares') {
    split = 'blocked'
    reasons.push('Loss share was not applied because the agreement does not sign a loss policy.')
  } else if (investor === null) {
    split = 'blocked'
  } else if (investor > 0 && agreement.investorReturnFrom !== 'digikraal-share') {
    split = 'blocked'
    reasons.push('Investor return without a Digikraal-share clause was not deducted.')
  } else {
    const partnerShare = shareCents(distributable, agreement.partnerShareBps)
    const digikraalShare = partnerShare === null ? null : distributable - partnerShare
    const net = digikraalShare === null ? null : digikraalShare - investor
    if (partnerShare === null || digikraalShare === null || net === null || !Number.isSafeInteger(net)) {
      split = 'blocked'
      reasons.push('The signed split was too large to calculate exactly.')
    } else {
      split = 'signed'
      partner = partnerShare
      digikraal = digikraalShare
      digikraalNet = net
    }
  }

  if (distributable !== null && input.receiptsReconciled !== true) reasons.push('Receipts are not reconciled.')
  const verifierOk = hasText(input.independentlyVerifiedBy) && hasText(input.preparedBy) && input.independentlyVerifiedBy !== input.preparedBy
  if (!verifierOk) reasons.push('Independent verifier must be a different person from the preparer.')
  if (!input.stockResolved) reasons.push('Stock is not resolved.')
  if (!input.costsCompleteOrAccrued) reasons.push('Costs are not complete or accrued.')
  if (!input.vatReviewed) reasons.push('VAT is not reviewed.')
  if (!input.exceptionsResolvedOrDisclosed) reasons.push('Exceptions are not resolved or disclosed.')
  if (!input.statementGenerated) reasons.push('The partner statement is not generated.')
  const approvalReason = approvalGate(input.approvals, input.preparedBy)
  if (approvalReason) reasons.push(approvalReason)

  const cashBacked = distributable !== null && input.receiptsReconciled === true
  const settlementReady = cashBacked
    && split === 'signed'
    && partner !== null
    && digikraalNet !== null
    && verifierOk
    && input.stockResolved === true
    && input.costsCompleteOrAccrued === true
    && input.vatReviewed === true
    && input.exceptionsResolvedOrDisclosed === true
    && input.statementGenerated === true
  const approved = settlementReady && approvalReason === null

  let state: ProfitState = 'forecast'
  if (approved) state = 'approved'
  else if (settlementReady) state = 'settlement-ready'
  else if (cashBacked) state = 'cash-backed'
  else if (input.accrualRecorded === true) state = 'accrued'
  else if (input.invoiceIssued === true) state = 'invoiced'

  return {
    moduleId: '007',
    partnershipId: input.partnershipId,
    dealId: input.dealId,
    state,
    distributableCents: distributable,
    partnerShareCents: partner,
    digikraalShareCents: digikraal,
    digikraalNetCents: digikraalNet,
    investorReturnCents: split === 'signed' ? investor : null,
    split,
    payable: approved,
    paid: false,
    executes: false,
    moneyMoved: false,
    reasons,
  }
}
