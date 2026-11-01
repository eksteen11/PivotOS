import { expect, test } from '@playwright/test'
import {
  activeTeachMemory,
  appendThreadMessage,
  approveDriveCopy,
  approveMediaDerivedDraft,
  buildConversation,
  buildVoiceTranscriptInterfaces,
  canProceedAfterRace,
  createMediaRecord,
  dedupeProviderMessageIds,
  detectReplyRace,
  editTeachMemory,
  groupsCoexistenceSupported,
  inboundRowsFromWebhook,
  nextWebhookRetry,
  observeWhatsappSync,
  openConversation,
  parseWhatsappWebhook,
  rememberFromDraftCorrection,
  rememberTeachEntry,
  startTeachPivotSession,
  suggestDriveCopy,
  suggestMediaDerivedDraft,
  teachPivotLabel,
  transcriptPanels,
  undoTeachMemory,
  whatsappOfficialCapabilities,
} from '../../lib/whatsapp'

test('official capabilities mark coexistence groups unsupported and phone unread unverified', () => {
  expect(groupsCoexistenceSupported()).toBe(false)
  const caps = whatsappOfficialCapabilities()
  expect(caps.find((c) => c.id === 'existing-group-sync-coexistence')?.status).toBe('not-supported')
  expect(caps.find((c) => c.id === 'smb-message-echoes')?.status).toBe('supported')
  expect(caps.find((c) => c.id === 'phone-unread-clear-on-pivot-open')?.status).toBe('unverified')
})

test('opening a conversation clears unread; preview list must not', () => {
  let conversation = buildConversation({
    ownerId: 'owner',
    kind: 'direct',
    contactKey: '27820001111',
    messages: [{
      id: '1',
      providerMessageId: 'wamid.1',
      direction: 'inbound',
      fromE164: '+27820001111',
      body: 'Hello',
      mediaKind: 'none',
      receivedAt: '2026-10-27T12:00:00.000Z',
      context: null,
      source: 'local',
    }],
  })
  expect(conversation.unreadCount).toBe(1)
  conversation = openConversation(conversation, '2026-10-27T12:05:00.000Z')
  expect(conversation.unreadCount).toBe(0)
  expect(conversation.readAt).toBe('2026-10-27T12:05:00.000Z')
})

test('Teach Pivot memory supports teaching, draft-correction remember, edit and undo', () => {
  expect(teachPivotLabel()).toBe('Teach Pivot')
  const session = startTeachPivotSession({ id: 't1', contactKey: '+27820001111', startedAt: '2026-10-27T12:00:00.000Z' })
  expect(session.followUps.length).toBeGreaterThan(0)
  const taught = rememberTeachEntry({
    id: 'm1',
    contactKey: '27820001111',
    context: 'digikraal',
    kind: 'relationship',
    body: 'Strategic cattle supplier. Preserve the relationship.',
    source: 'explicit-teaching',
    at: '2026-10-27T12:01:00.000Z',
  })
  expect(taught.ok).toBe(true)
  if (!taught.ok) return
  const pref = rememberFromDraftCorrection({
    id: 'm2',
    contactKey: '27820001111',
    context: 'digikraal',
    preference: 'Firm but friendly collection tone',
    at: '2026-10-27T12:02:00.000Z',
  })
  expect(pref.ok).toBe(true)
  if (!pref.ok) return
  let entries = [taught.entry, pref.entry]
  const edited = editTeachMemory(entries, 'm1', 'Strategic cattle supplier. Careful handling.', '2026-10-27T12:03:00.000Z')
  expect(edited.ok).toBe(true)
  if (!edited.ok) return
  entries = undoTeachMemory(edited.entries, 'm2', '2026-10-27T12:04:00.000Z')
  expect(activeTeachMemory(entries, '27820001111', 'digikraal')).toHaveLength(1)
  expect(activeTeachMemory(entries, '27820001111', 'digikraal')[0]?.body).toContain('Careful handling')
})

test('transcripts keep original language and summary panels while disconnected', () => {
  const transcript = buildVoiceTranscriptInterfaces({
    id: 'tr1',
    messageId: 'msg1',
    originalLanguage: 'af',
    originalText: 'Ek het beeste',
    summary: 'Seller mentions cattle',
    processingAvailable: false,
    at: '2026-10-27T12:00:00.000Z',
  })
  expect(transcript.status).toBe('disconnected')
  const panels = transcriptPanels(transcript)
  expect(panels.original.language).toBe('af')
  expect(panels.summary.label).toBe('Summary')
})

