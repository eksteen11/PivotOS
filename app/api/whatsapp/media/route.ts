import { NextResponse } from 'next/server'
import { requireFounderSession } from '@/lib/intake/server'
import { isUuid } from '@/lib/intake/shared'
import { createMediaRecord, suggestDriveCopy, type WhatsappMediaRecord } from '@/lib/whatsapp/media'
import { readWhatsappChannelConfig } from '@/lib/whatsapp/config'
import { mediaDownloadStatus, upsertMediaRecord } from '@/lib/whatsapp/store'
import { whatsappAdmin } from '@/lib/whatsapp/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const auth = await requireFounderSession()
  if (!auth) return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  const admin = whatsappAdmin()
  if (!admin) return NextResponse.json({ error: 'Private storage is not configured.', connected: false }, { status: 503 })
  const body = await request.json().catch(() => null) as null | {
    id?: string
    messageId?: string
    contactKey?: string
    mimeType?: string
    kind?: WhatsappMediaRecord['kind']
    suggestDrive?: boolean
    at?: string
  }
  if (!body?.contactKey || !body.messageId) {
    return NextResponse.json({ error: 'contactKey and messageId are required.' }, { status: 400 })
  }
  const at = body.at && Number.isFinite(Date.parse(body.at)) ? body.at : new Date().toISOString()
  const id = body.id && isUuid(body.id) ? body.id : crypto.randomUUID()
  let record = createMediaRecord({
    id,
    ownerId: auth.user.id,
    messageId: body.messageId,
    contactKey: body.contactKey,
    mimeType: body.mimeType || 'application/octet-stream',
    kind: body.kind || 'unknown',
    at,
  })
  if (body.suggestDrive !== false) record = suggestDriveCopy(record)
  const persisted = await upsertMediaRecord(admin, record)
  if (!persisted.ok) return NextResponse.json({ error: persisted.error }, { status: 503 })
  const { config } = readWhatsappChannelConfig()
  const download = mediaDownloadStatus(Boolean(config?.accessToken))
  return NextResponse.json({
    connected: true,
    record: persisted.record,
    bytesDownloaded: false,
    download,
    notice: 'Owner-scoped media row saved. Bytes not fetched. Drive copy remains suggestion-only.',
  })
}
