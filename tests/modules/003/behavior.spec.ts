import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import { applyAction, commercialStage, commissionPosition, compareRequirement, emptyNorthpoint, intakeSourceFor, integrationContract, readState, stalledItems, type NorthpointState } from '../../../lib/modules/003'

const at = '2026-10-25T12:00:00.000Z'
function evidence(overrides: Record<string, unknown> = {}) {
  return { level: 1, statement: 'The seller said this on the call.', sourceRef: 'Call note', recordedBy: 'Drikus', recordedAt: at, channel: 'internal', ...overrides }
}
function must(result: { ok: true; value: NorthpointState } | { ok: false; error: string }) {
  if (!result.ok) throw new Error(result.error)
  return result.value
}
function captureProperty(location = '') {
  return must(applyAction(emptyNorthpoint(), { type: 'capture_property', id: 'prop-1', at, label: 'Seller call about a Paarl smallholding', segment: 'farm', transaction: 'sale', partyLabel: 'The seller on the call', partyRole: 'seller', location, confidential: false, sourceKind: 'phone', sourceNote: 'He said  he may sell. No price yet.', recordedBy: 'Drikus' }))
}
function captureRequirement(state: NorthpointState) {
  return must(applyAction(state, { type: 'capture_requirement', id: 'req-1', at, partyLabel: 'The buyer on the call', role: 'buyer', segment: 'farm', transaction: 'sale', sourceKind: 'referral', sourceNote: 'A farmer asked for grazing near Paarl.', recordedBy: 'Drikus' }))
}
function answered(state: NorthpointState) {
  let current = must(applyAction(state, { type: 'add_location', requirementId: 'req-1', at, location: 'Paarl', evidence: evidence() }))
  current = must(applyAction(current, { type: 'record_budget', requirementId: 'req-1', at, bound: 'max', amount: '5000000', evidence: evidence() }))
  current = must(applyAction(current, { type: 'record_text', requirementId: 'req-1', at, field: 'timeframe', value: 'This year', evidence: evidence() }))
  for (const key of ['intent', 'proofOfFunds', 'decisionMakers', 'propertyFit', 'ficaReadiness']) current = must(applyAction(current, { type: 'state_qualification', requirementId: 'req-1', at, key, evidence: evidence() }))
  return current
}
function qualify(state: NorthpointState) {
  const current = must(applyAction(answered(state), { type: 'record_consent', requirementId: 'req-1', at, value: 'stated_yes', evidence: evidence() }))
  return must(applyAction(current, { type: 'advance_requirement', requirementId: 'req-1', at, to: 'qualified', actor: 'Drikus', reviewer: 'Drikus', reason: 'The buyer answered the questions.', evidence: evidence(), acknowledgeSkip: true }))
}
function farmFacts(state: NorthpointState) {
  let current = state
  for (const key of ['water', 'zoning', 'servitudes', 'infrastructure']) {
    const statement = 'As stated on the call.'
    current = must(applyAction(current, { type: 'record_fact', propertyId: 'prop-1', at, key, statement, evidence: evidence() }))
    current = must(applyAction(current, { type: 'record_requirement_fact', requirementId: 'req-1', at, key, statement, evidence: evidence() }))
  }
  return current
}

test('module stays internal to the Northpoint catalogue and reuses the shared stage lens', () => {
  const state = emptyNorthpoint()
  expect(state).toMatchObject({ module: '003', company: 'northpoint', name: 'Northpoint Realty', visibility: 'internal' })
  expect(integrationContract.refuses).toContain('commission_calculation')
  expect(commercialStage('lead').key).toBe('intake')
  expect(commercialStage('property_matched').key).toBe('match')
  expect(commercialStage('otp_signed').key).toBe('document')
  expect(commercialStage('transfer_instructed').key).toBe('close')
  expect(intakeSourceFor('phone')).toBe('WhatsApp/text/voice/call')
  expect(intakeSourceFor('property24_stated')).toBeNull()
})

