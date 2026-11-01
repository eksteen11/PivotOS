import assert from 'node:assert/strict'
import { test } from 'node:test'
import { approvalStillCovers, approveAccounting, grantAccess, preparePayment, repaymentFromTask, reviewPaymentClaim } from '../../../lib/modules/009/approval'
import { module009Integration, payrollDiscovery } from '../../../lib/modules/009/contract'
import { applyDeskAction, exampleDeskState, nextMove, privateNoteFor, visibleMoney } from '../../../lib/modules/009/desk'
import { assessVat, postingTarget, submitVatReturn, vatPack } from '../../../lib/modules/009/entities'
import { createEvidence } from '../../../lib/modules/009/evidence'
import { closeException, findDuplicateBill, raiseException } from '../../../lib/modules/009/exception'
import { createAmount, labelledCash, presentAmount, sumSameBasis, thirteenWeek, type StatedAmount } from '../../../lib/modules/009/money'
import { captureObligation, invoiceNeedsOperationalSource } from '../../../lib/modules/009/obligation'
import { approveMatch, intercompanyPosition, partnerCashReconciled, proposeMatch, reviewMonthEnd } from '../../../lib/modules/009/reconcile'

const at = '2026-10-25T12:00:00.000Z'

test('forecast, accrual and cash stay apart, and demo is not live', () => {
  const schedule = evidence({ id: 'schedule', kind: 'prototype', live: false })
  const bank = evidence({ id: 'bank', kind: 'bank_statement', live: true, sourceSystem: 'bank' })
  const bill = evidence({ id: 'bill', kind: 'supplier_document', live: false })
  assert.equal(schedule.ok && bank.ok && bill.ok, true)
  if (!schedule.ok || !bank.ok || !bill.ok) return
  const forecast = createAmount({ cents: 1_500_000, basis: 'forecast', entityId: 'digikraal', evidenceIds: ['schedule'], provenance: 'demo', live: false }, [schedule.evidence])
  const accrual = createAmount({ cents: 1_500_000, basis: 'accrual', entityId: 'digikraal', evidenceIds: ['bill'], provenance: 'demo', live: false }, [bill.evidence])
  const cash = createAmount({ cents: 1_500_000, basis: 'cash_backed', entityId: 'digikraal', evidenceIds: ['bank'], provenance: 'bank_evidence', live: true }, [bank.evidence])
  const demoLive = createAmount({ cents: 1, basis: 'forecast', entityId: 'digikraal', evidenceIds: ['schedule'], provenance: 'demo', live: true }, [schedule.evidence])
  const taskCash = createAmount({ cents: 1, basis: 'cash_backed', entityId: 'digikraal', evidenceIds: ['schedule'], provenance: 'demo', live: false }, [schedule.evidence])
  assert.equal(forecast.ok && accrual.ok && cash.ok, true)
  assert.equal(demoLive.ok, false)
  assert.equal(taskCash.ok, false)
  if (!forecast.ok || !accrual.ok || !cash.ok || !forecast.amount || !accrual.amount || !cash.amount) return
  assert.match(presentAmount(forecast.amount).caution, /Not cash/)
  assert.match(presentAmount(forecast.amount).caution, /Demo is not live/)
  assert.match(presentAmount(accrual.amount).caution, /Not cash/)
  assert.match(presentAmount(cash.amount).caution, /bank stays authoritative/)
  assert.equal(presentAmount(null).figure, 'Unknown')
  const mixed = createAmount({ cents: null, basis: 'forecast', entityId: 'digikraal', evidenceIds: [], provenance: 'demo', live: false }, [])
  assert.equal(mixed.ok && mixed.amount, null)
  assert.match(sumError([forecast.amount, cash.amount], 'cash_backed'), /stay separate/)
  assert.match(sumError([forecast.amount, null], 'forecast'), /not treated as zero/)
})

