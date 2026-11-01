import assert from 'node:assert/strict'
import { test } from 'node:test'
import { module008Integration } from '../../../lib/modules/008/index'
import { approvalFromEvidence, availableCashCents, countsAsCash, evidenceGrades, presentFigures, provesLegalCondition, provesPerformance } from '../../../lib/modules/008/evidence'
import { assessOrdinary, assessReserved, matterPayload, readShareRegister, reservedMatters, type Vote } from '../../../lib/modules/008/governance'
import { applyDeskAction, deskDecision, exampleDeskState, nextMove, visibleToCompany } from '../../../lib/modules/008/desk'
import { assessDistribution, assessRelease, conditionMet, overrideKey, proposalKey, type Condition, type FundingOverride, type ReleaseInput } from '../../../lib/modules/008/release'
import { exampleScore, scoreDimensions, scorePortfolio, type ScoreDimension } from '../../../lib/modules/008/score'
import { openVenture, policyPayload, policyTopics, ubuntuProductBlock, ventureStages, type PolicyRecord, type UbuntuProduct } from '../../../lib/modules/008/venture'

const at = '2026-10-25T12:00:00.000Z'

function board(payload: string, channel: Vote['channel'] = 'formal_record'): Vote[] {
  return [
    { person: 'Tiaan Oosthuizen', group: 'its', capacity: 'board_representative', outcome: 'approve', channel, payloadKey: payload },
    { person: 'CJ du Plessis', group: 'cj_du_plessis', capacity: 'board_representative', outcome: 'approve', channel, payloadKey: payload },
    { person: 'DJ Eksteen', group: 'dj_eksteen', capacity: 'board_representative', outcome: 'approve', channel, payloadKey: payload },
  ]
}

function resolvedPolicy(product: UbuntuProduct = 'camp_cattle'): PolicyRecord {
  return {
    product,
    status: 'resolved',
    evidenceGrade: 'signed_legal_document',
    source: 'Example signed policy',
    sourceDate: '2026-10-20',
    draftAssignsLoss: false,
    topics: policyTopics.map((topic) => topic.id),
    votes: board(policyPayload(product)),
  }
}

function ready(patch: Partial<ReleaseInput> = {}): ReleaseInput {
  const base: ReleaseInput = {
    company: 'digikraal',
    stage: 'awaiting_board',
    ventureId: 'venture-example',
    amountCents: 25_000_000,
    requester: 'Project sponsor',
    verifier: 'Finance verifier',
    votes: [],
    conditions: [
      { id: 'reporting', kind: 'reporting', label: 'Monthly reporting', state: 'satisfied', evidenceGrade: 'verified_statement' },
      { id: 'stock', kind: 'stock_count', label: 'Opening stock count', state: 'satisfied', evidenceGrade: 'actual' },
      { id: 'agreements', kind: 'agreements_signed', label: 'Shareholder and project agreements', state: 'satisfied', evidenceGrade: 'signed_legal_document' },
    ],
    policy: resolvedPolicy(),
    ubuntu: { participantType: 'A', product: 'camp_cattle' },
    cashGrade: 'verified_statement',
    actualCents: 25_000_000,
    override: null,
    ...patch,
  }
  if (!patch.votes) base.votes = board(proposalKey(base))
  return base
}

test('module 008 stays an internal DigiKraal gate and does not execute capital', () => {
  assert.equal(module008Integration.moduleId, '008')
  assert.equal(module008Integration.company, 'digikraal')
  assert.match(module008Integration.execution, /refused/i)
  assert.equal(ventureStages.length, 14)
  assert.equal(policyTopics.length, 13)
  assert.equal(scoreDimensions.length, 13)
  assert.equal(reservedMatters.length, 17)
  for (const grade of evidenceGrades) assert.deepEqual(approvalFromEvidence(grade), [])
  assert.equal(provesLegalCondition('signed_legal_document'), true)
  assert.equal(provesPerformance('whatsapp_message') || countsAsCash('pipeline_proposal') || countsAsCash('forecast'), false)
  const figures = { pipelineCents: 100_000_000, contractedCents: 50_000_000, approvedCaseCents: 40_000_000, forecastCents: 90_000_000, actualCents: null }
  assert.equal(presentFigures(figures).length, 5)
  assert.equal(availableCashCents(figures, 'pipeline_proposal'), null)
  assert.equal(availableCashCents(figures, 'forecast'), null)
})

