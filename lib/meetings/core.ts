import { hasValidMeetingWindow, isUuid } from '@/lib/intake/shared'
import { companies, getSystem, systemFitsCompany, type Company } from '@/lib/workspace/catalogue'

export const meetingLifecycles = ['to_arrange', 'scheduled', 'preparing', 'ready', 'in_progress', 'minutes_review', 'follow_up', 'closed', 'cancelled'] as const
export type MeetingLifecycle = (typeof meetingLifecycles)[number]

export type MeetingSchedule = { startAt: string; endAt: string; confirmed: boolean }
export type MeetingPrepItem = { id: string; text: string; done: boolean; source: 'auto' | 'custom' }
export type MeetingAction = { id: string; title: string; include: boolean; company: Company | ''; systemId: string; owner: string; due: string }
export type MeetingMinutes = {
  revision: number
  discussion: string
  decisions: string[]
  actions: MeetingAction[]
  questions: string[]
  evidence: 'transcript' | 'notes' | 'none'
}
export type MeetingClarification = { field: string; question: string; answer: string }
export type MeetingCore = {
  version: 1
  lifecycle: MeetingLifecycle
  company: Company
  systemId: string
  purpose: string
  desiredOutcome: string
  attendees: string
  agenda: string
  agendaSource: 'auto' | 'manual'
  prep: MeetingPrepItem[]
  schedule: MeetingSchedule
  legacySchedule: boolean
  legacyDueAt: string | null
  place: string
  link: string
  liveNotes: string
  meetingTranscript: string
  minutes: MeetingMinutes | null
  minutesStale: boolean
  approvedRevision: number | null
  followUpItemIds: string[]
  reviewClaim: { revision: number; fingerprint: string; phase: 'pending' | 'committed'; actions: MeetingAction[] } | null
  sourceCaptureId: string | null
  clarifications: MeetingClarification[]
}

const transitions: Record<MeetingLifecycle, MeetingLifecycle[]> = {
  to_arrange: ['scheduled', 'cancelled'],
  scheduled: ['preparing', 'to_arrange', 'cancelled'],
  preparing: ['ready', 'scheduled', 'cancelled'],
  ready: ['in_progress', 'preparing', 'cancelled'],
  in_progress: ['minutes_review', 'ready', 'cancelled'],
  minutes_review: ['follow_up', 'in_progress', 'cancelled'],
  follow_up: ['closed', 'minutes_review'],
  closed: [],
  cancelled: ['to_arrange'],
}

export function knownCompany(value: unknown): Company | null {
  const company = String(value ?? '') as Company
  return companies.some((item) => item.id === company) ? company : null
}

export function companyFromEntitySlug(slug: string | null | undefined): Company | null {
  return companies.find((item) => item.slug === slug)?.id ?? null
}

export function entitySlugFrom(value: unknown) {
  if (Array.isArray(value)) return typeof value[0]?.slug === 'string' ? value[0].slug : null
  if (value && typeof value === 'object' && 'slug' in value && typeof value.slug === 'string') return value.slug
  return null
}

function clip(value: unknown, max: number) {
  return String(value ?? '').trim().slice(0, max)
}

function systemFor(company: Company, systemId: unknown) {
  const system = getSystem(String(systemId ?? ''))
  return system && systemFitsCompany(system, company) ? system.id : '001'
}

