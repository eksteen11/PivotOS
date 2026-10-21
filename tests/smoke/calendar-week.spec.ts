import { expect, test } from '@playwright/test'

import type { MeetingItem } from '../../lib/data/meetings'
import {
  calendarPath,
  formatSastLabel,
  isInWeek,
  mergeMeetingsForWeek,
  parseWeekParam,
  toDoorMeetings,
  weekRangeForDate,
  workspaceCalendarPath,
} from '../../lib/door/meetings'

const now = new Date('2026-10-21T08:00:00+02:00')
const weekOf19 = weekRangeForDate('2026-10-19', now)
const weekOf26 = weekRangeForDate('2026-10-26', now)
const visitAt = '2026-10-28T06:00:00.000Z'
const mondayStartSast = '2026-10-25T22:00:00.000Z'
const nextMondayStartSast = '2026-11-01T22:00:00.000Z'

function meeting(dueAt: string): MeetingItem {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    entity_id: 'entity',
    title: 'Plaasbesoek Ceres',
    content: 'Besoek',
    due_at: dueAt,
    meta: { people: 'Drikus + CP', place: 'CP plaas Ceres' },
    entities: { slug: 'digikraal', name: 'DigiKraal' },
  }
}

test('next-week meeting is visible in the 26 Oct week and hidden in the 19 Oct week', () => {
  expect(weekOf26.monday).toBe('2026-10-26')
  expect(weekOf19.monday).toBe('2026-10-19')
  expect(parseWeekParam('2026-10-28', now).monday).toBe('2026-10-26')
  expect(parseWeekParam('2026-02-30', now).monday).toBe('2026-10-19')
  expect(parseWeekParam('not-a-date', now).monday).toBe('2026-10-19')

  const selected = toDoorMeetings([meeting(visitAt)], weekOf26)
  const excluded = toDoorMeetings([meeting(visitAt)], weekOf19)
  expect(selected.map((item) => item.title)).toEqual(['Plaasbesoek Ceres'])
  expect(excluded).toEqual([])
  expect(selected[0]?.timeLabel).toMatch(/28 Oct/)
  expect(selected[0]?.timeLabel).toMatch(/08:00/)
  expect(selected[0]?.timeLabel).not.toMatch(/\d{4}-\d{2}-\d{2}T/)
  expect(workspaceCalendarPath(weekOf26.monday, weekOf19.monday)).toBe('/today?view=calendar&week=2026-10-26')
  expect(calendarPath(weekOf26.monday, weekOf19.monday)).toBe('/calendar?week=2026-10-26')
  expect(workspaceCalendarPath(weekOf19.monday, weekOf19.monday)).toBe('/today?view=calendar')
})

test('saved meeting matches the reloaded week and stays out of the current week', () => {
  const label = formatSastLabel(visitAt)
  const saved = {
    id: meeting(visitAt).id,
    title: 'Plaasbesoek Ceres',
    company: 'digikraal',
    timeLabel: label,
    people: 'Drikus + CP',
    place: 'CP plaas Ceres',
    startsAt: visitAt,
  }
  const kept = { ...saved, id: '22222222-2222-4222-8222-222222222222', startsAt: '2026-10-21T06:00:00.000Z', timeLabel: formatSastLabel('2026-10-21T06:00:00.000Z') }

  expect(mergeMeetingsForWeek([kept], [saved], weekOf19).map((item) => item.id)).toEqual([kept.id])
  expect(mergeMeetingsForWeek([], [saved], weekOf26)).toEqual([saved])
  expect(toDoorMeetings([meeting(visitAt)], weekOf26)[0]?.timeLabel).toBe(label)
  expect(toDoorMeetings([meeting(visitAt)], weekOf19)).toEqual([])
})

test('SAST midnight boundaries stay in the Johannesburg week', () => {
  expect(weekOf26.start).toBe(mondayStartSast)
  expect(weekOf26.end).toBe(nextMondayStartSast)
  expect(isInWeek(mondayStartSast, weekOf26)).toBe(true)
  expect(isInWeek(mondayStartSast, weekOf19)).toBe(false)
  expect(isInWeek(nextMondayStartSast, weekOf26)).toBe(false)
  expect(isInWeek(nextMondayStartSast, weekRangeForDate('2026-11-02', now))).toBe(true)
  expect(formatSastLabel(mondayStartSast)).toMatch(/26 Oct/)
  expect(formatSastLabel(mondayStartSast)).toMatch(/00:00/)
  expect(formatSastLabel(mondayStartSast)).not.toMatch(/\d{4}-\d{2}-\d{2}T/)
})
