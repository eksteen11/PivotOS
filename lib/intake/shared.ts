import { companies, getSystem, systemFitsCompany, type Company } from '@/lib/workspace/catalogue'

export const intakeSourceLabels = [
  'Manual',
  'WhatsApp/text/voice/call',
  'Email',
  'Messenger',
  'LinkedIn',
] as const

export const intakeProposalKinds = [
  'task',
  'project',
  'job',
  'build',
  'work',
  'meeting',
  'idea',
  'note',
  'handoff',
  'outcome',
] as const

export type IntakeSourceLabel = (typeof intakeSourceLabels)[number]
export type IntakeProposalKind = (typeof intakeProposalKinds)[number]

export type IntakeQuestion = {
  id: string
  question: string
  field: string
}

export type IntakeProposal = {
  proposalId: string
  kind: IntakeProposalKind
  title: string
  company: Company
  systemId: string
  notes: string
  requiresExternalApproval: boolean
  uncertainties: string[]
  meeting: {
    confirmedSchedule: boolean
    startAt: string
    endAt: string
    people: string
    place: string
  }
}

export function clampText(value: unknown, limit: number) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : ''
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function asCompany(value: unknown): Company | null {
  const company = String(value ?? '') as Company
  return companies.some((entry) => entry.id === company) ? company : null
}

export function asSourceLabel(value: unknown): IntakeSourceLabel {
  const source = String(value ?? '')
  return intakeSourceLabels.includes(source as IntakeSourceLabel)
    ? (source as IntakeSourceLabel)
    : 'Manual'
}

export function validSystemForCompany(systemId: string, company: Company) {
  const system = getSystem(systemId)
  return Boolean(system && systemFitsCompany(system, company))
}

export function toSastIso(localDateTime: string) {
  const value = localDateTime.trim()
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return ''
  return `${value}:00+02:00`
}

export function isLocalDateTime(value: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value.trim())
}

export function hasValidMeetingWindow(startAtLocal: string, endAtLocal: string) {
  if (!isLocalDateTime(startAtLocal) || !isLocalDateTime(endAtLocal)) return false
  const startIso = toSastIso(startAtLocal)
  const endIso = toSastIso(endAtLocal)
  const start = new Date(startIso)
  const end = new Date(endIso)
  if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) return false
  // Compare the supplied wall-clock values independently of the server timezone.
  const startRoundTrip = new Date(`${startAtLocal}:00Z`).toISOString().slice(0, 16)
  const endRoundTrip = new Date(`${endAtLocal}:00Z`).toISOString().slice(0, 16)
  if (startRoundTrip !== startAtLocal || endRoundTrip !== endAtLocal) return false
  return end.valueOf() > start.valueOf()
}