export function createMeetingCore(input: {
  company: Company
  systemId?: string
  purpose?: string
  desiredOutcome?: string
  attendees?: string
  place?: string
  link?: string
  schedule?: Partial<MeetingSchedule>
  sourceCaptureId?: string | null
  clarifications?: MeetingClarification[]
}): MeetingCore {
  const schedule = {
    startAt: clip(input.schedule?.startAt, 16),
    endAt: clip(input.schedule?.endAt, 16),
    confirmed: Boolean(input.schedule?.confirmed) && hasValidMeetingWindow(String(input.schedule?.startAt ?? ''), String(input.schedule?.endAt ?? '')),
  }
  const core: MeetingCore = {
    version: 1,
    lifecycle: schedule.confirmed ? 'scheduled' : 'to_arrange',
    company: input.company,
    systemId: systemFor(input.company, input.systemId),
    purpose: clip(input.purpose, 2000),
    desiredOutcome: clip(input.desiredOutcome, 2000),
    attendees: clip(input.attendees, 1000),
    agenda: '',
    agendaSource: 'auto',
    prep: [],
    schedule,
    legacySchedule: false,
    legacyDueAt: null,
    place: clip(input.place, 500),
    link: clip(input.link, 500),
    liveNotes: '',
    meetingTranscript: '',
    minutes: null,
    minutesStale: false,
    approvedRevision: null,
    followUpItemIds: [],
    reviewClaim: null,
    sourceCaptureId: input.sourceCaptureId && isUuid(input.sourceCaptureId) ? input.sourceCaptureId : null,
    clarifications: Array.isArray(input.clarifications) ? input.clarifications.slice(0, 8).map((item) => ({ field: clip(item.field, 40), question: clip(item.question, 300), answer: clip(item.answer, 500) })) : [],
  }
  return refreshAutoPrep(core, core)
}

export function incompleteMeeting(input: { title?: string; company?: unknown; systemId?: string; purpose?: string; desiredOutcome?: string; attendees?: string; place?: string; note?: string; sourceCaptureId?: string | null }) {
  const company = knownCompany(input.company)
  if (!company) return { ok: false as const, error: 'Choose a business.' }
  const title = clip(input.title, 180)
  if (!title) return { ok: false as const, error: 'A meeting title is required.' }
  const core = createMeetingCore({
    company,
    systemId: input.systemId,
    purpose: input.purpose || input.note,
    desiredOutcome: input.desiredOutcome,
    attendees: input.attendees,
    place: input.place,
    sourceCaptureId: input.sourceCaptureId,
  })
  return { ok: true as const, title, core, dueAt: null as string | null }
}

function prepItem(value: unknown): MeetingPrepItem | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const text = clip(row.text, 240)
  if (!text) return null
  return { id: clip(row.id, 40) || `prep-${text.slice(0, 12)}`, text, done: Boolean(row.done), source: row.source === 'auto' ? 'auto' : 'custom' }
}

function actionItem(value: unknown, index: number): MeetingAction | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const title = clip(row.title, 180)
  if (!title) return null
  const company = knownCompany(row.company) ?? ''
  const system = getSystem(String(row.systemId ?? ''))
  const due = /^\d{4}-\d{2}-\d{2}$/.test(String(row.due ?? '')) ? String(row.due) : ''
  return { id: clip(row.id, 40) || `action-${index + 1}`, title, include: row.include !== false, company, systemId: system?.id ?? '', owner: clip(row.owner, 120), due }
}

function readClaim(value: unknown): MeetingCore['reviewClaim'] {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const phase = row.phase === 'pending' || row.phase === 'committed' ? row.phase : null
  const fingerprint = typeof row.fingerprint === 'string' ? row.fingerprint : ''
  const revision = Number(row.revision)
  if (!phase || !fingerprint || !Number.isInteger(revision)) return null
  return { phase, fingerprint, revision, actions: reviewedActions(row.actions) }
}

export function reviewedActions(actions: unknown) {
  if (!Array.isArray(actions)) return []
  return actions.map(actionItem).filter((item): item is MeetingAction => Boolean(item)).slice(0, 12)
}