test('unclear ventures stay in discovery and products stay on their participant type', () => {
  const unclear = openVenture({ id: 'v1', company: 'digikraal', name: 'Unclear camp', pillar: 'sme_livestock_finance', sponsor: 'Sponsor', capitalCents: null, clearOpportunity: true })
  const clear = openVenture({ id: 'v2', company: 'digikraal', name: 'Clear camp', pillar: 'sme_livestock_finance', sponsor: 'Sponsor', capitalCents: 100, clearOpportunity: true })
  assert.equal(unclear.ok && unclear.venture.stage, 'discovery')
  assert.equal(clear.ok && clear.venture.stage, 'idea')
  assert.equal(openVenture({ id: 'v3', company: 'northpoint', name: 'Agency', pillar: null, sponsor: 'Sponsor', capitalCents: null, clearOpportunity: false }).ok, false)
  assert.match(ubuntuProductBlock({ participantType: 'A', product: 'working_capital' }) ?? '', /Type A cannot use the Type D/)
  assert.match(ubuntuProductBlock({ participantType: 'B', product: 'working_capital' }) ?? '', /only for Type D/)
  assert.match(ubuntuProductBlock({ participantType: 'D', product: 'camp_cattle' }) ?? '', /not priced as the camp product/)
  assert.equal(ubuntuProductBlock({ participantType: 'A', product: 'camp_cattle' }), null)
})

test('capital release stays blocked without unanimous formal approval, cash and conditions', () => {
  const authorised = assessRelease(ready())
  assert.equal(authorised.status, 'authorised')
  assert.equal(authorised.executed, false)
  assert.equal(authorised.receipt, 'unconfirmed')
  assert.match(authorised.statement, /No money moved/)
  assert.equal(assessRelease(ready({ votes: board(proposalKey(ready()), 'whatsapp') })).status, 'blocked')
  assert.match(assessRelease(ready({ votes: board('other-proposal') })).blockers.join(' '), /different proposal/)
  const drifted = ready()
  assert.match(assessRelease({ ...drifted, amountCents: 26_000_000 }).blockers.join(' '), /different proposal/)
  assert.match(assessRelease(ready({ verifier: 'Project sponsor' })).blockers.join(' '), /requester cannot be the sole verifier/)
  assert.match(assessRelease(ready({ verifier: 'AI' })).blockers.join(' '), /automated actor/)
  const tiaan = board(proposalKey(ready()))
  tiaan[1] = { ...tiaan[1], person: 'Tiaan Oosthuizen' }
  assert.match(assessRelease(ready({ votes: tiaan })).blockers.join(' '), /not the direct Digikraal shareholder/)
  assert.match(assessRelease(ready({ company: 'northpoint' })).blockers.join(' '), /DigiKraal/)
  assert.match(assessRelease(ready({ stage: 'idea' })).blockers.join(' '), /cannot receive capital/)
  assert.match(assessRelease(ready({ stage: 'hold_correct_exit' })).blockers.join(' '), /cannot receive capital/)
  assert.match(assessRelease(ready({ ubuntu: { participantType: 'A', product: 'working_capital' } })).blockers.join(' '), /Type A/)
  assert.match(assessRelease(ready({ cashGrade: 'pipeline_proposal', actualCents: 100_000_000 })).blockers.join(' '), /not cash available/)
  assert.match(assessRelease(ready({ actualCents: 1_000 })).blockers.join(' '), /does not cover/)
  assert.equal(conditionMet({ id: 'a', kind: 'agreements_signed', label: 'Agreements', state: 'satisfied', evidenceGrade: 'whatsapp_message' }), false)
  assert.equal(conditionMet({ id: 'r', kind: 'reporting', label: 'Reporting', state: 'satisfied', evidenceGrade: 'signed_resolution' }), false)
})

