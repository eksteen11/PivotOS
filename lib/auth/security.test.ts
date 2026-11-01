import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { SupabaseClient } from '@supabase/supabase-js'
import { needsSecondFactor } from './mfa'
import { isRecoverySession, recoveryMessage } from './recovery'

test('only signed recovery methods count as recovery, not normal login or metadata', () => {
  for (const claims of [null, {}, { amr: 'recovery' }, { amr: ['recovery'] }, { amr: [{ method: 'password' }] }, { amr: [{ method: 'otp' }] }]) assert.equal(isRecoverySession(claims), false)
  assert.equal(isRecoverySession({ amr: [{ method: 'recovery', timestamp: 123 }] }), true)
})

function client(factors: { status: string }[], aal: string, error: unknown = null) {
  return { auth: {
    getUser: async () => ({ data: { user: { factors } }, error }),
    getClaims: async () => ({ data: { claims: { aal } }, error: null }),
  } } as unknown as SupabaseClient
}
test('verified factors require aal2, unfinished setup does not lock an account', async () => {
  assert.equal(await needsSecondFactor(client([], 'aal1')), false)
  assert.equal(await needsSecondFactor(client([{ status: 'unverified' }], 'aal1')), false)
  assert.equal(await needsSecondFactor(client([{ status: 'verified' }], 'aal1')), true)
  assert.equal(await needsSecondFactor(client([{ status: 'verified' }], 'aal2')), false)
})
test('failure to verify factors fails closed', async () => {
  await assert.rejects(needsSecondFactor(client([], 'aal1', new Error('outage'))))
})
test('recovery errors hide provider details and account existence', () => {
  assert.match(recoveryMessage({ code: 'over_email_send_rate_limit' }), /wait a minute/)
  assert.match(recoveryMessage(new TypeError('Failed to fetch')), /connection/)
  assert.doesNotMatch(recoveryMessage(new Error('user does not exist, SMTP secret blah')), /exist|SMTP|secret/)
})
