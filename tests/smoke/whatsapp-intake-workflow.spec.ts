import { expect, test } from '@playwright/test'
import {
  addIntakeSuggestion,
  advanceFounderClarificationOutbox,
  answerClarification,
  approveIntakeContext,
  buildClarificationState,
  captureIntakeItem,
  classifyIntakeReply,
  completeIntakeNeedsAction,
  confirmGroupReplySent,
  connectionsMustNotCollide,
  decideIntakeSuggestion,
  draftGroupReply,
  isOwnClarificationEcho,
  markGroupReplyCopied,
  markIntakeRead,
  mergeIntakeIdempotent,
  planFounderClarificationOutbox,
  promoteApprovedSuggestion,
  readWhatsappDualConnections,
  rejectCustomerOrGroupOutbox,
  rejectUnknownIntakeSender,
  registerClarificationOutbound,
  workCaseFromPromotion,
  workIdForIntakeSuggestion,
} from '../../lib/whatsapp'

test('dual connections must not collide and intake allowlist rejects strangers', () => {
  const dual = readWhatsappDualConnections({
    WHATSAPP_PHONE_NUMBER_ID: 'shared-1',
    WHATSAPP_DISPLAY_E164: '+27827721220',
    WHATSAPP_INTAKE_PHONE_NUMBER_ID: 'intake-2',
    WHATSAPP_INTAKE_DISPLAY_E164: '+27820000000',
  })
  expect(dual.shared.role).toBe('shared-one-to-one')
  expect(dual.intake.role).toBe('dedicated-intake')
  expect(connectionsMustNotCollide(dual).ok).toBe(true)
  expect(connectionsMustNotCollide({
    ...dual,
    intake: { ...dual.intake, phoneNumberId: 'shared-1' },
  }).ok).toBe(false)
  expect(rejectUnknownIntakeSender('+27829999999', [{ e164: '+27827721220', label: 'Drikus', role: 'founder', verified: true }]).ok).toBe(false)
  expect(rejectUnknownIntakeSender('+27827721220').ok).toBe(true)
})

test('forwarded intake stays separate, idempotent, and needs-action survives read', () => {
  const first = captureIntakeItem({
    id: '11111111-1111-4111-8111-111111111111',
    ownerId: '22222222-2222-4222-8222-222222222222',
    providerMessageId: 'wamid.forward.1',
    fromE164: '+27827721220',
    toPhoneNumberId: '9000000002',
    body: 'Forwarded cattle note',
    receivedAt: '2026-10-27T20:00:00.000Z',
    provenance: { claimedForward: true },
  })
  expect(first.ok).toBe(true)
  if (!first.ok) return
  expect(first.item.needsAction).toBe(true)
  expect(first.item.provenance.invented).toBe(false)
  expect(first.item.missingDetails).toContain('original-group')
  const second = captureIntakeItem({
    id: '33333333-3333-4333-8333-333333333333',
    ownerId: first.item.ownerId,
    providerMessageId: 'wamid.forward.2',
    fromE164: '+27827721220',
    toPhoneNumberId: '9000000002',
    body: 'Another forward',
    receivedAt: '2026-10-27T20:01:00.000Z',
    provenance: { claimedForward: true },
  })
  expect(second.ok).toBe(true)
  if (!second.ok) return
  let items = mergeIntakeIdempotent([], first.item).items
  items = mergeIntakeIdempotent(items, second.item).items
  expect(items).toHaveLength(2)
  const dup = mergeIntakeIdempotent(items, first.item)
  expect(dup.duplicate).toBe(true)
  expect(dup.items).toHaveLength(2)
  const read = markIntakeRead(first.item, '2026-10-27T20:02:00.000Z')
  expect(read.readAt).toBeTruthy()
  expect(read.needsAction).toBe(true)
  const done = completeIntakeNeedsAction(read, '2026-10-27T20:03:00.000Z')
  expect(done.needsAction).toBe(false)
})

