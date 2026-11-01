import { approvalStillCovers, approveAccounting, canonicalUser, preparePayment, reviewPaymentClaim, type AccountingApproval, type PreparedPayment } from './approval'
import { refuseBankRelease, refuseLedgerWrite } from './contract'
import { legalEntities, assessVat, type EntityId } from './entities'
import { createEvidence, type FinanceEvidence } from './evidence'
import { closeException, findDuplicateBill, raiseException, type FinanceException, type SupplierBill } from './exception'
import { formatZar, parseRands, validDate, validTimestamp } from './format'
import { createAmount, presentAmount, type StatedAmount } from './money'
import { captureObligation, type Obligation } from './obligation'
import { approveMatch, createBankLine, proposeMatch, type AllocationMatch, type BankLine } from './reconcile'

export type DeskAudience = 'founder' | 'shared'

export type DeskState = {
  example: true
  audience: DeskAudience
  entityId: EntityId
  obligation: Obligation
  evidence: FinanceEvidence[]
  forecast: StatedAmount | null
  accrual: StatedAmount | null
  cash: Partial<Record<EntityId, StatedAmount>>
  bankLine: BankLine | null
  match: AllocationMatch | null
  exception: FinanceException
  bills: SupplierBill[]
  approval: AccountingApproval | null
  payment: PreparedPayment | null
  message: string
  alert: string
  privateNote: string
  vatNote: string
  ledgerPosted: false
  paymentExecuted: false
  released: false
}

export type DeskAction =
  | { type: 'switch-entity'; entityId: EntityId }
  | { type: 'set-audience'; audience: DeskAudience }
  | { type: 'add-document'; amountRands: string; source: string; date: string; documentNumber: string; at: string }
  | { type: 'add-bank-evidence'; amountRands: string; source: string; date: string; reference: string; at: string }
  | { type: 'approve-match'; actor: string; resolution: string; at: string }
  | { type: 'approve-accounting'; actor: string; at: string }
  | { type: 'prepare-payment'; actor: string; at: string }
  | { type: 'claim-paid'; actor: string }
  | { type: 'apply-vat'; ratePercent: string; amountRands: string }
  | { type: 'post-ledger' }
  | { type: 'release-bank' }

const preparer = 'Emma'
const views = ['corporate_register', 'payment_queue', 'cash_forecast', 'document_checklist', 'accounting_posting', 'renewal_calendar', 'founder_decision'] as const

export function exampleDeskState(): DeskState {
  const evidence = must(createEvidence({
    id: 'ev-renewal-schedule',
    kind: 'prototype',
    entityId: 'digikraal',
    sourceSystem: 'prototype',
    sourceRef: 'example-insurance-schedule',
    capturedOn: '2026-10-01',
    wording: 'Example renewal premium R15 000. Not a live policy.',
    live: false,
  }))
  const forecast = must(createAmount({
    cents: 1_500_000,
    basis: 'forecast',
    entityId: 'digikraal',
    evidenceIds: [evidence.evidence.id],
    provenance: 'demo',
    live: false,
  }, [evidence.evidence]))
  const captured = must(captureObligation([], {
    id: 'obl-insurance-example',
    entityId: 'digikraal',
    kind: 'insurance_renewal',
    title: 'Example insurance renewal',
    counterparty: 'Example insurer',
    dueDate: '2026-11-30',
    views: [...views],
    evidenceIds: [evidence.evidence.id],
  }))
  const exception = must(raiseException({
    id: 'ex-missing-bank',
    code: 'missing_evidence',
    entityId: 'digikraal',
    severity: 'high',
    amount: { cents: 1_500_000, basis: 'forecast' },
    owner: 'Emma',
    evidenceIds: [],
    missingEvidence: true,
    proposedResolution: 'Attach a bank statement line before treating the premium as cash.',
    at: '2026-10-25T08:00:00.000Z',
    actor: 'Clark',
  }))
  if (!forecast.amount) throw new Error('The example forecast is missing.')
  return seal({
    example: true,
    audience: 'founder',
    entityId: 'digikraal',
    obligation: captured.obligation,
    evidence: [evidence.evidence],
    forecast: forecast.amount,
    accrual: null,
    cash: {},
    bankLine: null,
    match: null,
    exception: exception.exception,
    bills: [],
    approval: null,
    payment: null,
    message: 'Example only. Not live finance data. Xero keeps Digikraal’s statutory ledger. Nothing is posted or paid.',
    alert: '',
    privateNote: 'Call the broker before Friday. This note stays with DJ.',
    vatNote: '',
    ledgerPosted: false,
    paymentExecuted: false,
    released: false,
  })
}