function readStored(row: Record<string, unknown>, dueAt: string | null, entitySlug?: string | null): MeetingCore | null {
  const company = knownCompany(row.company) ?? companyFromEntitySlug(entitySlug)
  if (!company) return null
  const schedule = row.schedule && typeof row.schedule === 'object' ? row.schedule as Record<string, unknown> : {}
  const startAt = clip(schedule.startAt, 16)
  const endAt = clip(schedule.endAt, 16)
  const confirmed = Boolean(schedule.confirmed) && hasValidMeetingWindow(startAt, endAt)
  const legacySchedule = Boolean(row.legacySchedule)
  const minutes = row.minutes && typeof row.minutes === 'object' ? row.minutes as Record<string, unknown> : null
  return {
    version: 1,
    lifecycle: meetingLifecycles.includes(row.lifecycle as MeetingLifecycle) ? row.lifecycle as MeetingLifecycle : 'to_arrange',
    company,
    systemId: systemFor(company, row.systemId),
    purpose: clip(row.purpose, 2000),
    desiredOutcome: clip(row.desiredOutcome, 2000),
    attendees: clip(row.attendees, 1000),
    agenda: clip(row.agenda, 4000),
    agendaSource: row.agendaSource === 'manual' ? 'manual' : 'auto',
    prep: Array.isArray(row.prep) ? row.prep.map(prepItem).filter((item): item is MeetingPrepItem => Boolean(item)).slice(0, 16) : [],
    schedule: { startAt: confirmed ? startAt : '', endAt: confirmed ? endAt : '', confirmed },
    legacySchedule,
    legacyDueAt: legacySchedule ? dueAt || (typeof row.legacyDueAt === 'string' ? row.legacyDueAt : null) : null,
    place: clip(row.place, 500),
    link: clip(row.link, 500),
    liveNotes: clip(row.liveNotes, 20000),
    meetingTranscript: clip(row.meetingTranscript, 20000),
    minutes: minutes ? {
      revision: Number(minutes.revision) || 0,
      discussion: clip(minutes.discussion, 4000),
      decisions: Array.isArray(minutes.decisions) ? minutes.decisions.map((item) => clip(item, 300)).filter(Boolean).slice(0, 8) : [],
      actions: reviewedActions(minutes.actions),
      questions: Array.isArray(minutes.questions) ? minutes.questions.map((item) => clip(item, 300)).filter(Boolean).slice(0, 6) : [],
      evidence: minutes.evidence === 'transcript' || minutes.evidence === 'notes' ? minutes.evidence : 'none',
    } : null,
    minutesStale: Boolean(row.minutesStale),
    approvedRevision: Number.isInteger(row.approvedRevision) ? Number(row.approvedRevision) : null,
    followUpItemIds: Array.isArray(row.followUpItemIds) ? row.followUpItemIds.map(String).filter(isUuid).slice(0, 20) : [],
    reviewClaim: readClaim(row.reviewClaim),
    sourceCaptureId: typeof row.sourceCaptureId === 'string' && isUuid(row.sourceCaptureId) ? row.sourceCaptureId : null,
    clarifications: Array.isArray(row.clarifications) ? row.clarifications.slice(0, 8).map((item) => {
      const entry = item as Record<string, unknown>
      return { field: clip(entry.field, 40), question: clip(entry.question, 300), answer: clip(entry.answer, 500) }
    }) : [],
  }
}

export function readMeetingCore(meta: Record<string, unknown> | null, dueAt: string | null, entitySlug?: string | null): MeetingCore | null {
  const stored = meta?.meeting_core
  if (stored && typeof stored === 'object' && (stored as { version?: number }).version === 1) {
    return readStored(stored as Record<string, unknown>, dueAt, entitySlug)
  }
  const company = knownCompany(meta?.company) ?? companyFromEntitySlug(entitySlug)
  if (!company) return null
  const intake = meta?.intake && typeof meta.intake === 'object' ? meta.intake as Record<string, unknown> : {}
  const legacyDueAt = dueAt || null
  return {
    version: 1,
    lifecycle: legacyDueAt ? 'scheduled' : 'to_arrange',
    company,
    systemId: '001',
    purpose: '',
    desiredOutcome: '',
    attendees: clip(meta?.people, 1000),
    agenda: '',
    agendaSource: 'auto',
    prep: [],
    schedule: { startAt: '', endAt: '', confirmed: false },
    legacySchedule: Boolean(legacyDueAt),
    legacyDueAt,
    place: clip(meta?.place, 500),
    link: clip(meta?.link, 500),
    liveNotes: '',
    meetingTranscript: '',
    minutes: null,
    minutesStale: false,
    approvedRevision: null,
    followUpItemIds: [],
    reviewClaim: null,
    sourceCaptureId: typeof intake.source_capture_id === 'string' && isUuid(intake.source_capture_id) ? intake.source_capture_id : null,
    clarifications: [],
  }
}

