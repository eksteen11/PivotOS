/** Canonical shared founder number. DigiKraal +27 71 164 8444 is a later module connection. */
export const WHATSAPP_FOUNDER_E164 = '+27827721220'
export const WHATSAPP_FOUNDER_DIGITS = '27827721220'
export const WHATSAPP_WEBHOOK_PATH = '/api/whatsapp/webhook'
export const WHATSAPP_PRODUCTION_ORIGIN = 'https://pivot-os.vercel.app'

export type WhatsappChannelConfig = {
  ownerId: string
  appSecret: string
  verifyToken: string
  phoneNumberId: string
  accessToken: string
  wabaId: string
  graphVersion: string
  displayE164: string
}

export function normalizeWhatsappE164(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15) return ''
  return `+${digits}`
}

export function readWhatsappChannelConfig(env: NodeJS.ProcessEnv = process.env): {
  config: WhatsappChannelConfig | null
  missing: string[]
} {
  const displayE164 = normalizeWhatsappE164(env.WHATSAPP_DISPLAY_E164 || WHATSAPP_FOUNDER_E164)
  const values = {
    ownerId: (env.WHATSAPP_OWNER_ID || '').trim(),
    appSecret: (env.WHATSAPP_APP_SECRET || '').trim(),
    verifyToken: (env.WHATSAPP_VERIFY_TOKEN || '').trim(),
    phoneNumberId: (env.WHATSAPP_PHONE_NUMBER_ID || '').trim(),
    accessToken: (env.WHATSAPP_ACCESS_TOKEN || '').trim(),
    wabaId: (env.WHATSAPP_WABA_ID || '').trim(),
    graphVersion: (env.WHATSAPP_GRAPH_VERSION || 'v21.0').trim(),
    displayE164,
  }
  const missing = (Object.entries({
    WHATSAPP_OWNER_ID: values.ownerId,
    WHATSAPP_APP_SECRET: values.appSecret,
    WHATSAPP_VERIFY_TOKEN: values.verifyToken,
    WHATSAPP_PHONE_NUMBER_ID: values.phoneNumberId,
  }) as Array<[string, string]>)
    .filter(([, value]) => !value)
    .map(([name]) => name)
  if (!displayE164) missing.push('WHATSAPP_DISPLAY_E164')
  if (missing.length) return { config: null, missing }
  return { config: values, missing: [] }
}

export function webhookCallbackUrl(origin = WHATSAPP_PRODUCTION_ORIGIN) {
  return `${origin.replace(/\/$/, '')}${WHATSAPP_WEBHOOK_PATH}`
}