test('one insurance obligation keeps every view on the same record', () => {
  const first = captureObligation([], obligation('obl-1', ['corporate_register', 'renewal_calendar']))
  assert.equal(first.ok && first.created, true)
  if (!first.ok) return
  const second = captureObligation(first.obligations, { ...obligation('obl-copy', ['payment_queue', 'cash_forecast', 'founder_decision']), title: '  example insurance renewal  ' })
  assert.equal(second.ok && second.created, false)
  if (!second.ok) return
  assert.equal(second.obligations.length, 1)
  assert.equal(second.obligation.id, 'obl-1')
  assert.deepEqual(second.obligation.views, ['corporate_register', 'renewal_calendar', 'payment_queue', 'cash_forecast', 'founder_decision'])
  assert.equal(invoiceNeedsOperationalSource(null).ok, false)
  assert.equal(invoiceNeedsOperationalSource('sale-42').ok, true)
})

test('exceptions keep their evidence and Clark cannot close them', () => {
  const opened = raiseException({ id: 'ex-1', code: 'missing_evidence', entityId: 'digikraal', severity: 'high', owner: 'Emma', evidenceIds: [], missingEvidence: true, proposedResolution: 'Attach the bank line.', at, actor: 'Clark' })
  assert.equal(opened.ok, true)
  if (!opened.ok) return
  const silent = closeException(opened.exception, { actor: 'Clark', at, resolution: 'Looks fine.', evidenceIds: ['bank'] })
  assert.equal(silent.ok, false)
  assert.equal(opened.exception.closed, false)
  assert.equal(opened.exception.history.length, 1)
  const closed = closeException(opened.exception, { actor: 'Emma', at, resolution: 'Bank line attached.', evidenceIds: ['bank'] })
  assert.equal(closed.ok, true)
  if (!closed.ok) return
  assert.equal(closed.exception.history[0]?.text.includes('Opened'), true)
  assert.equal(closed.exception.history.at(-1)?.text, 'Bank line attached.')
  const assumed = raiseException({ id: 'ex-2', code: 'missing_evidence', entityId: 'digikraal', severity: 'high', amount: { cents: 0, basis: 'forecast' }, owner: 'Emma', evidenceIds: [], missingEvidence: true, proposedResolution: 'Wait.', at, actor: 'Emma' })
  assert.equal(assumed.ok, false)
})

test('a duplicate bill is stopped and a bank match keeps its residual', () => {
  const first = { id: 'bill-1', entityId: 'digikraal' as const, supplier: 'Example insurer', documentNumber: 'EX-100', cents: 1_500_000, date: '2026-10-20' }
  const copy = { ...first, id: 'bill-2' }
  assert.match(findDuplicateBill(copy, [first])?.reason ?? '', /document number/)
  const bank = evidence({ id: 'bank', kind: 'bank_statement', live: true, sourceSystem: 'bank' })
  const captured = captureObligation([], obligation('obl-1', ['payment_queue']))
  assert.equal(bank.ok && captured.ok, true)
  if (!bank.ok || !captured.ok) return
  const line = { id: 'line-1', entityId: 'digikraal' as const, accountLabel: 'Example account', direction: 'outflow' as const, cents: 1_000_000, date: '2026-10-20', reference: 'BNK1', evidenceId: 'bank' }
  const proposed = proposeMatch({ id: 'match-1', line, obligation: captured.obligation, allocatedCents: 600_000, evidence: [bank.evidence], explanation: 'Part of the line matches the renewal.' })
  assert.equal(proposed.ok, true)
  if (!proposed.ok) return
  assert.equal(proposed.match.status, 'proposed')
  assert.equal(proposed.match.residualCents, 400_000)
  assert.equal(proposed.match.confidence, 'not_scored')
  const ai = approveMatch(proposed.match, { actor: 'Clark', at })
  assert.equal(ai.ok, false)
  const person = approveMatch(proposed.match, { actor: 'Emma', at })
  assert.equal(person.ok && person.match.status, 'matched')
  assert.equal(person.ok && person.match.ledgerWrite, false)
  const wrongEntity = proposeMatch({ id: 'match-2', line: { ...line, entityId: 'farm-feed' }, obligation: captured.obligation, allocatedCents: 600_000, evidence: [bank.evidence], explanation: 'Wrong company.' })
  assert.match(wrongEntity.ok ? '' : wrongEntity.error, /another legal entity/)
  const cash = partnerCashReconciled({ sourceEventId: null, match: person.ok ? person.match : null, evidence: [bank.evidence] })
  assert.equal(cash.reconciled, false)
})

