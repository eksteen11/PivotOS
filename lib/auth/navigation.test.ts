// Bundle with the repository's esbuild, then run using Node's test runner.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { safeNextPath } from './navigation'

test('authentication redirects only accept local paths', () => {
  for (const input of ['https://example.com', '//example.com', '/\\example.com', '/\n/example.com', '/auth/callback', '/login', '/register', '/%2f%2fexample.com', undefined, '']) {
    const result = safeNextPath(input)
    assert.equal(new URL(result, 'https://pivot.invalid').origin, 'https://pivot.invalid')
  }
  assert.equal(safeNextPath('//example.com'), '/today')
  assert.equal(safeNextPath('/account?tab=team'), '/account?tab=team')
  assert.equal(safeNextPath('/today?view=calendar&week=2026-10-19'), '/today?view=calendar&week=2026-10-19')
  assert.equal(safeNextPath('/reset-password'), '/reset-password')
})
