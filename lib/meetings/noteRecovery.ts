export type NoteDraft = { liveNotes: string; meetingTranscript: string; baseUpdatedAt: string }

export function noteRecoveryKey(founderId: string, meetingId: string) {
  return `pivotos:meeting-notes:v1:${founderId}:${meetingId}`
}

export function parseNoteRecovery(raw: string | null): NoteDraft | null {
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as Partial<NoteDraft>
    if (typeof value.liveNotes !== 'string' || typeof value.meetingTranscript !== 'string' || typeof value.baseUpdatedAt !== 'string') return null
    return { liveNotes: value.liveNotes, meetingTranscript: value.meetingTranscript, baseUpdatedAt: value.baseUpdatedAt }
  } catch {
    return null
  }
}

export function noteRecoveryDecision(input: { serverNotes: string; serverTranscript: string; serverUpdatedAt: string; stored: NoteDraft | null }) {
  if (!input.stored) return 'none' as const
  if (input.stored.liveNotes === input.serverNotes && input.stored.meetingTranscript === input.serverTranscript) return 'none' as const
  if (input.stored.baseUpdatedAt === input.serverUpdatedAt) return 'resume' as const
  return 'ask' as const
}