test('funding stops on overdue controls and an override cannot skip policy or legal conditions', () => {
  const overdue: Condition = { id: 'reporting', kind: 'reporting', label: 'Monthly reporting', state: 'overdue', evidenceGrade: null }
  const open: Condition = { id: 'agreements', kind: 'agreements_signed', label: 'Shareholder and project agreements', state: 'open', evidenceGrade: null }
  const satisfied: Condition = { id: 'stock', kind: 'stock_count', label: 'Opening stock count', state: 'satisfied', evidenceGrade: 'verified_statement' }
  assert.match(assessRelease(ready({ conditions: [overdue, satisfied, { ...open, state: 'satisfied', evidenceGrade: 'signed_legal_document' }] })).blockers.join(' '), /Funding stopped/)
  const reason = 'The report was filed with the board pack.'
  const override: FundingOverride = { reason, kinds: ['reporting'], votes: board(overrideKey({ reason, kinds: ['reporting'] })) }
  const lifted = assessRelease(ready({ conditions: [overdue, satisfied, { ...open, state: 'satisfied', evidenceGrade: 'signed_legal_document' }], override }))
  assert.equal(lifted.status, 'authorised')
  assert.equal(lifted.executed, false)
  assert.match(lifted.statement, /No money moved/)
  assert.match(assessRelease(ready({ conditions: [overdue, satisfied, open], override })).blockers.join(' '), /still open/)
  assert.match(assessRelease(ready({ policy: { ...resolvedPolicy(), status: 'unresolved', draftAssignsLoss: true }, override, conditions: [overdue, satisfied, { ...open, state: 'satisfied', evidenceGrade: 'signed_legal_document' }] })).blockers.join(' '), /unresolved|draft/)
  assert.match(assessRelease(ready({ conditions: [overdue, satisfied, { ...open, state: 'satisfied', evidenceGrade: 'signed_legal_document' }], override: { ...override, votes: board(overrideKey({ reason, kinds: ['reporting'] }), 'whatsapp') } })).blockers.join(' '), /Funding stopped/)
})