test('statutory ledgers stay untouched and DK Agri cannot inherit VAT', () => {
  assert.equal(postingTarget('farm-feed', 'xero').ok, false)
  assert.equal(postingTarget('farm-feed', 'sage').ok && postingTarget('farm-feed', 'sage').ledgerWrite, false)
  assert.equal(postingTarget('digikraal', 'xero').ok, true)
  const inherited = assessVat({ entityId: 'dk-agri', exclusiveCents: 100_000, rateBps: 1500, inheritedFrom: 'digikraal' })
  assert.equal(inherited.ok, false)
  const rated = assessVat({ entityId: 'dk-agri', exclusiveCents: 100_000, rateBps: 1500 })
  assert.equal(rated.ok, false)
  const digikraal = assessVat({ entityId: 'digikraal', exclusiveCents: 1_500_000, rateBps: 1500 })
  assert.equal(digikraal.ok && digikraal.vatCents, 225_000)
  assert.equal(digikraal.ok && digikraal.posted, false)
  const pack = vatPack([
    { id: 'dk', entityId: 'dk-agri', evidenceKind: 'tax_invoice', verified: true },
    { id: 'ff', entityId: 'farm-feed', evidenceKind: 'tax_invoice', verified: true },
    { id: 'missing', entityId: 'digikraal', evidenceKind: 'prototype', verified: true },
  ])
  assert.deepEqual(pack.includedIds, ['ff'])
  assert.equal(pack.submitted, false)
  assert.equal(submitVatReturn().submitted, false)
  const sides = intercompanyPosition({ entityId: 'digikraal', cents: 500, evidenceIds: ['a'] }, { entityId: 'dk-agri', cents: 400, evidenceIds: ['b'] })
  assert.equal(sides.agreed, false)
  assert.equal(sides.altersStatutory, false)
  assert.equal(sides.closeBlocked, true)
  const agreed = intercompanyPosition({ entityId: 'digikraal', cents: 500, evidenceIds: ['a'] }, { entityId: 'farm-feed', cents: 500, evidenceIds: ['b'] })
  assert.equal(agreed.agreed && agreed.eliminationCents, 500)
  assert.equal(agreed.altersStatutory, false)
  assert.equal(agreed.posted, false)
  const unknown = intercompanyPosition({ entityId: 'digikraal', cents: null, evidenceIds: [] }, { entityId: 'dk-agri', cents: 0, evidenceIds: [] })
  assert.match(unknown.error ?? '', /not treated as zero/)
  const close = reviewMonthEnd({ reviewer: 'Conrad', bankReconciled: true, intercompanyAgreed: true, openBlockingExceptions: 0 })
  assert.equal(close.ok && close.periodLocked, false)
  assert.equal(close.ok && close.secondSignature, false)
  const blocked = reviewMonthEnd({ reviewer: 'Drikus', bankReconciled: true, intercompanyAgreed: false, openBlockingExceptions: 0 })
  assert.equal(blocked.ok, false)
  assert.equal(blocked.periodLocked, false)
})

