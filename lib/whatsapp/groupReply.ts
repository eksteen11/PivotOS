import { clampText } from '@/lib/intake/shared'

export type GroupReplyDraft = {
  id: string
  ownerId: string
  intakeItemId: string
  targetGroupLabel: string
  body: string
  status: 'draft' | 'copied' | 'confirmed-sent'
  copiedAt: string | null
  confirmedSentAt: string | null
  executes: false
  note: string
}

export function draftGroupReply(input: {
  id: string
  ownerId: string
  intakeItemId: string
  targetGroupLabel: string
  body: string
}): { ok: true; draft: GroupReplyDraft } | { ok: false; error: string } {
  const body = clampText(input.body, 4_000)
  const targetGroupLabel = clampText(input.targetGroupLabel, 200)
  if (!body) return { ok: false, error: 'Write the group reply before copying.' }
  if (!targetGroupLabel) return { ok: false, error: 'Name the target WhatsApp group for the manual send.' }
  return {
    ok: true,
    draft: {
      id: input.id,
      ownerId: input.ownerId,
      intakeItemId: input.intakeItemId,
      targetGroupLabel,
      body,
      status: 'draft',
      copiedAt: null,
      confirmedSentAt: null,
      executes: false,
      note: 'Founder copies this into WhatsApp manually. Copied does not mean sent.',
    },
  }
}

export function markGroupReplyCopied(draft: GroupReplyDraft, at: string): GroupReplyDraft {
  if (!Number.isFinite(Date.parse(at))) return draft
  if (draft.status === 'confirmed-sent') return draft
  return {
    ...draft,
    status: 'copied',
    copiedAt: at,
    note: 'Copied to clipboard/manual WhatsApp. Still waiting for founder confirmation that it was sent.',
  }
}

export function confirmGroupReplySent(draft: GroupReplyDraft, at: string): { ok: true; draft: GroupReplyDraft } | { ok: false; error: string } {
  if (!Number.isFinite(Date.parse(at))) return { ok: false, error: 'A real confirmation time is required.' }
  if (draft.status === 'draft') {
    return { ok: false, error: 'Mark the draft as copied before confirming it was sent in WhatsApp.' }
  }
  return {
    ok: true,
    draft: {
      ...draft,
      status: 'confirmed-sent',
      confirmedSentAt: at,
      executes: false,
      note: 'Founder confirmed the message was sent manually in WhatsApp. Pivot did not send via Cloud API.',
    },
  }
}