export function nextMove(state: DeskState): { title: string; detail: string; action: 'document' | 'bank' | 'match' | 'decision' | 'prepare' | 'done' | 'other-entity' } {
  if (state.entityId !== state.obligation.entityId) {
    return { title: 'Nothing to decide on this entity', detail: `${legalEntities[state.obligation.entityId].legalName} keeps this obligation. It was not moved.`, action: 'other-entity' }
  }
  if (!state.accrual) return { title: 'Forecast only', detail: 'The example premium is not cash and not a posted bill.', action: 'document' }
  if (!state.cash[state.obligation.entityId]) return { title: 'Accrual is not cash', detail: 'Record bank evidence before calling this cash.', action: 'bank' }
  if (state.match?.status !== 'matched') return { title: 'Match needs a person', detail: 'The bank line is only a proposal until a person approves it.', action: 'match' }
  if (!state.approval) return { title: 'Record a human decision', detail: 'The decision stays inside Pivot. It does not post to Xero or Sage.', action: 'decision' }
  if (!state.payment) return { title: 'Prepare the instruction', detail: 'A prepared instruction is not a bank release.', action: 'prepare' }
  return { title: 'Nothing to pay here', detail: 'The bank releases money. This screen cannot mark it paid.', action: 'done' }
}

export function visibleMoney(state: DeskState): { obligation: Obligation | null; forecast: StatedAmount | null; accrual: StatedAmount | null; cash: StatedAmount | null } {
  if (state.entityId !== state.obligation.entityId) return { obligation: null, forecast: null, accrual: null, cash: state.cash[state.entityId] ?? null }
  return { obligation: state.obligation, forecast: state.forecast, accrual: state.accrual, cash: state.cash[state.entityId] ?? null }
}

export function privateNoteFor(state: DeskState): string {
  return state.audience === 'founder' ? state.privateNote : ''
}

export function applyDeskAction(state: DeskState, action: DeskAction): DeskState {
  if (action.type === 'switch-entity') return seal({ ...state, entityId: action.entityId, alert: '', message: `${legalEntities[action.entityId].legalName} uses ${legalEntities[action.entityId].ledger === 'xero' ? 'Xero' : 'Sage'}. The statutory ledger was not changed.` })
  if (action.type === 'set-audience') return seal({ ...state, audience: action.audience, alert: '' })
  if (action.type === 'post-ledger') return seal({ ...state, alert: refuseLedgerWrite().error })
  if (action.type === 'release-bank') return seal({ ...state, alert: refuseBankRelease().error })
  if (action.type === 'claim-paid') return claim(state, action.actor)
  if (action.type === 'apply-vat') return applyVat(state, action.ratePercent, action.amountRands)
  if (action.type === 'add-document') return addDocument(state, action)
  if (action.type === 'add-bank-evidence') return addBank(state, action)
  if (action.type === 'approve-match') return approveDeskMatch(state, action)
  if (action.type === 'approve-accounting') return approveDesk(state, action)
  return prepare(state, action)
}

function addDocument(state: DeskState, action: Extract<DeskAction, { type: 'add-document' }>): DeskState {
  if (state.entityId !== state.obligation.entityId) return block(state, 'This obligation belongs to Digikraal (Pty) Ltd.')
  if (state.bills.length) return block(state, 'This obligation already has a supplier document. A second bill was not added.')
  const parsed = parseRands(action.amountRands)
  if (parsed.cents === null) return block(state, parsed.error ?? 'Enter a rand amount.')
  const documentNumber = action.documentNumber.trim()
  const source = action.source.trim()
  if (!documentNumber || !source) return block(state, 'The document needs a number and a source.')
  if (!validDate(action.date) || !validTimestamp(action.at)) return block(state, 'The document needs a valid date.')
  const evidence = createEvidence({
    id: `ev-${documentNumber.toLowerCase()}`,
    kind: 'supplier_document',
    entityId: state.entityId,
    sourceSystem: 'manual',
    sourceRef: documentNumber,
    capturedOn: action.date,
    wording: `Example supplier document ${documentNumber} for ${formatZar(parsed.cents)}. Not a live bill.`,
    live: false,
  })
  if (!evidence.ok) return block(state, evidence.error)
  const amount = createAmount({ cents: parsed.cents, basis: 'accrual', entityId: state.entityId, evidenceIds: [evidence.evidence.id], provenance: 'demo', live: false }, [...state.evidence, evidence.evidence])
  if (!amount.ok || !amount.amount) return block(state, amount.ok ? 'The accrual amount is unknown.' : amount.error)
  const bill: SupplierBill = { id: `bill-${documentNumber.toLowerCase()}`, entityId: state.entityId, supplier: state.obligation.counterparty, documentNumber, cents: parsed.cents, date: action.date }
  const duplicate = findDuplicateBill(bill, state.bills)
  if (duplicate) return block(state, `${duplicate.reason} It was stopped before posting or payment.`)
  return seal({
    ...state,
    evidence: [...state.evidence, evidence.evidence],
    accrual: amount.amount,
    bills: [bill],
    approval: null,
    alert: '',
    message: `Accrual recorded at ${formatZar(parsed.cents)}. The forecast is unchanged. Nothing was posted.`,
  })
}

