import { expect, test } from '@playwright/test'

test('meeting assets and connection APIs refuse anonymous access', async ({ request }) => {
  const id = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'
  for (const url of [
    `/api/meetings/recordings?meetingId=${id}`,
    `/api/meetings/recordings/audio?meetingId=${id}&id=${id}&sequence=0`,
    `/api/meetings/connections?meetingId=${id}`,
    '/api/meetings/calendar/bindings',
    '/api/meetings/calendar/callback',
  ]) expect((await request.get(url)).status(), url).toBe(401)
  for (const url of ['/api/meetings/recordings', '/api/meetings/recordings/finish', '/api/meetings/recordings/retry', '/api/meetings/calendar/connect', '/api/meetings/calendar/bindings', '/api/meetings/reminders/connect']) {
    expect((await request.post(url, { data: { meetingId: id, id, consent: true } })).status(), url).toBe(401)
  }
})

test('meeting workers require a secret and cross-origin connection writes are refused', async ({ request }) => {
  for (const url of ['/api/meetings/recordings/jobs', '/api/meetings/calendar/jobs', '/api/meetings/reminders/jobs']) {
    expect((await request.get(url)).status(), url).toBe(401)
    expect((await request.get(url, { headers: { Authorization: 'Bearer invalid-synthetic-secret' } })).status(), url).toBe(401)
  }
  for (const url of ['/api/meetings/recordings', '/api/meetings/calendar/connect', '/api/meetings/reminders/connect', '/api/meetings/calendar/conflict']) {
    expect((await request.post(url, { headers: { Origin: 'https://untrusted.example' }, data: {} })).status(), url).toBe(403)
  }
  const unsigned = await request.post('/api/meetings/reminders/webhook', { data: { entry: [] } })
  expect([403, 503]).toContain(unsigned.status())
})
