import type { Company } from '@/lib/workspace/catalogue'

/**
 * Shared WhatsApp number contexts from the founder handoff.
 * Lebab is business in Drikus's own name. DJ Eksteen is private personal context, not a company.
 * These labels are not new catalogue companies.
 */
export const whatsappContexts = [
  'digikraal',
  'farm-feed',
  'northpoint',
  'lebab',
  'dj-eksteen',
] as const

export type WhatsappContext = (typeof whatsappContexts)[number]

export const whatsappContextLabels: Record<WhatsappContext, string> = {
  digikraal: 'DigiKraal',
  'farm-feed': 'Farm Feed',
  northpoint: 'Northpoint Realty',
  lebab: 'Lebab Enterprise',
  'dj-eksteen': 'DJ Eksteen · private',
}

/** Company filters for the shared desk. Lebab and DJ Eksteen stay founder-private until a company mapping exists. */
export function companyForWhatsappContext(context: WhatsappContext): Company | null {
  if (context === 'digikraal') return 'digikraal'
  if (context === 'farm-feed') return 'farm-feed'
  if (context === 'northpoint') return 'northpoint'
  if (context === 'dj-eksteen') return 'personal'
  return null
}

export function isFounderPrivateContext(context: WhatsappContext) {
  return context === 'dj-eksteen' || context === 'lebab'
}

export function isWhatsappContext(value: string): value is WhatsappContext {
  return (whatsappContexts as readonly string[]).includes(value)
}