function addBank(state: DeskState, action: Extract<DeskAction, { type: 'add-bank-evidence' }>): DeskState {
  const parsed = parseRands(action.amountRands)
  if (parsed.cents === null) return block(state, parsed.error ?? 'Enter a rand amount.')
  const source = action.source.trim()
  const reference = action.reference.trim()
  if (!source || !reference) return block(state, 'Bank evidence needs a source and a reference.')
  if (!validDate(action.date)) return block(state, 'Bank evidence needs a valid date.')
  const evidence = createEvidence({
    id: `ev-bank-${state.entityId}`,
    kind: 'bank_statement',
    entityId: state.entityId,
    sourceSystem: 'bank',
    sourceRef: reference,
    capturedOn: action.date,
    wording: `Example bank line ${reference} for ${formatZar(parsed.cents)}. Not a live balance.`,
    live: false,
  })
  if (!evidence.ok) return block(state, evidence.error)
  const amount = createAmount({ cents: parsed.cents, explicitZero: parsed.cents === 0, basis: 'cash_backed', entityId: state.entityId, evidenceIds: [evidence.evidence.id], provenance: 'demo', live: false }, [evidence.evidence])
  if (!amount.ok || !amount.amount) return block(state, amount.ok ? 'The cash amount is unknown.' : amount.error)
  const line = createBankLine({ id: `line-${state.entityId}`, entityId: state.entityId, accountLabel: 'Example account', direction: 'outflow', cents: parsed.cents, date: action.date, reference, evidenceId: evidence.evidence.id }, [evidence.evidence])
  if (!line.ok) return block(state, line.error)
  const nextEvidence = [...state.evidence.filter((item) => item.id !== evidence.evidence.id), evidence.evidence]
  const cash = { ...state.cash, [state.entityId]: amount.amount }
  if (state.entityId !== state.obligation.entityId) {
    return seal({ ...state, evidence: nextEvidence, cash, alert: '', message: `Example bank evidence stays on ${legalEntities[state.entityId].legalName}. It was not applied to Digikraal.` })
  }
  const target = state.accrual?.cents ?? state.forecast?.cents ?? parsed.cents
  const allocated = Math.min(parsed.cents, target)
  const match = proposeMatch({
    id: `match-${line.line.id}`,
    line: line.line,
    obligation: state.obligation,
    allocatedCents: allocated,
    evidence: nextEvidence,
    explanation: `Proposed match. Bank line ${formatZar(parsed.cents)}. Obligation ${formatZar(target)}. Allocated ${formatZar(allocated)}. Bank residual ${formatZar(parsed.cents - allocated)}. Unmatched obligation ${formatZar(target - allocated)}. Not reconciled until a person approves it.`,
  })
  if (!match.ok) return block(state, match.error)
  return seal({
    ...state,
    evidence: nextEvidence,
    cash,
    bankLine: line.line,
    match: match.match,
    alert: '',
    message: 'Example cash-backed figure recorded. It is not a live bank balance and the match is not approved.',
  })
}

function approveDeskMatch(state: DeskState, action: Extract<DeskAction, { type: 'approve-match' }>): DeskState {
  if (!state.match || !state.bankLine) return block(state, 'Record the bank line first.')
  if (!canonicalUser(action.actor)) return block(state, 'A named finance user must approve the match. Clark cannot approve it.')
  const resolution = action.resolution.trim()
  if (!resolution) return block(state, 'Closing the exception needs a resolution.')
  const closed = closeException(state.exception, { actor: action.actor, at: action.at, resolution, evidenceIds: [state.bankLine.evidenceId] })
  if (!closed.ok) return block(state, closed.error)
  const approved = approveMatch(state.match, { actor: action.actor, at: action.at })
  if (!approved.ok) return block(state, approved.error)
  return seal({
    ...state,
    exception: closed.exception,
    match: approved.match,
    alert: '',
    message: `Match approved by ${approved.match.approvedBy}. Residual ${formatZar(approved.match.residualCents)} stays visible. The statutory ledger was not changed.`,
  })
}