export function draftInternalPrep(core: MeetingCore) {
  const agenda = [core.purpose && `Purpose: ${core.purpose}`, core.desiredOutcome && `Outcome: ${core.desiredOutcome}`, core.attendees && `Attendees: ${core.attendees}`, core.place && `Place: ${core.place}`].filter(Boolean).join('\n')
  const prep: MeetingPrepItem[] = [
    core.purpose ? { id: 'prep-purpose', text: 'Confirm the purpose before the meeting', done: false, source: 'auto' } : null,
    core.attendees ? { id: 'prep-people', text: 'Check who is attending', done: false, source: 'auto' } : null,
    core.desiredOutcome ? { id: 'prep-outcome', text: 'Keep the desired outcome visible', done: false, source: 'auto' } : null,
  ].filter((item): item is MeetingPrepItem => Boolean(item))
  return { agenda, prep }
}

export function mergePrep(existing: MeetingPrepItem[], drafted: MeetingPrepItem[]) {
  const kept = existing.filter((item) => item.source === 'custom' || item.done)
  const seen = new Set(kept.map((item) => item.text))
  return [...kept, ...drafted.filter((item) => !seen.has(item.text))].slice(0, 16)
}

function refreshAutoPrep(current: MeetingCore, next: MeetingCore) {
  if (next.agendaSource !== 'auto') return next
  const drafted = draftInternalPrep(next)
  next.agenda = drafted.agenda
  next.prep = mergePrep(current.prep, drafted.prep)
  return next
}

export type MeetingPatch = Partial<Pick<MeetingCore, 'lifecycle' | 'company' | 'systemId' | 'purpose' | 'desiredOutcome' | 'attendees' | 'agenda' | 'agendaSource' | 'place' | 'link' | 'liveNotes' | 'meetingTranscript'>> & {
  prep?: MeetingPrepItem[]
  startAt?: string
  endAt?: string
  clearSchedule?: boolean
  minutesActions?: MeetingAction[]
}

export function itemStatusForLifecycle(lifecycle: MeetingLifecycle) {
  if (lifecycle === 'cancelled') return 'cancelled'
  if (lifecycle === 'closed') return 'done'
  if (lifecycle === 'minutes_review' || lifecycle === 'follow_up') return 'waiting'
  if (lifecycle === 'preparing' || lifecycle === 'ready' || lifecycle === 'in_progress') return 'in_progress'
  return 'planned'
}

export function appearsOnCalendar(core: MeetingCore) {
  if (core.lifecycle === 'to_arrange' || core.lifecycle === 'cancelled') return false
  return core.schedule.confirmed || Boolean(core.legacySchedule && core.legacyDueAt)
}

export function canTransition(from: MeetingLifecycle, to: MeetingLifecycle, core: MeetingCore) {
  if (from === to) return true
  if (!transitions[from].includes(to)) return false
  if (to === 'scheduled' && !core.schedule.confirmed && !core.legacySchedule) return false
  if (to === 'ready' && core.prep.some((item) => !item.done)) return false
  if (to === 'minutes_review' && !core.liveNotes.trim() && !core.meetingTranscript.trim() && !core.minutes) return false
  if (to === 'follow_up' && core.approvedRevision == null) return false
  return true
}