test('approval and payment claims do not post or pay', () => {
  const bill = evidence({ id: 'bill', kind: 'supplier_document', live: true })
  const bank = evidence({ id: 'bank', kind: 'proof_of_payment', live: true, sourceSystem: 'bank' })
  assert.equal(bill.ok && bank.ok, true)
  if (!bill.ok || !bank.ok) return
  const ai = approveAccounting({ actor: 'Clark', proposalBy: 'Clark', obligationId: 'obl-1', entityId: 'digikraal', evidence: [bill.evidence], evidenceIds: ['bill'], auditWritable: true, at })
  assert.match(ai.ok ? '' : ai.error, /cannot approve/)
  const unaudited = approveAccounting({ actor: 'Emma', proposalBy: 'Emma', obligationId: 'obl-1', entityId: 'digikraal', evidence: [bill.evidence], evidenceIds: ['bill'], auditWritable: false, at })
  assert.match(unaudited.ok ? '' : unaudited.error, /audit record/)
  const emma = approveAccounting({ actor: 'Emma', proposalBy: 'Emma', obligationId: 'obl-1', entityId: 'digikraal', evidence: [bill.evidence], evidenceIds: ['bill'], auditWritable: true, at })
  assert.equal(emma.ok && emma.approval.posted, false)
  assert.equal(emma.ok && emma.approval.selfApproval, true)
  assert.equal(emma.ok && emma.approval.ledgerWrite, false)
  if (!emma.ok) return
  assert.equal(approvalStillCovers(emma.approval, ['other']), false)
  const forecast = createAmount({ cents: 1_500_000, basis: 'forecast', entityId: 'digikraal', evidenceIds: ['bill'], provenance: 'entered', live: false }, [bill.evidence])
  const cash = createAmount({ cents: 1_500_000, basis: 'cash_backed', entityId: 'digikraal', evidenceIds: ['bank'], provenance: 'bank_evidence', live: true }, [bank.evidence])
  assert.equal(forecast.ok && cash.ok && Boolean(forecast.amount) && Boolean(cash.amount), true)
  if (!forecast.ok || !cash.ok || !forecast.amount || !cash.amount) return
  const candidate = { id: 'bill-1', entityId: 'digikraal' as const, supplier: 'Example insurer', documentNumber: 'EX-100', cents: 1_500_000, date: '2026-10-20' }
  const duplicate = preparePayment({ id: 'pay-2', actor: 'Emma', obligationId: 'obl-1', cashImpact: forecast.amount, bills: [{ ...candidate, id: 'older' }], candidate, bankDetailsChanged: false, auditWritable: true })
  assert.match(duplicate.ok ? '' : duplicate.error, /stopped before payment/)
  const prepared = preparePayment({ id: 'pay-1', actor: 'Conrad', approver: 'Conrad', obligationId: 'obl-1', cashImpact: forecast.amount, bills: [], candidate, bankDetailsChanged: true, auditWritable: true })
  assert.equal(prepared.ok && prepared.payment.released, false)
  assert.equal(prepared.ok && prepared.payment.selfApproval, true)
  assert.equal(prepared.ok && prepared.payment.secondApproverRequired, false)
  assert.match(prepared.ok ? prepared.payment.warning : '', /bank details changed/)
  const drikus = preparePayment({ id: 'pay-3', actor: 'Emma', approver: 'DJ Eksteen', obligationId: 'obl-1', cashImpact: forecast.amount, bills: [], candidate, bankDetailsChanged: false, auditWritable: true })
  assert.equal(drikus.ok && drikus.payment.approvedBy, 'drikus')
  assert.equal(drikus.ok && drikus.payment.released, false)
  const emmaPays = reviewPaymentClaim({ actor: 'Emma', obligationId: 'obl-1', amount: cash.amount, evidence: [bank.evidence], approved: true, prepared: true, auditWritable: true })
  assert.equal(emmaPays.ok, false)
  assert.equal(emmaPays.released, false)
  const noted = reviewPaymentClaim({ actor: 'Drikus', obligationId: 'obl-1', amount: cash.amount, evidence: [bank.evidence], approved: true, prepared: true, auditWritable: true })
  assert.equal(noted.ok && noted.code, 'evidence_noted')
  assert.equal(noted.released, false)
  assert.equal(noted.paymentExecuted, false)
  const task = reviewPaymentClaim({ actor: 'Conrad', obligationId: 'obl-1', amount: forecast.amount, evidence: [bill.evidence], approved: true, prepared: true, auditWritable: true })
  assert.match(task.ok ? '' : task.error, /not a payment/)
  assert.equal(repaymentFromTask('pay back the loan').repaid, false)
  assert.equal(grantAccess().ok, false)
  assert.equal(payrollDiscovery.integrationClaimed, false)
  assert.equal(module009Integration.ledgerWrite, false)
  assert.equal(module009Integration.paymentExecution, false)
})