test('capture keeps the source wording and does not invent a price or a connection', () => {
  const state = captureProperty()
  const property = state.properties[0]
  expect(property.source.note).toBe('He said  he may sell. No price yet.')
  expect(property.source.connected).toBe(false)
  expect(property.asking).toEqual({ state: 'unknown' })
  expect(property.publication).toEqual({ property24: 'not_connected', propverse: 'not_connected', manualReference: null })
  expect(property.legalDetermination).toBe('none')
  const blank = applyAction(state, { type: 'record_asking', propertyId: 'prop-1', at, amount: '', evidence: evidence() })
  const zero = applyAction(state, { type: 'record_asking', propertyId: 'prop-1', at, amount: '0', evidence: evidence() })
  expect(blank.ok).toBe(false)
  expect(zero.ok).toBe(false)
  if (!zero.ok) expect(zero.error).toContain('not stored as zero')
  expect(state.properties[0].asking).toEqual({ state: 'unknown' })
})

test('mandate review keeps stated terms and never calculates or legalises them', () => {
  let state = captureProperty('Paarl')
  state = must(applyAction(state, { type: 'propose_mandate', propertyId: 'prop-1', at, mandateType: 'sole', actor: 'Drikus' }))
  const terms = 'Seller said the office schedule applies. No figure was typed.'
  state = must(applyAction(state, { type: 'record_terms', propertyId: 'prop-1', at, terms, actor: 'Drikus' }))
  expect(state.properties[0].mandate.commissionTerms).toBe(terms)
  expect(commissionPosition(terms)).toEqual({ status: 'not_calculated', statedTerms: terms, reason: expect.stringContaining('Nothing is calculated') })
  expect(commissionPosition(terms)).not.toHaveProperty('amount')
  state = must(applyAction(state, { type: 'submit_mandate', propertyId: 'prop-1', at, actor: 'Drikus' }))
  const machineReview = applyAction(state, { type: 'review_mandate', propertyId: 'prop-1', at, reviewer: 'AI', decision: 'accept', note: 'Looks fine.' })
  expect(machineReview.ok).toBe(false)
  state = must(applyAction(state, { type: 'review_mandate', propertyId: 'prop-1', at, reviewer: 'Drikus', decision: 'accept', note: 'Reviewed for the file. Not a legal opinion.' }))
  const early = applyAction(state, { type: 'record_signature', propertyId: 'prop-1', at, actor: 'Drikus', expiry: '2027-01-31', evidence: evidence() })
  expect(early.ok).toBe(false)
  state = must(applyAction(state, { type: 'record_signature', propertyId: 'prop-1', at, actor: 'Drikus', expiry: '2027-01-31', evidence: evidence({ level: 3, statement: 'The signed mandate was in the file.', sourceRef: 'Mandate file' }) }))
  expect(state.properties[0].mandate.legalDetermination).toBe('none')
  expect(state.properties[0].mandate.headOffice).toBe('external_and_not_replaceable')
  expect(JSON.stringify(state)).not.toContain('commissionPercent')
  const changed = applyAction(state, { type: 'record_terms', propertyId: 'prop-1', at, terms: 'Changed after signature', actor: 'Drikus' })
  expect(changed.ok).toBe(false)
})

test('farm matching uses specialist facts and does not borrow residential logic', () => {
  let state = qualify(captureRequirement(captureProperty('Paarl')))
  state = must(applyAction(state, { type: 'record_asking', propertyId: 'prop-1', at, amount: '4000000', evidence: evidence() }))
  const bedrooms = applyAction(state, { type: 'record_fact', propertyId: 'prop-1', at, key: 'bedrooms', statement: '4', evidence: evidence() })
  expect(bedrooms.ok).toBe(false)
  const blocked = applyAction(state, { type: 'advance_property', propertyId: 'prop-1', at, to: 'property_matched', actor: 'Drikus', reviewer: 'Drikus', reason: 'Possible fit.', evidence: evidence(), acknowledgeSkip: true, requirementId: 'req-1' })
  expect(blocked.ok).toBe(false)
  if (!blocked.ok) expect(blocked.error).toContain('Water rights')
  state = farmFacts(state)
  state = must(applyAction(state, { type: 'advance_property', propertyId: 'prop-1', at, to: 'qualified', actor: 'Drikus', reviewer: 'Drikus', reason: 'The place was stated.', evidence: evidence(), acknowledgeSkip: false }))
  state = must(applyAction(state, { type: 'advance_property', propertyId: 'prop-1', at, to: 'property_matched', actor: 'Drikus', reviewer: 'Drikus', reason: 'The stated facts align.', evidence: evidence(), acknowledgeSkip: false, requirementId: 'req-1' }))
  const report = compareRequirement(state.requirements[0], state.properties[0], 'internal')
  expect(report.aligned).toBeTruthy()
  expect(report.clientMessage).toBeNull()
  expect(report.sent).toBe(false)
  expect(JSON.stringify(report)).not.toContain('bedroom')
  const hidden = compareRequirement(state.requirements[0], state.properties[0], 'external')
  expect(hidden.withheld).toBe(true)
  expect(JSON.stringify(hidden)).not.toContain('Paarl')
})

