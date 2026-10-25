import { applyMeetingPatch, createMeetingCore, readMeetingCore, reviewFollowUp } from '@/lib/meetings/core'
import { clarificationPatch } from '@/lib/meetings/clarify'
import { test, expect } from '@playwright/test'
import { reminderReceiptState, sendWhatsappReminder, validReminderConfig, type WhatsappReminderConfig } from '@/lib/meetings/reminders'

const config: WhatsappReminderConfig = { token: 'synthetic', phoneNumberId: '123456', recipient: '27820000000', verifiedRecipient: '27820000000', graphVersion: 'v26.0', preparationTemplate: 'meeting_preparation', startTemplate: 'meeting_start', language: 'en' }
test('reminders cannot send to an unverified or substituted recipient', async () => {
  const input = { id: 'job-1', kind: 'start' as const, title: 'Visit', company: 'DigiKraal', start: '28 October, 08:00 SAST' }
  let calls = 0
  const request = (async () => { calls++; return new Response('{}') }) as typeof fetch
  expect(validReminderConfig(config)).toBe(true)
  expect(await sendWhatsappReminder({ ...config, recipient: '27829999999' }, input, request)).toEqual({ state: 'unavailable' })
  expect(await sendWhatsappReminder({ ...config, verifiedRecipient: '' }, input, request)).toEqual({ state: 'unavailable' })
  expect(calls).toBe(0)
})

test('provider acceptance is distinct from delivery and carries a reconciliation reference', async () => {
  let payload: Record<string, unknown> = {}
  const request = (async (_url, init) => { payload = JSON.parse(String(init?.body)); return new Response(JSON.stringify({ messages: [{ id: 'provider-1' }] }), { headers: { 'Content-Type': 'application/json' } }) }) as typeof fetch
  const result = await sendWhatsappReminder(config, { id: 'job-1', kind: 'preparation', title: 'Visit', company: 'DigiKraal', start: '28 October, 08:00 SAST' }, request)
  expect(result).toEqual({ state: 'accepted', messageId: 'provider-1' })
  expect(payload.to).toBe(config.verifiedRecipient)
  expect(payload.type).toBe('template')
  expect(payload.biz_opaque_callback_data).toBe('meeting-reminder:job-1')
  expect(JSON.stringify(payload)).not.toMatch(/minutes|transcript|notes/)
  expect(reminderReceiptState('accepted', 'delivered')).toBe('delivered')
  expect(reminderReceiptState('uncertain', 'sent')).toBe('accepted')
  expect(reminderReceiptState('delivered', 'sent')).toBe('delivered')
  expect(reminderReceiptState('delivered', 'failed')).toBe('delivered')
})

test('an unknown send response is uncertain and a rejection is failed', async () => {
  const input = { id: 'job-1', kind: 'start' as const, title: 'Visit', company: 'DigiKraal', start: '28 October, 08:00 SAST' }
  expect(await sendWhatsappReminder(config, input, (async () => new Response('{}', { status: 200 })) as typeof fetch)).toEqual({ state: 'uncertain' })
  expect(await sendWhatsappReminder(config, input, (async () => new Response('{}', { status: 403 })) as typeof fetch)).toEqual({ state: 'failed' })
})


test('reminder timing can change through clarification and survives reload without changing the schedule', () => {
  const core = createMeetingCore({ company: 'northpoint' })
  const patch = clarificationPatch(JSON.stringify({ reminderPreparationMinutes: 2880, reminderStartMinutes: 60 }))
  const saved = applyMeetingPatch(core, patch)
  expect(saved.ok).toBe(true)
  if (!saved.ok) return
  expect(readMeetingCore({ meeting_core: saved.core }, null, 'northpoint')?.reminders).toEqual({ preparationMinutes: 2880, startMinutes: 60 })
  expect(saved.core.schedule.confirmed).toBe(false)
  expect(applyMeetingPatch(core, { reminderStartMinutes: -1 }).ok).toBe(false)
  expect(applyMeetingPatch(core, { reminderPreparationMinutes: 10081 }).ok).toBe(false)
})

test('impossible deadlines and duplicate action identities are rejected before an approval claim', () => {
  const core = createMeetingCore({ company: 'digikraal' })
  const action = { id: 'action-1', title: 'Confirm price', include: true, company: 'digikraal' as const, systemId: '005', owner: 'Founder', due: '2026-02-31' }
  core.minutes = { revision: 1, discussion: 'Price discussed.', decisions: [], questions: [], actions: [action], evidence: 'notes' }
  expect(reviewFollowUp(core, 1).ok).toBe(false)
  core.minutes.actions = [{ ...action, due: '0000-01-01' }]
  expect(reviewFollowUp(core, 1).ok).toBe(false)
  core.minutes.actions = [{ ...action, due: '' }, { ...action, due: '', title: 'Confirm age' }]
  expect(reviewFollowUp(core, 1).ok).toBe(false)
})