export function actionTarget(action: MeetingAction) {
  const company = knownCompany(action.company)
  const system = company ? getSystem(action.systemId) : undefined
  if (!company || !system || !systemFitsCompany(system, company)) return null
  return { company, systemId: system.id, owner: action.owner.trim().slice(0, 120), due: /^\d{4}-\d{2}-\d{2}$/.test(action.due) ? action.due : '' }
}

export function applyMeetingPatch(current: MeetingCore, patch: MeetingPatch, existingDueAt: string | null = current.legacyDueAt): { ok: true; core: MeetingCore; dueAt: string | null } | { ok: false; error: string } {
  if (current.reviewClaim?.phase === 'pending') return { ok: false, error: 'A review is being saved. Retry it before editing.' }
  const next: MeetingCore = {
    ...current,
    schedule: { ...current.schedule },
    prep: current.prep.map((item) => ({ ...item })),
    clarifications: current.clarifications.map((item) => ({ ...item })),
    minutes: current.minutes ? { ...current.minutes, decisions: [...current.minutes.decisions], actions: current.minutes.actions.map((item) => ({ ...item })), questions: [...current.minutes.questions] } : null,
    followUpItemIds: [...current.followUpItemIds],
  }
  if ('company' in patch) {
    const company = knownCompany(patch.company)
    if (!company) return { ok: false, error: 'Choose a business.' }
    next.company = company
  }
  if ('systemId' in patch || 'company' in patch) next.systemId = systemFor(next.company, patch.systemId ?? next.systemId)
  if ('purpose' in patch) next.purpose = clip(patch.purpose, 2000)
  if ('desiredOutcome' in patch) next.desiredOutcome = clip(patch.desiredOutcome, 2000)
  if ('attendees' in patch) next.attendees = clip(patch.attendees, 1000)
  if ('place' in patch) next.place = clip(patch.place, 500)
  if ('link' in patch) next.link = clip(patch.link, 500)
  if ('agendaSource' in patch) next.agendaSource = patch.agendaSource === 'manual' ? 'manual' : 'auto'
  if ('agenda' in patch) {
    next.agenda = clip(patch.agenda, 4000)
    next.agendaSource = 'manual'
  }
  if ('liveNotes' in patch) next.liveNotes = clip(patch.liveNotes, 20000)
  if ('meetingTranscript' in patch) next.meetingTranscript = clip(patch.meetingTranscript, 20000)
  if (current.minutes && current.minutes.revision > 0 && (next.liveNotes !== current.liveNotes || next.meetingTranscript !== current.meetingTranscript)) {
    next.minutesStale = true
    next.approvedRevision = null
    if (next.lifecycle === 'follow_up') next.lifecycle = 'minutes_review'
  }
  if (patch.prep) next.prep = patch.prep.map(prepItem).filter((item): item is MeetingPrepItem => Boolean(item)).slice(0, 16)
  if (patch.minutesActions && next.minutes) {
    next.minutes.actions = reviewedActions(patch.minutesActions)
    if (current.approvedRevision != null) {
      next.minutes.revision += 1
      next.approvedRevision = null
      next.minutesStale = false
      if (next.lifecycle === 'follow_up' || next.lifecycle === 'closed') next.lifecycle = 'minutes_review'
    }
  }
  const touchesSchedule = 'startAt' in patch || 'endAt' in patch || patch.clearSchedule === true
  if ('startAt' in patch || 'endAt' in patch) {
    next.schedule = { startAt: 'startAt' in patch ? clip(patch.startAt, 16) : next.schedule.startAt, endAt: 'endAt' in patch ? clip(patch.endAt, 16) : next.schedule.endAt, confirmed: false }
  }
  let dueAt = existingDueAt
  if (touchesSchedule) {
    if (patch.clearSchedule) {
      next.schedule = { startAt: '', endAt: '', confirmed: false }
      next.legacySchedule = false
      next.legacyDueAt = null
      if (next.lifecycle === 'scheduled') next.lifecycle = 'to_arrange'
      dueAt = null
    } else if (hasValidMeetingWindow(next.schedule.startAt, next.schedule.endAt)) {
      next.schedule.confirmed = true
      next.legacySchedule = false
      next.legacyDueAt = null
      if (next.lifecycle === 'to_arrange') next.lifecycle = 'scheduled'
      dueAt = `${next.schedule.startAt}:00+02:00`
    } else {
      return { ok: false, error: 'Enter an exact start and end. The saved time was not changed.' }
    }
  } else if (next.legacySchedule) {
    dueAt = existingDueAt || current.legacyDueAt
    if (!dueAt) return { ok: false, error: 'This saved time could not be kept.' }
    next.legacyDueAt = dueAt
  } else if (next.schedule.confirmed) {
    dueAt = `${next.schedule.startAt}:00+02:00`
  } else dueAt = null

  const detailChange = ['purpose', 'desiredOutcome', 'attendees', 'place'].some((key) => key in patch)
  if (detailChange && !patch.prep) refreshAutoPrep(next, next)
  if ('lifecycle' in patch && patch.lifecycle) {
    if (!meetingLifecycles.includes(patch.lifecycle) || !canTransition(current.lifecycle, patch.lifecycle, next)) {
      return { ok: false, error: 'That meeting stage is not available yet.' }
    }
    next.lifecycle = patch.lifecycle
  }
  return { ok: true, core: next, dueAt }
}

