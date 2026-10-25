import { expect, test } from '@playwright/test'

import { sameOrigin } from '../../lib/http/sameOrigin'

test('same-origin writes use the browser host even when Next uses its bind address', () => {
  const request = (origin: string, host = '127.0.0.1:3031') => new Request('http://localhost:3031/api/intake/analyse', {
    headers: { origin, host },
  })
  expect(sameOrigin(request('http://127.0.0.1:3031'))).toBe(true)
  expect(sameOrigin(request('http://localhost:3031', 'localhost:3031'))).toBe(true)
  expect(sameOrigin(request('http://127.0.0.1:3032'))).toBe(false)
  expect(sameOrigin(request('https://127.0.0.1:3031'))).toBe(false)
  expect(sameOrigin(request('https://unrelated.example'))).toBe(false)
  expect(sameOrigin(request('null'))).toBe(false)
  expect(sameOrigin(request('not a URL'))).toBe(false)
  expect(sameOrigin(request('http://127.0.0.1:3031/path'))).toBe(false)
})

test('production origins remain exact and forwarded headers cannot bypass the check', () => {
  expect(sameOrigin(new Request('https://pivot.example/api/intake/save', {
    headers: { origin: 'https://pivot.example' },
  }))).toBe(true)
  expect(sameOrigin(new Request('https://pivot.example/api/intake/save', {
    headers: { origin: 'https://unrelated.example', host: 'pivot.example', 'x-forwarded-host': 'unrelated.example' },
  }))).toBe(false)
  expect(sameOrigin(new Request('https://pivot.example/api/intake/save'))).toBe(true)
})