test('the 13-week view does not turn a forecast into cash or pool entities', () => {
  const schedule = evidence({ id: 'schedule', kind: 'prototype', live: false })
  const bank = evidence({ id: 'bank', kind: 'bank_statement', live: true, sourceSystem: 'bank' })
  const otherBank = evidence({ id: 'other', kind: 'bank_statement', live: true, sourceSystem: 'bank', entityId: 'farm-feed' })
  assert.equal(schedule.ok && bank.ok && otherBank.ok, true)
  if (!schedule.ok || !bank.ok || !otherBank.ok) return
  const forecast = createAmount({ cents: 100, basis: 'forecast', entityId: 'digikraal', evidenceIds: ['schedule'], provenance: 'demo', live: false }, [schedule.evidence])
  const actual = createAmount({ cents: 40, basis: 'cash_backed', entityId: 'digikraal', evidenceIds: ['bank'], provenance: 'bank_evidence', live: true }, [bank.evidence])
  const farm = createAmount({ cents: 70, basis: 'cash_backed', entityId: 'farm-feed', evidenceIds: ['other'], provenance: 'bank_evidence', live: true }, [otherBank.evidence])
  assert.equal(forecast.ok && actual.ok && farm.ok, true)
  if (!forecast.ok || !actual.ok || !farm.ok || !forecast.amount || !actual.amount || !farm.amount) return
  const empty = Array.from({ length: 13 }, () => null)
  const moved = thirteenWeek({ expected: [actual.amount, ...empty.slice(1)], approved: empty, actual: empty })
  assert.equal(moved.ok, false)
  const forecastLane = thirteenWeek({ expected: [forecast.amount, ...empty.slice(1)], approved: [forecast.amount, ...empty.slice(1)], actual: [actual.amount, ...empty.slice(1)] })
  assert.equal(forecastLane.ok && forecastLane.expectedCents, null)
  assert.equal(forecastLane.ok && forecastLane.actualCents, null)
  const labelled = labelledCash([{ entityId: 'digikraal', amount: actual.amount }, { entityId: 'farm-feed', amount: farm.amount }])
  assert.equal(labelled.ok && labelled.sameEntityCents, null)
  assert.equal(labelled.ok && labelled.rows.map((row) => row.entityId).join(','), 'digikraal,farm-feed')
  const pooled = labelledCash([{ entityId: null, amount: actual.amount }])
  assert.equal(pooled.ok, false)
})