test('shared clarification answers once and blocks recursive own clarification echoes', () => {
  const captured = captureIntakeItem({
    id: '11111111-1111-4111-8111-111111111111',
    ownerId: '22222222-2222-4222-8222-222222222222',
    providerMessageId: 'wamid.forward.3',
    fromE164: '+27827721220',
    toPhoneNumberId: '9000000002',
    body: 'Need context',
    receivedAt: '2026-10-27T20:00:00.000Z',
    provenance: { claimedForward: true },
  })
  expect(captured.ok).toBe(true)
  if (!captured.ok) return
  let clarification = buildClarificationState({
    id: '44444444-4444-4444-8444-444444444444',
    ownerId: captured.item.ownerId,
    item: captured.item,
    toE164: '+27827721220',
    at: '2026-10-27T20:00:00.000Z',
  })
  const open = clarification.questions[0]
  expect(open).toBeTruthy()
  const answered = answerClarification(clarification, {
    questionId: open.id,
    answer: 'Farm Feed sellers',
    via: 'whatsapp',
    at: '2026-10-27T20:05:00.000Z',
  })
  expect(answered.ok).toBe(true)
  if (!answered.ok) return
  clarification = answered.state
  expect(clarification.questions[0].answeredVia).toBe('whatsapp')
  clarification = registerClarificationOutbound(clarification, 'wamid.clarification.out')
  expect(isOwnClarificationEcho('wamid.clarification.out', [clarification])).toBe(true)
  expect(classifyIntakeReply({ body: 'Farm Feed sellers', clarification })).toBe('clarification-answer')
})

test('founder clarification outbox stays unavailable without provider; customer/group outbox rejected; copied ≠ sent', () => {
  const planned = planFounderClarificationOutbox({
    id: '55555555-5555-4555-8555-555555555555',
    ownerId: '22222222-2222-4222-8222-222222222222',
    toE164: '+27827721220',
    body: 'Which group was this from?',
    clarificationId: '44444444-4444-4444-8444-444444444444',
    intakeItemId: '11111111-1111-4111-8111-111111111111',
    at: '2026-10-27T20:00:00.000Z',
    accessTokenPresent: false,
    phoneNumberIdPresent: false,
    costAcknowledged: false,
  })
  expect(planned.ok).toBe(true)
  if (!planned.ok) return
  expect(planned.draft.executes).toBe(false)
  expect(planned.draft.status).toBe('unavailable')
  expect(planned.draft.providerMessageId).toBeNull()
  expect(planned.draft.delivery).toBe('not-attempted')
  const advanced = advanceFounderClarificationOutbox(planned.draft, '2026-10-27T20:01:00.000Z')
  expect(advanced.status).toBe('unavailable')
  expect(advanced.providerMessageId).toBeNull()
  expect(advanced.delivery).toBe('not-attempted')
  expect(rejectCustomerOrGroupOutbox().ok).toBe(false)
  const drafted = draftGroupReply({
    id: '66666666-6666-4666-8666-666666666666',
    ownerId: '22222222-2222-4222-8222-222222222222',
    intakeItemId: '11111111-1111-4111-8111-111111111111',
    targetGroupLabel: 'Farm Feed sellers',
    body: 'Thanks — I will confirm tomorrow.',
  })
  expect(drafted.ok).toBe(true)
  if (!drafted.ok) return
  expect(confirmGroupReplySent(drafted.draft, '2026-10-27T20:02:00.000Z').ok).toBe(false)
  const copied = markGroupReplyCopied(drafted.draft, '2026-10-27T20:02:00.000Z')
  expect(copied.status).toBe('copied')
  const confirmed = confirmGroupReplySent(copied, '2026-10-27T20:03:00.000Z')
  expect(confirmed.ok).toBe(true)
  if (!confirmed.ok) return
  expect(confirmed.draft.status).toBe('confirmed-sent')
  expect(confirmed.draft.executes).toBe(false)
})