export function reviewFollowUp(core: MeetingCore, revision: number) {
  if (core.minutesStale) return { ok: false as const, error: 'Notes changed after these minutes. Draft them again before review.' }
  if (!core.minutes || core.minutes.revision !== revision || core.minutes.evidence === 'none') {
    return { ok: false as const, error: 'Review the current minutes revision before follow-up work is created.' }
  }
  if (core.approvedRevision === revision) return { ok: true as const, alreadyApproved: true, actions: [] as MeetingAction[], existingIds: core.followUpItemIds }
  const actions = core.minutes.actions.filter((action) => action.include)
  const invalid = actions.find((action) => !actionTarget(action))
  if (invalid) return { ok: false as const, error: `Choose a valid business and subdivision for “${invalid.title}”.` }
  return { ok: true as const, alreadyApproved: false, actions, existingIds: [] as string[] }
}

export function actionKey(meetingId: string, revision: number, actionId: string) {
  return `${meetingId}:${revision}:${actionId}`
}

export function founderCanAccess(input: { role: string | null; ownerId: string; requesterId: string }) {
  return input.role === 'founder' && input.ownerId === input.requesterId
}

export function sourceLink(core: MeetingCore) {
  return core.sourceCaptureId ? `/api/intake/source/${core.sourceCaptureId}` : null
}

export function nextQuestion(core: MeetingCore): { field: 'purpose' | 'desiredOutcome' | 'attendees' | 'schedule'; prompt: string } | null {
  if (!core.purpose.trim()) return { field: 'purpose', prompt: 'What is this meeting for?' }
  if (!core.desiredOutcome.trim()) return { field: 'desiredOutcome', prompt: 'What should be true when it ends?' }
  if (!core.attendees.trim()) return { field: 'attendees', prompt: 'Who needs to be there?' }
  if (!core.schedule.confirmed && !core.legacySchedule) return { field: 'schedule', prompt: 'Add the exact date, start and end only when you know them. A weekday alone stays in To arrange.' }
  return null
}

export function lifecycleLabel(lifecycle: MeetingLifecycle) {
  return { to_arrange: 'To arrange', scheduled: 'Scheduled', preparing: 'Preparing', ready: 'Ready', in_progress: 'In progress', minutes_review: 'Minutes to review', follow_up: 'Follow-up', closed: 'Closed', cancelled: 'Cancelled' }[lifecycle]
}