test('the example desk blocks posting and payment while the lanes stay separate', () => {
  let state = exampleDeskState()
  assert.equal(state.example, true)
  assert.equal(state.forecast?.live, false)
  assert.equal(state.accrual, null)
  assert.equal(state.cash.digikraal, undefined)
  assert.equal(state.ledgerPosted, false)
  assert.equal(state.released, false)
  assert.equal(nextMove(state).title, 'Forecast only')
  assert.match(privateNoteFor(state), /stays with DJ/)
  state = applyDeskAction(state, { type: 'set-audience', audience: 'shared' })
  assert.equal(privateNoteFor(state), '')
  state = applyDeskAction(state, { type: 'post-ledger' })
  assert.match(state.alert, /does not post/)
  assert.equal(state.ledgerPosted, false)
  state = applyDeskAction(state, { type: 'release-bank' })
  assert.match(state.alert, /does not pay/)
  assert.equal(state.released, false)
  state = applyDeskAction(state, { type: 'add-document', amountRands: '', source: 'Folder', date: '2026-10-20', documentNumber: 'EX-100', at })
  assert.match(state.alert, /not zero/)
  state = applyDeskAction(state, { type: 'add-document', amountRands: '15000', source: 'Example folder', date: '2026-10-20', documentNumber: 'EX-100', at })
  assert.equal(state.forecast?.cents, 1_500_000)
  assert.equal(state.accrual?.cents, 1_500_000)
  assert.equal(state.accrual?.basis, 'accrual')
  assert.equal(state.ledgerPosted, false)
  const second = applyDeskAction(state, { type: 'add-document', amountRands: '15000', source: 'Example folder', date: '2026-10-20', documentNumber: 'EX-200', at })
  assert.match(second.alert, /already has a supplier document/)
  assert.equal(second.bills.length, 1)
  state = applyDeskAction(state, { type: 'add-bank-evidence', amountRands: '10000', source: 'Example statement', date: '2026-10-21', reference: 'BNK1', at })
  assert.equal(state.cash.digikraal?.basis, 'cash_backed')
  assert.equal(state.cash.digikraal?.live, false)
  assert.equal(state.match?.status, 'proposed')
  assert.equal(state.match?.residualCents, 0)
  assert.match(state.match?.explanation ?? '', /Unmatched obligation R 5 000\.00/)
  assert.equal(state.released, false)
  const clark = applyDeskAction(state, { type: 'approve-match', actor: 'Clark', resolution: 'Auto close.', at })
  assert.match(clark.alert, /cannot approve/)
  assert.equal(clark.exception.closed, false)
  state = applyDeskAction(state, { type: 'approve-match', actor: 'Emma', resolution: 'Example bank line attached.', at })
  assert.equal(state.match?.status, 'matched')
  assert.equal(state.exception.closed, true)
  assert.match(state.exception.history[0]?.text ?? '', /Opened/)
  state = applyDeskAction(state, { type: 'approve-accounting', actor: 'Clark', at })
  assert.match(state.alert, /cannot approve/)
  state = applyDeskAction(state, { type: 'approve-accounting', actor: 'Emma', at })
  assert.match(state.message, /Nothing was posted/)
  assert.equal(state.approval?.posted, false)
  state = applyDeskAction(state, { type: 'prepare-payment', actor: 'Conrad', at })
  assert.equal(state.payment?.released, false)
  assert.equal(state.payment?.selfApproval, true)
  const paid = applyDeskAction(state, { type: 'claim-paid', actor: 'Conrad' })
  assert.equal(paid.released, false)
  assert.equal(paid.paymentExecuted, false)
  assert.match(paid.alert, /not a payment|does not release|bank stays authoritative/)
  const moved = applyDeskAction(paid, { type: 'switch-entity', entityId: 'dk-agri' })
  assert.equal(visibleMoney(moved).forecast, null)
  assert.equal(visibleMoney(moved).cash, null)
  const vat = applyDeskAction(moved, { type: 'apply-vat', ratePercent: '15', amountRands: '1000' })
  assert.match(vat.alert, /cannot inherit/)
  assert.equal(vat.ledgerPosted, false)
})

function evidence(input: { id: string; kind: 'prototype' | 'bank_statement' | 'supplier_document' | 'proof_of_payment'; live: boolean; sourceSystem?: 'prototype' | 'bank' | 'manual'; entityId?: 'digikraal' | 'farm-feed' }) {
  return createEvidence({
    id: input.id,
    kind: input.kind,
    entityId: input.entityId ?? 'digikraal',
    sourceSystem: input.sourceSystem ?? (input.kind === 'prototype' ? 'prototype' : 'manual'),
    sourceRef: input.id,
    capturedOn: '2026-10-20',
    wording: `Evidence ${input.id}`,
    live: input.live,
  })
}

function obligation(id: string, views: ['corporate_register' | 'payment_queue' | 'cash_forecast' | 'document_checklist' | 'accounting_posting' | 'renewal_calendar' | 'founder_decision', ...Array<'corporate_register' | 'payment_queue' | 'cash_forecast' | 'document_checklist' | 'accounting_posting' | 'renewal_calendar' | 'founder_decision'>]) {
  return { id, entityId: 'digikraal' as const, kind: 'insurance_renewal' as const, title: 'Example insurance renewal', counterparty: 'Example insurer', dueDate: '2026-11-30', views, evidenceIds: [] as string[] }
}

function sumError(amounts: Array<StatedAmount | null>, basis: 'forecast' | 'cash_backed'): string {
  const result = sumSameBasis(amounts, basis, 'digikraal')
  return result.ok ? '' : result.error
}
