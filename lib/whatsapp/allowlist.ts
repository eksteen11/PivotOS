import { normalizeWhatsappE164, WHATSAPP_FOUNDER_E164 } from './config'

export type VerifiedSender = {
  e164: string
  label: string
  role: 'founder'
  verified: true
}

/** Only verified founder senders may create intake records on the dedicated intake number. */
export function readFounderIntakeAllowlist(env: NodeJS.ProcessEnv = process.env): VerifiedSender[] {
  const raw = (env.WHATSAPP_INTAKE_FOUNDER_ALLOWLIST || env.WHATSAPP_FOUNDER_ALLOWLIST || WHATSAPP_FOUNDER_E164)
    .split(/[,;\s]+/)
    .map((value) => normalizeWhatsappE164(value))
    .filter(Boolean)
  const unique = Array.from(new Set(raw))
  return unique.map((e164) => ({
    e164,
    label: e164 === WHATSAPP_FOUNDER_E164 || e164 === '+27827721220' ? 'Drikus' : 'Founder',
    role: 'founder' as const,
    verified: true as const,
  }))
}

export function isVerifiedFounderSender(fromE164: string, allowlist: VerifiedSender[] = readFounderIntakeAllowlist()) {
  const normalized = normalizeWhatsappE164(fromE164.startsWith('+') ? fromE164 : `+${fromE164.replace(/\D/g, '')}`)
  if (!normalized) return false
  return allowlist.some((row) => row.e164 === normalized)
}

export function rejectUnknownIntakeSender(fromE164: string, allowlist: VerifiedSender[] = readFounderIntakeAllowlist()) {
  if (isVerifiedFounderSender(fromE164, allowlist)) return { ok: true as const }
  return {
    ok: false as const,
    error: 'Unknown senders cannot create founder intake records or access intake data.',
  }
}
