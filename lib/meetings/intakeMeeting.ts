import { hasValidMeetingWindow, toSastIso, type IntakeProposal } from '@/lib/intake/shared'
import { type MeetingClarification, type MeetingCore } from '@/lib/meetings/core'
import { getSystem, systemFitsCompany } from '@/lib/workspace/catalogue'

function mergeClarifications(existing: MeetingClarification[], incoming: { field: string; answer: string }[]) {
  const seen = new Set(existing.map((item) => `${item.field}\n${item.answer}`))
  const added = incoming.flatMap((item) => {
    const field = item.field.trim().slice(0, 40)
    const answer = item.answer.trim().slice(0, 500)
    const key = `${field}\n${answer}`
    if (!field || !answer || seen.has(key)) return []
    seen.add(key)
    return [{ field, question: '', answer }]
  })
  return [...existing, ...added].slice(-8)
}

export function mergeIntakeMeeting(input: { existing: MeetingCore; existingDueAt: string | null; proposal: IntakeProposal; clarifications: { field: string; answer: string }[]; sourceCaptureId: string }) {
  if (input.existing.reviewClaim?.phase === 'pending') return { ok: false as const, error: 'A review is being saved. Retry it before editing.' }
  const confirmed = input.proposal.meeting.confirmedSchedule && hasValidMeetingWindow(input.proposal.meeting.startAt, input.proposal.meeting.endAt)
  const system = getSystem(input.proposal.systemId)
  const core: MeetingCore = {
    ...input.existing,
    company: input.proposal.company,
    systemId: system && systemFitsCompany(system, input.proposal.company) ? system.id : input.existing.systemId,
    purpose: input.proposal.notes || input.proposal.title || input.existing.purpose,
    attendees: input.proposal.meeting.people || input.existing.attendees,
    place: input.proposal.meeting.place || input.existing.place,
    schedule: confirmed ? { startAt: input.proposal.meeting.startAt, endAt: input.proposal.meeting.endAt, confirmed: true } : input.existing.schedule,
    legacySchedule: confirmed ? false : input.existing.legacySchedule,
    legacyDueAt: confirmed ? null : input.existing.legacyDueAt,
    lifecycle: confirmed && input.existing.lifecycle === 'to_arrange' ? 'scheduled' : input.existing.lifecycle,
    sourceCaptureId: input.sourceCaptureId,
    clarifications: mergeClarifications(input.existing.clarifications, input.clarifications),
  }
  return { ok: true as const, core, dueAt: confirmed ? toSastIso(input.proposal.meeting.startAt) : input.existingDueAt }
}

export async function saveExistingIntakeMeeting(input: {
  expectedUpdatedAt: string
  existing: MeetingCore
  existingDueAt: string | null
  proposal: IntakeProposal
  clarifications: { field: string; answer: string }[]
  sourceCaptureId: string
  write: (expectedUpdatedAt: string, next: { core: MeetingCore; dueAt: string | null }) => Promise<{ ok: true; updatedAt: string } | { ok: false }>
}) {
  if (input.existing.reviewClaim?.phase === 'pending') return { ok: false as const, status: 409 as const, error: 'A review is being saved. Retry it before editing.' }
  const merged = mergeIntakeMeeting(input)
  if (!merged.ok) return { ok: false as const, status: 409 as const, error: merged.error }
  const saved = await input.write(input.expectedUpdatedAt, { core: merged.core, dueAt: merged.dueAt })
  if (!saved.ok) return { ok: false as const, status: 409 as const, error: 'This meeting changed while it was being saved. Reload it before updating.' }
  return { ok: true as const, core: merged.core, dueAt: merged.dueAt, updatedAt: saved.updatedAt }
}