test('approved intake suggestion promotes to shared work draft with source evidence and stable id', () => {
  const captured = captureIntakeItem({
    id: '11111111-1111-4111-8111-111111111111',
    ownerId: '22222222-2222-4222-8222-222222222222',
    providerMessageId: 'wamid.forward.promote',
    fromE164: '+27827721220',
    toPhoneNumberId: '9000000002',
    body: '20 Bonsmara cows for sale near Middelburg',
    mediaPresent: true,
    receivedAt: '2026-11-01T10:00:00.000Z',
    provenance: { claimedForward: true, notes: 'Forwarded from phone' },
  })
  expect(captured.ok).toBe(true)
  if (!captured.ok) return
  const withContext = approveIntakeContext(captured.item, 'digikraal')
  expect(withContext.ok).toBe(true)
  if (!withContext.ok) return
  const withSuggestion = addIntakeSuggestion(withContext.item, {
    id: '77777777-7777-4777-8777-777777777777',
    kind: 'livestock-listing',
    title: 'Draft livestock listing',
    summary: 'Listing draft from forwarded cattle note.',
    context: 'digikraal',
  })
  const suggestion = withSuggestion.suggestions[0]
  expect(suggestion.workItemId).toBeNull()
  expect(promoteApprovedSuggestion(withSuggestion, suggestion, '2026-11-01T10:05:00.000Z').ok).toBe(false)
  const approved = decideIntakeSuggestion(withSuggestion, suggestion.id, 'approved')
  const ready = approved.suggestions.find((row) => row.id === suggestion.id)!
  const promoted = promoteApprovedSuggestion(approved, ready, '2026-11-01T10:05:00.000Z')
  expect(promoted.ok).toBe(true)
  if (!promoted.ok) return
  expect(promoted.draft.workId).toBe(workIdForIntakeSuggestion(suggestion.id))
  expect(promoted.draft.company).toBe('digikraal')
  expect(promoted.draft.systemId).toBe('005')
  expect(promoted.draft.evidence.providerMessageId).toBe('wamid.forward.promote')
  expect(promoted.draft.notes).toContain('wamid.forward.promote')
  expect(promoted.draft.notes).toContain('No external send or listing publish was executed')
  const linked = decideIntakeSuggestion(approved, suggestion.id, 'approved', promoted.draft.workId)
  expect(linked.suggestions[0].workItemId).toBe(promoted.draft.workId)
  const again = decideIntakeSuggestion(linked, suggestion.id, 'approved', '99999999-9999-4999-8999-999999999999')
  expect(again.suggestions[0].workItemId).toBe(promoted.draft.workId)
  const work = workCaseFromPromotion(promoted.draft, 'entity-digikraal', '2026-11-01T10:05:00.000Z')
  expect(work.id).toBe(promoted.draft.workId)
  expect(work.intake?.externalBlocked).toBe(true)
  expect(work.facts['Provider message']).toBe('wamid.forward.promote')
  expect(work.source).toBe('WhatsApp intake approval')
})

test('lebab context cannot invent a company work draft; context suggestions stay non-executing', () => {
  const captured = captureIntakeItem({
    id: '11111111-1111-4111-8111-111111111111',
    ownerId: '22222222-2222-4222-8222-222222222222',
    providerMessageId: 'wamid.forward.lebab',
    fromE164: '+27827721220',
    toPhoneNumberId: '9000000002',
    body: 'Lebab note',
    receivedAt: '2026-11-01T11:00:00.000Z',
    provenance: { claimedForward: true },
  })
  expect(captured.ok).toBe(true)
  if (!captured.ok) return
  const withContext = approveIntakeContext(captured.item, 'lebab')
  expect(withContext.ok).toBe(true)
  if (!withContext.ok) return
  const withSuggestion = addIntakeSuggestion(withContext.item, {
    id: '88888888-8888-4888-8888-888888888888',
    kind: 'task',
    title: 'Private follow-up',
    summary: 'Keep founder-private until mapping exists.',
    context: 'lebab',
  })
  const approved = decideIntakeSuggestion(withSuggestion, withSuggestion.suggestions[0].id, 'approved')
  const result = promoteApprovedSuggestion(approved, approved.suggestions[0], '2026-11-01T11:01:00.000Z')
  expect(result.ok).toBe(false)
  if (result.ok) return
  expect(result.error).toMatch(/Lebab|mapping/i)
  const contextOnly = addIntakeSuggestion(withContext.item, {
    id: '99999999-9999-4999-8999-999999999999',
    kind: 'context',
    title: 'Confirm context',
    summary: 'Not a work record.',
    context: 'lebab',
  })
  const contextApproved = decideIntakeSuggestion(contextOnly, contextOnly.suggestions[0].id, 'approved')
  expect(promoteApprovedSuggestion(contextApproved, contextApproved.suggestions[0], '2026-11-01T11:02:00.000Z').ok).toBe(false)
})
