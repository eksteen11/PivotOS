import { clampText } from '@/lib/intake/shared'
import { isWhatsappContext, type WhatsappContext } from './contexts'

export type WhatsappMediaRecord = {
  id: string
  ownerId: string
  messageId: string
  contactKey: string
  mimeType: string
  kind: 'image' | 'audio' | 'document' | 'video' | 'sticker' | 'unknown'
  storagePath: string
  bucket: 'whatsapp-media'
  privacy: 'founder-private'
  retainedIndependently: true
  driveCopyStatus: 'not-suggested' | 'suggested' | 'approved-pending-copy' | 'copied' | 'rejected'
  createdAt: string
}

export type MediaDraftKind = 'livestock-listing' | 'lead' | 'deal' | 'task'

export type MediaDerivedDraft = {
  id: string
  mediaId: string
  kind: MediaDraftKind
  title: string
  summary: string
  context: WhatsappContext | null
  moduleHint: '005' | '003' | '006' | '010' | 'general'
  status: 'suggested' | 'approved' | 'rejected'
  executes: false
  createdAt: string
}

export const WHATSAPP_MEDIA_BUCKET = 'whatsapp-media'

export function createMediaRecord(input: {
  id: string
  ownerId: string
  messageId: string
  contactKey: string
  mimeType: string
  kind: WhatsappMediaRecord['kind']
  at: string
}): WhatsappMediaRecord {
  const contactKey = input.contactKey.replace(/\D/g, '') || 'unknown'
  const storagePath = `${input.ownerId}/${contactKey}/${input.messageId}/${input.id}`
  return {
    id: input.id,
    ownerId: input.ownerId,
    messageId: input.messageId,
    contactKey,
    mimeType: clampText(input.mimeType, 128) || 'application/octet-stream',
    kind: input.kind,
    storagePath,
    bucket: WHATSAPP_MEDIA_BUCKET,
    privacy: 'founder-private',
    retainedIndependently: true,
    driveCopyStatus: 'not-suggested',
    createdAt: input.at,
  }
}

/** Suggest a Drive copy for founder approval — never auto-create. */
export function suggestDriveCopy(record: WhatsappMediaRecord): WhatsappMediaRecord {
  if (record.driveCopyStatus === 'copied' || record.driveCopyStatus === 'approved-pending-copy') return record
  return { ...record, driveCopyStatus: 'suggested' }
}

export function approveDriveCopy(record: WhatsappMediaRecord): WhatsappMediaRecord {
  if (record.driveCopyStatus !== 'suggested') return record
  return { ...record, driveCopyStatus: 'approved-pending-copy' }
}

export function rejectDriveCopy(record: WhatsappMediaRecord): WhatsappMediaRecord {
  if (record.driveCopyStatus !== 'suggested' && record.driveCopyStatus !== 'approved-pending-copy') return record
  return { ...record, driveCopyStatus: 'rejected' }
}

/** Provider/WhatsApp deletion must not delete Pivot’s independent copy. */
export function retainAfterProviderDelete(record: WhatsappMediaRecord) {
  return { ...record, retainedIndependently: true as const }
}

export function suggestMediaDerivedDraft(input: {
  id: string
  mediaId: string
  kind: MediaDraftKind
  title: string
  summary: string
  context?: string | null
  at: string
}): { ok: true; draft: MediaDerivedDraft } | { ok: false; error: string } {
  const title = clampText(input.title, 200)
  const summary = clampText(input.summary, 4_000)
  if (!title || !summary) return { ok: false, error: 'Draft suggestions need a title and summary.' }
  const context = input.context == null || input.context === ''
    ? null
    : isWhatsappContext(input.context)
      ? input.context
      : null
  if (input.context && !context) return { ok: false, error: 'Choose a known WhatsApp context, or leave it unset.' }
  const moduleHint = input.kind === 'livestock-listing'
    ? '005'
    : input.kind === 'lead' || input.kind === 'deal'
      ? context === 'northpoint' ? '003' : context === 'digikraal' ? '005' : '006'
      : 'general'
  return {
    ok: true,
    draft: {
      id: input.id,
      mediaId: input.mediaId,
      kind: input.kind,
      title,
      summary,
      context,
      moduleHint,
      status: 'suggested',
      executes: false,
      createdAt: input.at,
    },
  }
}

export function approveMediaDerivedDraft(draft: MediaDerivedDraft): MediaDerivedDraft {
  return { ...draft, status: 'approved', executes: false }
}

export function rejectMediaDerivedDraft(draft: MediaDerivedDraft): MediaDerivedDraft {
  return { ...draft, status: 'rejected', executes: false }
}
