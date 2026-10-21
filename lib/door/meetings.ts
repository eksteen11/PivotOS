import type { MeetingItem } from '@/lib/data/meetings'

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
  when: 'today' | 'week'
  link: string
  place: string
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

export function thisWeekRange(now = new Date()) {
  const today = dateKey(now)
  const monday = addDays(today, -weekdayIndex(today))
  const nextMonday = addDays(monday, 7)
  return {
    today,
    monday,
    nextMonday,
    start: new Date(`${monday}T00:00:00+02:00`).toISOString(),
    end: new Date(`${nextMonday}T00:00:00+02:00`).toISOString(),
  }
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

export function toDoorMeetings(meetings: MeetingItem[], now = new Date()): DoorMeeting[] {
  const { today, monday, nextMonday } = thisWeekRange(now)
  const slugToDoor = new Map<string, DoorCompanyId>(DOOR_COMPANIES.map((door) => [door.entitySlug, door.id]))

  return meetings.flatMap((meeting) => {
    if (!meeting.due_at) return []
    const starts = new Date(meeting.due_at)
    if (Number.isNaN(starts.getTime())) return []
    const key = dateKey(starts)
    if (key < monday || key >= nextMonday) return []
    const company = slugToDoor.get(meeting.entities?.slug ?? '')
    if (!company) return []
    const description = meeting.content.trim() || meeting.title?.trim() || 'Meeting'
    return [{
      id: meeting.id,
      title: meeting.title?.trim() || description,
      company,
      description,
      people: metaText(meeting.meta, 'people') || metaText(meeting.meta, 'who'),
      timeLabel: new Intl.DateTimeFormat('en-GB', {
        timeZone: TZ,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(starts),
      when: key === today ? 'today' as const : 'week' as const,
      link: metaText(meeting.meta, 'link'),
      place: metaText(meeting.meta, 'place') || metaText(meeting.meta, 'where'),
    }]
  })
}
