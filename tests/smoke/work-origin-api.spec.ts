import { expect, test } from '@playwright/test'

test('work and intake routes accept the site origin and reject unrelated sites', async ({ request, baseURL }) => {
  if (!baseURL) throw new Error('Base URL is required.')
  const origin = new URL(baseURL).origin
  for (const [method, url] of [
    ['POST', '/api/work'],
    ['PATCH', '/api/work'],
    ['POST', '/api/intake/analyse'],
    ['POST', '/api/intake/save'],
  ]) {
    // No session: a legitimate browser request must reach authentication,
    // while a foreign origin must be rejected before authentication.
    const allowed = await request.fetch(url, { method, headers: { Origin: origin }, data: {} })
    expect(allowed.status(), `${method} ${url}: site origin`).toBe(401)
    const denied = await request.fetch(url, { method, headers: { Origin: 'https://untrusted.example' }, data: {} })
    expect(denied.status(), `${method} ${url}: foreign origin`).toBe(403)
  }
})
