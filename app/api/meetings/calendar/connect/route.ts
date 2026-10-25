import { createHash, randomBytes } from 'node:crypto'
import { NextResponse } from 'next/server'
import { requireFounderSession, sameOrigin } from '@/lib/intake/server'
import { calendarConfig, calendarScopes, encryptConnection } from '@/lib/meetings/connectionSecrets'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  let config
  try { config = calendarConfig() } catch { config = null }
  if (!config) return NextResponse.json({ error: 'Google OAuth credentials and meeting token encryption need setup first.' }, { status: 503 })
  const state = randomBytes(32).toString('base64url')
  const verifier = randomBytes(48).toString('base64url')
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.search = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.redirectUri, response_type: 'code', scope: calendarScopes.join(' '), access_type: 'offline', prompt: 'consent', login_hint: config.account, state, code_challenge: createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256' }).toString()
  const response = NextResponse.json({ url: url.toString() })
  response.cookies.set('meeting-google-oauth', encryptConnection(auth.user.id, { state, verifier, expires: Date.now() + 600_000 }), { httpOnly: true, secure: config.origin.startsWith('https:'), sameSite: 'lax', path: '/api/meetings/calendar', maxAge: 600 })
  return response
}
