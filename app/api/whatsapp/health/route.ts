import { NextResponse } from 'next/server'
import { requireFounderSession } from '@/lib/intake/server'
import {
  WHATSAPP_FOUNDER_E164,
  readWhatsappChannelConfig,
  webhookCallbackUrl,
} from '@/lib/whatsapp/config'
import { acceptanceGateBlockers, whatsappOfficialCapabilities } from '@/lib/whatsapp/capabilities'
import { buildWhatsappReadiness, recommendCoexistenceRoute } from '@/lib/whatsapp/readiness'
import { whatsappAdmin } from '@/lib/whatsapp/server'

export const runtime = 'nodejs'

export async function GET() {
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const { config, missing } = readWhatsappChannelConfig()
  const readiness = buildWhatsappReadiness()
  const recommendation = recommendCoexistenceRoute()
  const admin = whatsappAdmin()
  let tableReady = false
  let inboundCount: number | null = null
  if (admin) {
    const { count, error } = await admin.from('whatsapp_messages').select('id', { count: 'exact', head: true }).eq('owner_id', auth.user.id)
    tableReady = !error
    inboundCount = error ? null : count
  }
  return NextResponse.json({
    providerStatus: readiness.status,
    displayE164: config?.displayE164 || WHATSAPP_FOUNDER_E164,
    webhookUrl: webhookCallbackUrl(),
    configPresent: Boolean(config),
    missingEnv: missing,
    serviceRolePresent: Boolean(admin),
    tableReady,
    inboundCount,
    sendingEnabled: false,
    canSend: false,
    coexistenceVerified: false,
    metaAppId: '1093416513462830',
    businessVerification: 'information-submitted-awaiting-approval',
    acceptanceGates: acceptanceGateBlockers().map((gate) => ({ id: gate.id, status: gate.status, label: gate.label })),
    capabilities: whatsappOfficialCapabilities().map((cap) => ({ id: cap.id, status: cap.status, label: cap.label })),
    recommendation,
    checks: readiness.checks,
  })
}
