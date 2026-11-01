import { NextResponse } from 'next/server'
import { requireFounderSession } from '@/lib/intake/server'
import { buildConversation, openConversation } from '@/lib/whatsapp/conversations'
import { readWhatsappChannelConfig } from '@/lib/whatsapp/config'
import { planMarkConversationRead, executeMarkConversationRead } from '@/lib/whatsapp/markRead'
import { markConversationOpened } from '@/lib/whatsapp/store'
import { whatsappAdmin } from '@/lib/whatsapp/server'
import type { WhatsappContext } from '@/lib/whatsapp/contexts'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const admin = whatsappAdmin()
  if (!admin) return NextResponse.json({ error: 'Private storage is not configured.', connected: false }, { status: 503 })
  const body = await request.json().catch(() => null) as null | {
    kind?: 'direct' | 'group'
    contactKey?: string
    displayName?: string
    groupId?: string | null
    context?: WhatsappContext | null
    latestInboundProviderMessageId?: string
    openedAt?: string
  }
  if (!body?.contactKey) return NextResponse.json({ error: 'contactKey is required.' }, { status: 400 })
  const openedAt = body.openedAt && Number.isFinite(Date.parse(body.openedAt)) ? body.openedAt : new Date().toISOString()
  const base = buildConversation({
    ownerId: auth.user.id,
    kind: body.kind === 'group' ? 'group' : 'direct',
    contactKey: body.contactKey,
    displayName: body.displayName,
    groupId: body.groupId,
    context: body.context ?? null,
  })
  const opened = openConversation(base, openedAt)
  const persisted = await markConversationOpened(admin, auth.user.id, opened, openedAt)
  if (!persisted.ok) return NextResponse.json({ error: persisted.error }, { status: 503 })

  const { config } = readWhatsappChannelConfig()
  const markPlan = planMarkConversationRead({
    phoneNumberId: config?.phoneNumberId || '',
    latestInboundProviderMessageId: body.latestInboundProviderMessageId || '',
    accessTokenPresent: Boolean(config?.accessToken),
    graphVersion: config?.graphVersion,
  })
  const markExecution = markPlan.ok ? executeMarkConversationRead(markPlan) : null

  return NextResponse.json({
    connected: true,
    conversation: opened,
    localRead: true,
    markReadPlan: markPlan.ok ? markPlan : { ok: false, error: markPlan.error },
    markReadExecuted: false,
    markReadExecution: markExecution,
    phoneUnreadCleared: false,
    notice: 'Pivot conversation marked read in owner-scoped storage. Phone Business-app unread clear remains unverified and was not executed.',
  })
}
