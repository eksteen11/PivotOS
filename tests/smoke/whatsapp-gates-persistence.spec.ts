import { expect, test } from '@playwright/test'
import {
  acceptanceGateBlockers,
  executeMarkConversationRead,
  mediaDownloadStatus,
  planMarkConversationRead,
  teachEntryToRow,
  teachRowToEntry,
  whatsappOfficialCapabilities,
} from '../../lib/whatsapp'
import { rememberTeachEntry } from '../../lib/whatsapp/teach'

test('group sync and phone unread stay unsupported/unverified without blocking limited rollout gates list', () => {
  expect(acceptanceGateBlockers()).toEqual([])
  const caps = whatsappOfficialCapabilities()
  expect(caps.find((cap) => cap.id === 'existing-group-sync-coexistence')?.status).toBe('not-supported')
  expect(caps.find((cap) => cap.id === 'phone-unread-clear-on-pivot-open')?.status).toBe('unverified')
  expect(caps.find((cap) => cap.id === 'dedicated-intake-forward-workflow')?.status).toBe('local-only')
  const groupsApi = caps.find((cap) => cap.id === 'cloud-groups-api')
  expect(groupsApi?.status).toBe('not-supported')
  expect(groupsApi?.evidence).toMatch(/WhatsApp Business app phone numbers/i)
  const bridge = caps.find((cap) => cap.id === 'unofficial-linked-device-bridge')
  expect(bridge?.status).toBe('not-supported')
})

test('mark-as-read is planned but never executes without authorization', () => {
  const plan = planMarkConversationRead({
    phoneNumberId: '555',
    latestInboundProviderMessageId: 'wamid.HBgL.test',
    accessTokenPresent: true,
  })
  expect(plan.ok).toBe(true)
  if (!plan.ok) return
  expect(plan.executes).toBe(false)
  expect(plan.body.status).toBe('read')
  expect(plan.phoneBadgeClears).toBe('unverified')
  expect(executeMarkConversationRead(plan)).toEqual({
    ok: false,
    executes: false,
    error: 'Mark-as-read execution is disabled until live WhatsApp credentials and founder-authorized phone unread verification exist.',
  })
})

test('teach memory rows round-trip owner-scoped fields for persistence', () => {
  const saved = rememberTeachEntry({
    id: '11111111-1111-4111-8111-111111111111',
    contactKey: '+27820001111',
    context: 'digikraal',
    kind: 'relationship',
    body: 'Strategic cattle supplier',
    source: 'explicit-teaching',
    at: '2026-10-27T18:00:00.000Z',
  })
  expect(saved.ok).toBe(true)
  if (!saved.ok) return
  const row = teachEntryToRow('22222222-2222-4222-8222-222222222222', saved.entry)
  expect(row.owner_id).toBe('22222222-2222-4222-8222-222222222222')
  expect(row.active).toBe(true)
  const back = teachRowToEntry({ ...row, superseded_by: null })
  expect(back.body).toBe('Strategic cattle supplier')
  expect(back.contactKey).toBe('27820001111')
})

test('media download stays disconnected without access token', () => {
  expect(mediaDownloadStatus(false).status).toBe('disconnected')
  expect(mediaDownloadStatus(true).status).toBe('ready-to-fetch')
})
