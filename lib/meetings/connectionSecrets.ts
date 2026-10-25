import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

function encryptionKey() {
  const key = Buffer.from(process.env.MEETINGS_TOKEN_KEY ?? '', 'base64')
  if (key.length !== 32) throw new Error('Meeting connection encryption needs a 32-byte key.')
  return key
}
export function encryptConnection(ownerId: string, value: unknown) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  cipher.setAAD(Buffer.from(ownerId))
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value)), cipher.final()])
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString('base64url')).join('.')
}
export function decryptConnection<T>(ownerId: string, value: string): T {
  const [iv, tag, body] = value.split('.').map((part) => Buffer.from(part, 'base64url'))
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv)
  decipher.setAAD(Buffer.from(ownerId))
  decipher.setAuthTag(tag)
  return JSON.parse(Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8')) as T
}

export function calendarConfig() {
  const clientId = process.env.MEETINGS_GOOGLE_CLIENT_ID
  const clientSecret = process.env.MEETINGS_GOOGLE_CLIENT_SECRET
  const origin = process.env.MEETINGS_APP_ORIGIN
  const account = process.env.MEETINGS_GOOGLE_ACCOUNT
  if (!clientId || !clientSecret || !origin || !account) return null
  let parsed: URL
  try { parsed = new URL(origin); encryptionKey() } catch { return null }
  const localHttp = parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname)
  if (parsed.origin !== origin || (parsed.protocol !== 'https:' && !localHttp)) return null
  return { clientId, clientSecret, origin, account, redirectUri: `${origin}/api/meetings/calendar/callback` }
}
export const calendarScopes = ['openid', 'email', 'https://www.googleapis.com/auth/calendar.events.owned', 'https://www.googleapis.com/auth/calendar.calendarlist.readonly', 'https://www.googleapis.com/auth/calendar.acls.readonly']