test('media drafts and Drive copy require approval and never auto-execute', () => {
  const media = suggestDriveCopy(createMediaRecord({
    id: 'media1',
    ownerId: 'owner',
    messageId: 'msg1',
    contactKey: '27820001111',
    mimeType: 'image/jpeg',
    kind: 'image',
    at: '2026-10-27T12:00:00.000Z',
  }))
  expect(media.driveCopyStatus).toBe('suggested')
  expect(media.retainedIndependently).toBe(true)
  expect(approveDriveCopy(media).driveCopyStatus).toBe('approved-pending-copy')
  const draft = suggestMediaDerivedDraft({
    id: 'd1',
    mediaId: media.id,
    kind: 'livestock-listing',
    title: 'Angus draft listing',
    summary: 'From photo',
    context: 'digikraal',
    at: '2026-10-27T12:00:00.000Z',
  })
  expect(draft.ok).toBe(true)
  if (!draft.ok) return
  expect(draft.draft.executes).toBe(false)
  expect(approveMediaDerivedDraft(draft.draft).status).toBe('approved')
  expect(approveMediaDerivedDraft(draft.draft).executes).toBe(false)
})

test('reply race warns and blocks proceed until latest is reviewed', () => {
  const warning = detectReplyRace({
    draftStartedAt: '2026-10-27T12:00:00.000Z',
    latestInboundAt: '2026-10-27T12:01:00.000Z',
    latestInboundPreview: 'Can we do Saturday?',
  })
  expect(warning.active).toBe(true)
  if (!warning.active) return
  expect(canProceedAfterRace(warning, false)).toBe(false)
  expect(canProceedAfterRace(warning, true)).toBe(true)
})

test('dedupe, retries, echoes and unsupported groups are retained honestly', () => {
  expect(dedupeProviderMessageIds(['a', 'a', 'b'], ['b'])).toEqual({ unique: ['a'], duplicates: ['a', 'b'] })
  expect(nextWebhookRetry(0).retryCount).toBe(1)
  const parsed = parseWhatsappWebhook({
    object: 'whatsapp_business_account',
    entry: [{
      id: 'waba',
      changes: [
        {
          field: 'messages',
          value: {
            metadata: { phone_number_id: '555', display_phone_number: '27827721220' },
            messages: [
              { id: 'wamid.1', from: '27820001111', timestamp: '1761566400', type: 'text', text: { body: 'Hi' } },
              { id: 'wamid.group', from: '27820001111', timestamp: '1761566401', type: 'text', text: { body: 'Group hi' }, group_id: 'g1' },
            ],
          },
        },
        {
          field: 'smb_message_echoes',
          value: {
            metadata: { phone_number_id: '555' },
            message_echoes: [
              { id: 'wamid.1', from: '27827721220', timestamp: '1761566402', type: 'text', text: { body: 'dup echo' } },
              { id: 'wamid.echo', from: '27827721220', timestamp: '1761566403', type: 'text', text: { body: 'Sent on phone' } },
            ],
          },
        },
      ],
    }],
  })
  expect(parsed.messages).toHaveLength(1)
  expect(parsed.groupMessagesUnsupported).toHaveLength(1)
  expect(parsed.echoes.map((e) => e.providerMessageId)).toContain('wamid.echo')
  const rows = inboundRowsFromWebhook('owner', parsed)
  expect(rows.some((row) => row.direction === 'echo' && row.provider_message_id === 'wamid.echo')).toBe(true)
  expect(rows.some((row) => row.group_support === 'not-supported')).toBe(true)
  expect(rows.filter((row) => row.provider_message_id === 'wamid.1')).toHaveLength(1)
  const group = buildConversation({ ownerId: 'owner', kind: 'group', contactKey: 'g1', groupId: 'g1' })
  expect(group.groupSupport).toBe('not-supported')
  const withGroupMsg = appendThreadMessage(group, {
    id: 'gm1',
    providerMessageId: 'wamid.group',
    direction: 'inbound',
    fromE164: '+27820001111',
    body: 'Group hi',
    mediaKind: 'none',
    receivedAt: '2026-10-27T12:00:00.000Z',
    context: null,
    source: 'messages',
  })
  expect(withGroupMsg.messages).toHaveLength(1)
  expect(withGroupMsg.syncNote).toMatch(/not silently dropped/i)
  expect(observeWhatsappSync({ credentialsPresent: false, tableReady: true }).state).toBe('awaiting-credentials')
})
