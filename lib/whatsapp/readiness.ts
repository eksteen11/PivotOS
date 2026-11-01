export type WhatsappProviderStatus = 'not-connected' | 'setup-incomplete' | 'ready-for-founder-review'

export type WhatsappReadinessCheck = {
  id: string
  label: string
  status: 'missing' | 'local-only' | 'needs-founder' | 'ready'
  detail: string
}

export type WhatsappEnvPresence = {
  meetingsOwnerId: boolean
  meetingsToken: boolean
  meetingsPhoneId: boolean
  meetingsGraphVersion: boolean
  meetingsAppSecret: boolean
  meetingsVerifyToken: boolean
  channelAppSecret: boolean
  channelVerifyToken: boolean
  channelPhoneNumberId: boolean
  channelAccessToken: boolean
  channelWabaId: boolean
  channelOwnerId: boolean
}

/** Presence only. Never read or return secret values. */
export function readWhatsappEnvPresence(env: NodeJS.ProcessEnv = process.env): WhatsappEnvPresence {
  return {
    meetingsOwnerId: Boolean(env.MEETINGS_WHATSAPP_OWNER_ID),
    meetingsToken: Boolean(env.MEETINGS_WHATSAPP_TOKEN),
    meetingsPhoneId: Boolean(env.MEETINGS_WHATSAPP_PHONE_ID),
    meetingsGraphVersion: Boolean(env.MEETINGS_WHATSAPP_GRAPH_VERSION),
    meetingsAppSecret: Boolean(env.MEETINGS_WHATSAPP_APP_SECRET),
    meetingsVerifyToken: Boolean(env.MEETINGS_WHATSAPP_VERIFY_TOKEN),
    channelAppSecret: Boolean(env.WHATSAPP_APP_SECRET),
    channelVerifyToken: Boolean(env.WHATSAPP_VERIFY_TOKEN),
    channelPhoneNumberId: Boolean(env.WHATSAPP_PHONE_NUMBER_ID),
    channelAccessToken: Boolean(env.WHATSAPP_ACCESS_TOKEN),
    channelWabaId: Boolean(env.WHATSAPP_WABA_ID),
    channelOwnerId: Boolean(env.WHATSAPP_OWNER_ID),
  }
}

export function recommendCoexistenceRoute() {
  return {
    route: 'meta-tech-provider-embedded-signup-v4-coexistence' as const,
    preservesPhoneApp: true,
    paidBspChosen: false,
    number: '+27827721220',
    evidence: [
      'Meta docs: Onboard WhatsApp Business app users (coexistence) via Embedded Signup; requirements include WhatsApp Business app ≥ 2.24.17, Tech Provider or Solution Partner, Cloud API, webhook digestion, session logging. Prefer Embedded Signup v4 before 15 Oct 2026.',
      'Meta docs: after successful onboarding the Business app stays usable for 1:1 chats; history sync for recent 1:1 chats/contacts; groups/broadcasts/view-once/live location are not mirrored.',
      'Meta pricing (official, Jul 2025 PMP): outbound template messages are billed per delivered message by category and recipient country; inbound user→business messages are not charged; non-template messages inside an open customer service window are free; utility templates inside that window are free; free entry-point windows still apply. The old “1,000 free service messages / phone / month” cap is obsolete (service was made unlimited/free from 1 Nov 2024). Exact ZA ZAR rates live only in Meta’s published rate-card CSV/PDF — not quoted as a budget here.',
      'Region: Meta’s current coexistence guide no longer lists excluded countries; Embedded Signup for +27827721220 remains the final gate. Tech Provider still requires business verification + App Review (Access Verification retired Oct 2026).',
      'Host app (founder correction): dedicated NEW Meta developer app named Pivot OS for this shared connection. Keep DK KraalDesk WA (1378007830977628) separate and untouched — no credential reuse. Kraaldesk remains an internal Pivot module. Do not create the new Meta app until founder review of the concrete create action.',
    ],
    avoid: [
      'Do not deregister or migrate the phone number off the WhatsApp Business app.',
      'Do not choose a paid BSP in this recommendation.',
      'Do not treat DigiKraal test numbers as the production sender.',
      'Do not reuse DK KraalDesk WA (1378007830977628) credentials or onboard that app for Pivot.',
      'Do not claim Business-app group sync under coexistence — Meta marks groups not supported; keep groups visible as unsupported.',
    ],
  }
}

export function buildWhatsappReadiness(presence: WhatsappEnvPresence = readWhatsappEnvPresence()): {
  status: WhatsappProviderStatus
  checks: WhatsappReadinessCheck[]
  canSend: false
  canImportHistory: false
  coexistenceVerified: false
} {
  const channelConfigured = presence.channelAccessToken && presence.channelPhoneNumberId && presence.channelAppSecret && presence.channelVerifyToken && presence.channelOwnerId
  const meetingsConfigured = presence.meetingsToken && presence.meetingsPhoneId && presence.meetingsAppSecret && presence.meetingsVerifyToken
  const checks: WhatsappReadinessCheck[] = [
    {
      id: 'phone-app',
      label: 'Keep WhatsApp Business app on +27 82 772 1220',
      status: 'needs-founder',
      detail: 'Recommended route: new dedicated Meta app Pivot OS + Tech Provider + Embedded Signup v4 coexistence. Phone app stays. KraalDesk WA left untouched. No paid BSP selected.',
    },
    {
      id: 'meta-role',
      label: 'Pivot OS Meta app Tech Provider / Embedded Signup v4',
      status: 'needs-founder',
      detail: 'Create dedicated app Pivot OS under founder review first. Coexistence needs Tech Provider or Solution Partner + session logging. Do not reuse KraalDesk WA credentials.',
    },
    {
      id: 'waba-mapping',
      label: 'Host WABA for the live number',
      status: 'needs-founder',
      detail: 'Do not bind DigiKraal test numbers. Inspect Page/WABA mapping during onboarding and keep +27 71 164 8444 for a later DigiKraal-only connection.',
    },
    {
      id: 'webhook',
      label: 'Signed inbound webhook',
      status: channelConfigured || meetingsConfigured ? 'local-only' : 'missing',
      detail: channelConfigured
        ? 'Channel webhook env names are present. Live acceptance still requires deployed secrets, migration 0024, and a signed Meta challenge.'
        : 'Shared-inbox webhook code expects WHATSAPP_* secrets. Meeting reminder vars do not connect this inbox.',
    },
    {
      id: 'history',
      label: 'History synchronisation window',
      status: 'missing',
      detail: 'Meta requires history sync soon after coexistence onboarding. Desired full history is not proof of support.',
    },
    {
      id: 'outbound-approval',
      label: 'Founder approval before every outbound send',
      status: 'ready',
      detail: 'Sending stays disabled in code and schema. Approval records a decision only.',
    },
  ]
  return {
    status: channelConfigured ? 'setup-incomplete' : 'not-connected',
    checks,
    canSend: false,
    canImportHistory: false,
    coexistenceVerified: false,
  }
}