function approveDesk(state: DeskState, action: Extract<DeskAction, { type: 'approve-accounting' }>): DeskState {
  const document = state.evidence.find((item) => item.kind === 'supplier_document' && item.entityId === state.obligation.entityId)
  if (!document) return block(state, 'Accounting approval needs the supplier document.')
  const approved = approveAccounting({
    actor: action.actor,
    proposalBy: preparer,
    obligationId: state.obligation.id,
    entityId: state.obligation.entityId,
    evidence: state.evidence,
    evidenceIds: [document.id],
    auditWritable: true,
    at: action.at,
  })
  if (!approved.ok) return block(state, approved.error)
  if (!approvalStillCovers(approved.approval, [document.id])) return block(state, 'The decision does not cover this evidence.')
  const selfApproval = approved.approval.selfApproval ? ' Self-approval stays visible.' : ''
  return seal({ ...state, approval: approved.approval, alert: '', message: `Decision recorded by ${approved.approval.actor}. Nothing was posted.${selfApproval}` })
}

function prepare(state: DeskState, action: Extract<DeskAction, { type: 'prepare-payment' }>): DeskState {
  const bill = state.bills[0]
  if (!bill || !state.forecast) return block(state, 'Prepare the supplier document before the payment instruction.')
  const approver = canonicalUser(action.actor)
  const prepared = preparePayment({
    id: 'pay-example',
    actor: action.actor,
    approver: approver && approver !== 'emma' && approver !== 'sonnica' ? action.actor : null,
    obligationId: state.obligation.id,
    cashImpact: state.forecast,
    bills: state.bills,
    candidate: bill,
    bankDetailsChanged: false,
    auditWritable: true,
  })
  if (!prepared.ok) return block(state, prepared.error)
  const approvalText = prepared.payment.approvedBy ? ` Approved by ${prepared.payment.approvedBy}. One approval is enough.` : ' It still needs Conrad or Drikus before anyone talks to the bank.'
  const selfText = prepared.payment.selfApproval ? ' The same person prepared and approved it, and that stays visible.' : ''
  return seal({ ...state, payment: prepared.payment, alert: '', message: `Instruction prepared.${approvalText}${selfText} It is not paid.` })
}

function claim(state: DeskState, actor: string): DeskState {
  const result = reviewPaymentClaim({
    actor,
    obligationId: state.obligation.id,
    amount: state.cash[state.obligation.entityId] ?? null,
    evidence: state.evidence,
    approved: Boolean(state.payment?.approvedBy),
    prepared: Boolean(state.payment),
    auditWritable: true,
  })
  return seal({ ...state, alert: result.ok ? result.reason : result.error, released: false, paymentExecuted: false })
}

function applyVat(state: DeskState, ratePercent: string, amountRands: string): DeskState {
  const rateBps = rate(ratePercent)
  if (rateBps === null) return block(state, 'Enter a VAT rate. It is not assumed.')
  const parsed = parseRands(amountRands)
  if (parsed.cents === null) return block(state, parsed.error ?? 'Enter the exclusive amount. Unknown was not treated as zero.')
  const assessed = assessVat({ entityId: state.entityId, exclusiveCents: parsed.cents, rateBps, inheritedFrom: state.entityId === 'dk-agri' ? 'digikraal' : null })
  if (!assessed.ok) return block(state, assessed.error)
  return seal({ ...state, alert: '', vatNote: `VAT ${formatZar(assessed.vatCents)} on ${formatZar(assessed.exclusiveCents)}. Inclusive ${formatZar(assessed.inclusiveCents)}. Calculated for review. Not posted. A person submits any return.` })
}

function block(state: DeskState, alert: string): DeskState {
  return seal({ ...state, alert })
}

function seal<T extends DeskState>(state: T): DeskState {
  return { ...state, example: true, ledgerPosted: false, paymentExecuted: false, released: false }
}

function must<T extends { ok: true }>(result: T | { ok: false; error: string }): T {
  if (!result.ok) throw new Error(result.error)
  return result
}

function rate(value: string): number | null {
  const trimmed = value.trim()
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(trimmed)) return null
  const bps = Math.round(Number(trimmed) * 100)
  if (!Number.isSafeInteger(bps) || bps > 10000) return null
  return bps
}

export function laneCopy(amount: StatedAmount | null): { figure: string; caution: string } {
  const presented = presentAmount(amount)
  return { figure: presented.figure, caution: presented.caution }
}
