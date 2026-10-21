import { asCompany, clampText, hasValidMeetingWindow, intakeProposalKinds, isLocalDateTime, isUuid, validSystemForCompany, type IntakeProposal } from '@/lib/intake/shared'

export function validateSessionIds(sourceCaptureId: string, idempotencyKey: string) {
  return isUuid(sourceCaptureId) && isUuid(idempotencyKey)
}

export function normalizeProposal(value: unknown): IntakeProposal | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const proposalId = String(row.proposalId ?? '')
  if (!isUuid(proposalId)) return null
  const company = asCompany(row.company)
  if (!company) return null
  const systemId = clampText(row.systemId, 10)
  if (!validSystemForCompany(systemId, company)) return null
  const title = clampText(row.title, 180)
  if (!title) return null
  const kindRaw = clampText(row.kind, 24)
  if (!intakeProposalKinds.includes(kindRaw as IntakeProposal['kind'])) return null
  const kind = kindRaw as IntakeProposal['kind']
  const meeting = row.meeting && typeof row.meeting === 'object' ? (row.meeting as Record<string, unknown>) : {}
  const startAt = clampText(meeting.startAt, 32)
  const endAt = clampText(meeting.endAt, 32)
  if (startAt && !isLocalDateTime(startAt)) return null
  if (endAt && !isLocalDateTime(endAt)) return null
  const confirmedSchedule = Boolean(meeting.confirmedSchedule)
  if (confirmedSchedule && !hasValidMeetingWindow(startAt, endAt)) return null
  return {
    proposalId,
    kind,
    title,
    company,
    systemId,
    notes: clampText(row.notes, 12000),
    requiresExternalApproval: Boolean(row.requiresExternalApproval),
    uncertainties: Array.isArray(row.uncertainties)
      ? row.uncertainties
          .flatMap((entry) => {
            const item = clampText(entry, 200)
            return item ? [item] : []
          })
          .slice(0, 10)
      : [],
    meeting: {
      confirmedSchedule,
      startAt,
      endAt,
      people: clampText(meeting.people, 220),
      place: clampText(meeting.place, 220),
    },
  }
}
