import { FrontDoor } from '@/components/door/FrontDoor'
import { getMeetings } from '@/lib/data/meetings'
import { getEntities } from '@/lib/data/queries'
import { calendarPath, doorCompanies, parseWeekParam, thisWeekRange, toDoorMeetings, workspaceCalendarPath } from '@/lib/door/meetings'

export default async function CalendarPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = (await searchParams) ?? {}
  const range = parseWeekParam(params.week)
  const current = thisWeekRange()
  const [entities, meetings] = await Promise.all([getEntities(), getMeetings(undefined, range)])
  return (
    <FrontDoor
      items={toDoorMeetings(meetings, range)}
      companies={doorCompanies(entities)}
      deskHref={workspaceCalendarPath(range.monday, current.monday)}
      week={{
        label: range.label,
        isCurrent: range.isCurrent,
        previousHref: calendarPath(range.previousMonday, current.monday),
        nextHref: calendarPath(range.nextMonday, current.monday),
        currentHref: '/calendar',
      }}
    />
  )
}