test('governance distinguishes ordinary matters, reserved matters and the share register', () => {
  const key = matterPayload('shares')
  const founders = board(key).filter((vote) => vote.group !== 'its')
  const ordinary = assessOrdinary(founders, key)
  assert.equal(ordinary.passed, true)
  assert.equal(ordinary.executed, false)
  assert.match(ordinary.statement, /shareholder agreement/)
  assert.equal(assessOrdinary(board(key).filter((vote) => vote.group === 'its'), key).passed, false)
  assert.equal(assessReserved('shares', founders, key).passed, false)
  assert.equal(assessReserved('shares', board(key), key).executed, false)
  assert.equal(assessReserved('shares', board(key), key).passed, true)
  assert.equal(assessRelease(ready({ votes: founders })).status, 'blocked')
  const register = readShareRegister([
    { holder: 'ITS Asset Management', group: 'its', bps: 5000, representative: 'Tiaan Oosthuizen', evidenceGrade: 'signed_legal_document' },
    { holder: 'CJ du Plessis', group: 'cj_du_plessis', bps: 2500, representative: null, evidenceGrade: 'signed_legal_document' },
    { holder: 'DJ Eksteen', group: 'dj_eksteen', bps: 2500, representative: null, evidenceGrade: 'signed_legal_document' },
  ])
  assert.equal(register.ok, true)
  assert.equal(readShareRegister([
    { holder: 'Tiaan Oosthuizen', group: 'its', bps: 5000, representative: null, evidenceGrade: 'signed_legal_document' },
    { holder: 'CJ du Plessis', group: 'cj_du_plessis', bps: 2500, representative: null, evidenceGrade: 'signed_legal_document' },
    { holder: 'DJ Eksteen', group: 'dj_eksteen', bps: 2500, representative: null, evidenceGrade: 'signed_legal_document' },
  ]).ok, false)
  const mislabelled = readShareRegister([
    { holder: 'ITS Asset Management', group: 'its', bps: 5000, representative: null, evidenceGrade: 'signed_legal_document' },
    { holder: 'CJ du Plessis', group: 'cj_du_plessis', bps: 2500, representative: 'Tiaan Oosthuizen', evidenceGrade: 'signed_legal_document' },
    { holder: 'DJ Eksteen', group: 'dj_eksteen', bps: 2500, representative: null, evidenceGrade: 'signed_legal_document' },
  ])
  assert.equal(mislabelled.ok, false)
  if (!mislabelled.ok) assert.match(mislabelled.error, /not the direct Digikraal shareholder/)
  const unsigned = readShareRegister([
    { holder: 'ITS Asset Management', group: 'its', bps: 5000, representative: null, evidenceGrade: 'spreadsheet_row' },
    { holder: 'CJ du Plessis', group: 'cj_du_plessis', bps: 2500, representative: null, evidenceGrade: 'signed_legal_document' },
    { holder: 'DJ Eksteen', group: 'dj_eksteen', bps: 2500, representative: null, evidenceGrade: 'signed_legal_document' },
  ])
  assert.equal(unsigned.ok, false)
  if (!unsigned.ok) assert.match(unsigned.error, /signed legal evidence/)
})

test('the portfolio score withholds missing evidence and cannot release capital', () => {
  const missing = scorePortfolio(exampleScore())
  assert.equal(missing.points, null)
  assert.equal(missing.decidesCapital, false)
  assert.match(missing.blockers.join(' '), /not treated as zero/)
  assert.match(missing.statement, /does not release capital/)
  const weightsBps = Object.fromEntries(scoreDimensions.map((dimension, index) => [dimension, index === scoreDimensions.length - 1 ? 400 : 800])) as Record<ScoreDimension, number>
  const scores = Object.fromEntries(scoreDimensions.map((dimension) => [dimension, 50])) as Record<ScoreDimension, number>
  const scored = scorePortfolio({ weightsApproved: true, weightsBps, scores })
  assert.equal(scored.points, 50)
  assert.equal(scored.decidesCapital, false)
  const withZero = scorePortfolio({ weightsApproved: true, weightsBps, scores: { ...scores, downside: 0 } })
  assert.equal(withZero.points, 46)
  assert.equal(withZero.decidesCapital, false)
  assert.equal(assessRelease(ready({ stage: 'discovery' })).status, 'blocked')
})

test('distributions stay unpaid when reserves are thin and when the figures are clear', () => {
  const thin = assessDistribution({ reserveCents: 100, minimumReserveCents: 70, payoutCents: 40, solvencyEvidenced: true, liquidityEvidenced: true, taxEvidenced: true, covenantClear: true })
  assert.equal(thin.executed, false)
  assert.match(thin.blockers.join(' '), /minimum reserve/)
  const clear = assessDistribution({ reserveCents: 100, minimumReserveCents: 50, payoutCents: 40, solvencyEvidenced: true, liquidityEvidenced: true, taxEvidenced: true, covenantClear: true })
  assert.equal(clear.status, 'blocked')
  assert.equal(clear.executed, false)
  assert.match(clear.blockers.join(' '), /does not pay/)
  const unknown = assessDistribution({ reserveCents: null, minimumReserveCents: null, payoutCents: null, solvencyEvidenced: false, liquidityEvidenced: false, taxEvidenced: false, covenantClear: false })
  assert.match(unknown.blockers.join(' '), /not treated as zero/)
})

