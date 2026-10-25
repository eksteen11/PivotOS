import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { requireFounderSession } from '@/lib/intake/server'
import { calendarConfig, calendarScopes, decryptConnection, encryptConnection } from '@/lib/meetings/connectionSecrets'
import { recordingAdmin } from '@/lib/meetings/recordingServer'

export async function GET(request: Request) {
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const config = calendarConfig()
  const admin = recordingAdmin()
  if (!config || !admin) return NextResponse.json({ error: 'Calendar connection setup is incomplete.' }, { status: 503 })
  const jar = await cookies()
  const cookie = jar.get('meeting-google-oauth')?.value ?? ''
  jar.delete({ name: 'meeting-google-oauth', path: '/api/meetings/calendar' })
  const url = new URL(request.url)
  try {
    const session = decryptConnection<{ state: string; verifier: string; expires: number }>(auth.user.id, cookie)
    if (session.expires < Date.now() || session.state !== url.searchParams.get('state') || !url.searchParams.get('code') || url.searchParams.has('error')) throw new Error('Connection was not confirmed.')
    const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, grant_type: 'authorization_code', code: url.searchParams.get('code')!, redirect_uri: config.redirectUri, code_verifier: session.verifier }), signal: AbortSignal.timeout(15_000) })
    if (!response.ok) throw new Error('Connection token failed.')
    const token = await response.json()
    if (!token.refresh_token || !token.access_token || calendarScopes.filter((scope) => scope.startsWith('https://')).some((scope) => !String(token.scope ?? '').split(' ').includes(scope))) throw new Error('Required calendar access was not granted.')
    const identity = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: `Bearer ${token.access_token}` }, signal: AbortSignal.timeout(10_000) })
    if (!identity.ok) throw new Error('Google identity was not verified.')
    const profile = await identity.json()
    const expected = config.account
    if (!profile.email_verified || String(profile.email).toLowerCase() !== expected.toLowerCase()) throw new Error('Use the reviewed Google account.')
    const { error } = await admin.from('meeting_connections').upsert({ owner_id: auth.user.id, provider: 'google_calendar', account_email: profile.email, encrypted_credentials: encryptConnection(auth.user.id, { refreshToken: token.refresh_token }), updated_at: new Date().toISOString() }, { onConflict: 'owner_id,provider' })
    if (error) throw new Error('Connection was not saved.')
    return NextResponse.redirect(`${config.origin}/today?view=meetings&calendar=connected`)
  } catch {
    return NextResponse.redirect(`${config.origin}/today?view=meetings&calendar=connection-failed`)
  }
}
