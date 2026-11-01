import { normalizeWhatsappE164, WHATSAPP_FOUNDER_E164 } from './config'

export type WhatsappConnectionRole = 'shared-one-to-one' | 'dedicated-intake'

export type WhatsappConnectionBinding = {
  role: WhatsappConnectionRole
  displayE164: string
  phoneNumberId: string
  wabaId: string
  configured: boolean
  sendingEnabled: false
}

export type WhatsappDualConnectionConfig = {
  shared: WhatsappConnectionBinding
  intake: WhatsappConnectionBinding
  missing: string[]
}

/** Separate original shared number (+27827721220) from dedicated intake number (SIM TBD). */
export function readWhatsappDualConnections(env: NodeJS.ProcessEnv = process.env): WhatsappDualConnectionConfig {
  const sharedDisplay = normalizeWhatsappE164(env.WHATSAPP_DISPLAY_E164 || WHATSAPP_FOUNDER_E164)
  const intakeDisplay = normalizeWhatsappE164(env.WHATSAPP_INTAKE_DISPLAY_E164 || '')
  const shared: WhatsappConnectionBinding = {
    role: 'shared-one-to-one',
    displayE164: sharedDisplay,
    phoneNumberId: (env.WHATSAPP_PHONE_NUMBER_ID || '').trim(),
    wabaId: (env.WHATSAPP_WABA_ID || '').trim(),
    configured: Boolean((env.WHATSAPP_PHONE_NUMBER_ID || '').trim() && sharedDisplay),
    sendingEnabled: false,
  }
  const intake: WhatsappConnectionBinding = {
    role: 'dedicated-intake',
    displayE164: intakeDisplay,
    phoneNumberId: (env.WHATSAPP_INTAKE_PHONE_NUMBER_ID || '').trim(),
    wabaId: (env.WHATSAPP_INTAKE_WABA_ID || env.WHATSAPP_WABA_ID || '').trim(),
    configured: Boolean((env.WHATSAPP_INTAKE_PHONE_NUMBER_ID || '').trim() && intakeDisplay),
    sendingEnabled: false,
  }
  const missing: string[] = []
  if (!shared.phoneNumberId) missing.push('WHATSAPP_PHONE_NUMBER_ID')
  if (!sharedDisplay) missing.push('WHATSAPP_DISPLAY_E164')
  if (!intake.phoneNumberId) missing.push('WHATSAPP_INTAKE_PHONE_NUMBER_ID')
  if (!intakeDisplay) missing.push('WHATSAPP_INTAKE_DISPLAY_E164')
  return { shared, intake, missing }
}

export function resolveConnectionByPhoneNumberId(
  phoneNumberId: string,
  config: WhatsappDualConnectionConfig = readWhatsappDualConnections(),
): WhatsappConnectionBinding | null {
  const id = phoneNumberId.trim()
  if (!id) return null
  if (config.intake.phoneNumberId && config.intake.phoneNumberId === id) return config.intake
  if (config.shared.phoneNumberId && config.shared.phoneNumberId === id) return config.shared
  return null
}

export function connectionsMustNotCollide(config: WhatsappDualConnectionConfig = readWhatsappDualConnections()) {
  if (!config.shared.phoneNumberId || !config.intake.phoneNumberId) return { ok: true as const }
  if (config.shared.phoneNumberId === config.intake.phoneNumberId) {
    return { ok: false as const, error: 'Shared and intake phone number ids must be different.' }
  }
  if (config.shared.displayE164 && config.intake.displayE164 && config.shared.displayE164 === config.intake.displayE164) {
    return { ok: false as const, error: 'Shared and intake display numbers must be different.' }
  }
  return { ok: true as const }
}