test('the example desk records a decision only after policy, evidence, cash and a separate verifier', () => {
  let state = exampleDeskState()
  assert.equal(visibleToCompany(state, 'northpoint'), null)
  assert.equal(visibleToCompany(state, 'digikraal')?.venture.company, 'digikraal')
  assert.equal(deskDecision(state).executed, false)
  assert.equal(nextMove(state).action, 'policy')
  state = applyDeskAction(state, { type: 'record-whatsapp', at })
  assert.match(state.alert, /not the board decision/)
  assert.equal(deskDecision(state).status, 'blocked')
  state = applyDeskAction(state, { type: 'record-policy', its: 'Tiaan Oosthuizen', cj: 'CJ du Plessis', dj: 'DJ Eksteen', source: 'Example policy pack', sourceDate: '2026-10-20', signed: false, at })
  assert.match(state.alert, /draft/)
  state = applyDeskAction(state, { type: 'record-policy', its: 'Tiaan Oosthuizen', cj: 'CJ du Plessis', dj: 'DJ Eksteen', source: 'Example policy pack', sourceDate: '2026-10-20', signed: true, at })
  assert.equal(nextMove(state).title, 'Funding stopped')
  state = applyDeskAction(state, { type: 'clear-stop', conditionId: nextMove(state).conditionId ?? '', source: 'Example reporting pack', sourceDate: '2026-10-20', at })
  state = applyDeskAction(state, { type: 'clear-stop', conditionId: nextMove(state).conditionId ?? '', source: 'Example stock count', sourceDate: '2026-10-21', at })
  assert.match(nextMove(state).detail, /agreements/)
  state = applyDeskAction(state, { type: 'satisfy-agreement', conditionId: nextMove(state).conditionId ?? '', source: 'Example signed agreements', sourceDate: '2026-10-22', at })
  assert.equal(nextMove(state).action, 'cash')
  assert.equal(state.figures.pipelineCents, 100_000_000)
  assert.equal(state.figures.actualCents, null)
  state = applyDeskAction(state, { type: 'record-cash', amountRands: '', source: 'Example bank statement', sourceDate: '2026-10-23', at })
  assert.match(state.alert, /not treated as zero/)
  state = applyDeskAction(state, { type: 'record-cash', amountRands: '250000', source: 'Example bank statement', sourceDate: '2026-10-23', at })
  assert.equal(state.figures.forecastCents, 90_000_000)
  assert.equal(state.figures.actualCents, 25_000_000)
  state = applyDeskAction(state, { type: 'record-votes', its: 'Tiaan Oosthuizen', cj: 'CJ du Plessis', dj: 'DJ Eksteen', verifier: 'Project sponsor', at })
  assert.match(state.alert, /requester/)
  state = applyDeskAction(state, { type: 'record-votes', its: 'Tiaan Oosthuizen', cj: 'Tiaan Oosthuizen', dj: 'DJ Eksteen', verifier: 'Finance verifier', at })
  assert.match(state.alert, /not the direct Digikraal shareholder/)
  state = applyDeskAction(state, { type: 'record-votes', its: 'Tiaan Oosthuizen', cj: 'CJ du Plessis', dj: 'DJ Eksteen', verifier: 'Finance verifier', at })
  const decision = deskDecision(state)
  assert.equal(decision.status, 'authorised')
  assert.equal(decision.executed, false)
  assert.equal(decision.receipt, 'unconfirmed')
  assert.equal(state.venture.stage, 'approved_with_conditions')
  state = applyDeskAction(state, { type: 'transfer' })
  assert.match(state.alert, /does not transfer/)
  assert.equal(deskDecision(state).status, 'authorised')
  state = applyDeskAction(state, { type: 'invest' })
  assert.match(state.alert, /does not invest/)
  state = applyDeskAction(state, { type: 'distribute' })
  assert.match(state.alert, /does not pay a distribution/)
})