test('stage history is reviewed, scrutiny is external, and commission cannot be marked', () => {
  let state = farmFacts(qualify(captureRequirement(captureProperty('Paarl'))))
  state = must(applyAction(state, { type: 'record_asking', propertyId: 'prop-1', at, amount: '4000000', evidence: evidence() }))
  const before = structuredClone(state)
  const commission = applyAction(state, { type: 'advance_property', propertyId: 'prop-1', at, to: 'commission_paid', actor: 'Drikus', reviewer: 'Drikus', reason: 'Paid.', evidence: evidence(), acknowledgeSkip: true, requirementId: 'req-1' })
  expect(commission.ok).toBe(false)
  if (!commission.ok) expect(commission.error).toContain('No commission split')
  expect(state).toEqual(before)
  const machine = applyAction(state, { type: 'advance_property', propertyId: 'prop-1', at, to: 'qualified', actor: 'system', reviewer: 'Drikus', reason: 'Move it.', evidence: evidence(), acknowledgeSkip: false })
  expect(machine.ok).toBe(false)
  state = must(applyAction(state, { type: 'advance_property', propertyId: 'prop-1', at, to: 'property_matched', actor: 'Drikus', reviewer: 'Drikus', reason: 'The stated facts align.', evidence: evidence(), acknowledgeSkip: true, requirementId: 'req-1' }))
  expect(state.properties[0].history[0].skipped).toEqual(['qualified'])
  const jump = applyAction(state, { type: 'advance_property', propertyId: 'prop-1', at, to: 'transfer_instructed', actor: 'Drikus', reviewer: 'Drikus', reason: 'Skip the office.', evidence: evidence({ channel: 'external_head_office' }), acknowledgeSkip: true, requirementId: 'req-1', attorneyRef: 'The named attorney' })
  expect(jump.ok).toBe(false)
  if (!jump.ok) expect(jump.error).toContain('cannot be skipped')
})

test('documents, consent and portal references do not become clearance, contact or publication', () => {
  let state = captureProperty('Paarl')
  state = must(applyAction(state, { type: 'record_reference', propertyId: 'prop-1', at, reference: 'Typed portal note', recordedBy: 'Drikus' }))
  expect(state.properties[0].publication.property24).toBe('not_connected')
  expect(state.properties[0].publication.manualReference).toBe('Typed portal note')
  state = answered(captureRequirement(state))
  state = must(applyAction(state, { type: 'record_consent', requirementId: 'req-1', at, value: 'stated_no', evidence: evidence() }))
  const contact = applyAction(state, { type: 'advance_requirement', requirementId: 'req-1', at, to: 'matching', actor: 'Drikus', reviewer: 'Drikus', reason: 'Try to match.', evidence: evidence(), acknowledgeSkip: true })
  expect(contact.ok).toBe(false)
  if (!contact.ok) expect(contact.error).toContain('Consent was stated as no')
  const sent = applyAction(qualify(captureRequirement(captureProperty('Stellenbosch'))), { type: 'advance_requirement', requirementId: 'req-1', at, to: 'properties_sent', actor: 'Drikus', reviewer: 'Drikus', reason: 'The agent already handed over a list.', evidence: evidence({ level: 2 }), acknowledgeSkip: true })
  state = must(sent)
  expect(state.requirements[0].sentByPivot).toBe(false)
  expect(state.requirements[0].outbound).toBe('not_enabled')
  const tampered = readState({ ...emptyNorthpoint(), legalApproval: true })
  expect(tampered.ok).toBe(false)
  const stalled = must(stalledItems(captureProperty(), '2026-12-01T12:00:00.000Z', 14))
  expect(stalled[0].days).toBeGreaterThanOrEqual(14)
})

test('owned source does not call a provider or read a secret', () => {
  const files = ['lib/modules/003', 'components/modules/003'].flatMap((dir) => walk(dir))
  const text = files.map((file) => readFileSync(file, 'utf8')).join('\n')
  expect(text).not.toContain('supabase')
  expect(text).not.toContain('fetch(')
  expect(text).not.toContain('process.env')
  expect(text).not.toContain('googleapis')
})

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })
}
