import { calendarConfig, decryptConnection, encryptConnection } from '@/lib/meetings/connectionSecrets'
import type { recordingAdmin } from '@/lib/meetings/recordingServer'

export type GoogleTokens = { refreshToken: string }
export async function googleAccessToken(admin: NonNullable<ReturnType<typeof recordingAdmin>>, ownerId: string) {
  const config = calendarConfig()
  if (!config) throw new Error('Google Calendar needs connection setup.')
  const { data } = await admin.from('meeting_connections').select('encrypted_credentials,account_email').eq('owner_id', ownerId).eq('provider', 'google_calendar').maybeSingle()
  if (!data) throw new Error('Connect Google Calendar first.')
  const tokens = decryptConnection<GoogleTokens>(ownerId, data.encrypted_credentials)
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, grant_type: 'refresh_token', refresh_token: tokens.refreshToken }), signal: AbortSignal.timeout(15_000) })
  if (!response.ok) throw new Error('Google Calendar needs to be reconnected.')
  const body = await response.json()
  if (!body.access_token) throw new Error('Google did not provide calendar access.')
  if (body.refresh_token) await admin.from('meeting_connections').update({ encrypted_credentials: encryptConnection(ownerId, { refreshToken: body.refresh_token }) }).eq('owner_id', ownerId).eq('provider', 'google_calendar')
  return { token: String(body.access_token), email: String(data.account_email) }
}
