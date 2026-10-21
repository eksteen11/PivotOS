import type { MeetingItem } from '@/lib/data/meetings'
import { toSastIso } from '@/lib/intake/shared'

const TZ = 'Africa/Johannesburg'

export const DOOR_COMPANIES = [
  { id: 'digikraal', label: 'Digikraal', entitySlug: 'digikraal' },
  { id: 'northpoint', label: 'Northpoint', entitySlug: 'northpoint' },
  { id: 'farm-feed', label: 'Farm Feed', entitySlug: 'farm_feed' },
  { id: 'personal', label: 'Personal', entitySlug: 'dj' },
] as const

export type DoorCompanyId = (typeof DOOR_COMPANIES)[number]['id']

export type DoorCompanyOption = {
  id: DoorCompanyId
  label: string
  entityId: string
}

export type DoorMeeting = {
  id: string
  title: string
  company: DoorCompanyId
  description: string
  people: string
  timeLabel: string
  startsAt: string
  when: 'today' | 'week'
  link: string
  place: string
}

export type WeekRange = {
  today: string
  monday: string
  nextMonday: string
  previousMonday: string
  start: string
  end: string
  label: string
  isCurrent: boolean
}

const WEEKDAY: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }

function dateKey(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

function addDays(key: string, days: number): string {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10)
}

function weekdayIndex(key: string): number {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' }).format(new Date(`${key}T12:00:00+02:00`))
  return WEEKDAY[name] ?? 0
}

function formatWeekLabel(monday: string) {
  const last = addDays(monday, 6)
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric' })
  return `${fmt.format(new Date(`${monday}T12:00:00+02:00`))} – ${fmt.format(new Date(`${last}T12:00:00+02:00`))}`
}

export function isSastDateKey(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T12:00:00+02:00`)
  return !Number.isNaN(parsed.getTime()) && dateKey(parsed) === value
}

export function weekRangeForDate(key: string, now = new Date()): WeekRange {
  const monday = addDays(key, -weekdayIndex(key))
  const nextMonday = addDays(monday, 7)
  const today = dateKey(now)
  const currentMonday = addDays(today, -weekdayIndex(today))
  return {
    today,
    monday,
    nextMonday,
    previousMonday: addDays(monday, -7),
    start: new Date(`${monday}T00:00:00+02:00`).toISOString(),
    end: new Date(`${nextMonday}T00:00:00+02:00`).toISOString(),
    label: formatWeekLabel(monday),
    isCurrent: monday === currentMonday,
  }
}

export function thisWeekRange(now = new Date()) {
  return weekRangeForDate(dateKey(now), now)
}

export function parseWeekParam(value: unknown, now = new Date()) {
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw === 'string' && isSastDateKey(raw.trim())) return weekRangeForDate(raw.trim(), now)
  return thisWeekRange(now)
}

export function meetingTimeLabel(core: { schedule: { confirmed: boolean; startAt: string }; legacyDueAt: string | null }) {
  if (core.schedule.confirmed) {
    const iso = toSastIso(core.schedule.startAt)
    if (iso) return formatSastLabel(iso)
  }
  if (core.legacyDueAt) return formatSastLabel(core.legacyDueAt)
  return ''
}

export function formatSastLabel(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function isInWeek(value: string, range: Pick<WeekRange, 'monday' | 'nextMonday'>) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  const key = dateKey(date)
  return key >= range.monday && key < range.nextMonday
}

export function mergeMeetingsForWeek<T extends { id: string; startsAt?: string }>(current: T[], incoming: T[], range: Pick<WeekRange, 'monday' | 'nextMonday'>) {
  const additions = incoming.filter((meeting) => Boolean(meeting.startsAt) && isInWeek(meeting.startsAt ?? '', range))
  const ids = new Set(additions.map((meeting) => meeting.id))
  return [...additions, ...current.filter((meeting) => !ids.has(meeting.id))]
}

export function calendarPath(monday: string, currentMonday: string) {
  return monday === currentMonday ? '/calendar' : `/calendar?week=${monday}`
}

export function workspaceCalendarPath(monday: string, currentMonday: string) {
  return monday === currentMonday ? '/today?view=calendar' : `/today?view=calendar&week=${monday}`
}

export function startsAtIso(date: string, time: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null
  const value = new Date(`${date}T${time}:00+02:00`)
  if (Number.isNaN(value.getTime())) return null
  return value.toISOString()
}

function metaText(meta: Record<string, unknown>, key: string): string {
  const value = meta[key]
  return typeof value === 'string' ? value.trim() : ''
}

export function doorCompanies(entities: { id: string; slug: string }[]): DoorCompanyOption[] {
  return DOOR_COMPANIES.flatMap((door) => {
    const entity = entities.find((item) => item.slug === door.entitySlug)
    return entity ? [{ id: door.id, label: door.label, entityId: entity.id }] : []
  })
}

export function toDoorMeetings(meetings: MeetingItem[], range: WeekRange = thisWeekRange()): DoorMeeting[] {
  const { today } = range
  const slugToDoor = new Map<string, DoorCompanyId>(DOOR_COMPANIES.map((door) => [door.entitySlug, door.id]))

  return meetings.flatMap((meeting) => {
    if (!meeting.due_at || !isInWeek(meeting.due_at, range)) return []
    const starts = new Date(meeting.due_at)
    if (Number.isNaN(starts.getTime())) return []
    const key = dateKey(starts)
    const company = slugToDoor.get(meeting.entities?.slug ?? '')
    if (!company) return []
    const description = meeting.content.trim() || meeting.title?.trim() || 'Meeting'
    return [{
      id: meeting.id,
      title: meeting.title?.trim() || description,
      company,
      description,
      people: metaText(meeting.meta, 'people') || metaText(meeting.meta, 'who'),
      timeLabel: formatSastLabel(meeting.due_at),
      startsAt: meeting.due_at,
      when: key === today ? 'today' as const : 'week' as const,
      link: metaText(meeting.meta, 'link'),
      place: metaText(meeting.meta, 'place') || metaText(meeting.meta, 'where'),
    }]
  })
}
