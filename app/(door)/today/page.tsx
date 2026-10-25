import { accountName } from '@/lib/auth/navigation'
import { PivotWorkspace } from '@/components/workspace/PivotWorkspace'
import { getArrangeMeetings, getMeetings } from '@/lib/data/meetings'
import { parseWeekParam, thisWeekRange, toDoorMeetings, type WeekRange } from '@/lib/door/meetings'
import { appearsOnCalendar, entitySlugFrom, readMeetingCore } from '@/lib/meetings/core'
import { createClient } from '@/lib/supabase/server'
import { isUuid } from '@/lib/intake/shared'
import { readOwnedWorkCase, readWorkCases } from '@/lib/workspace/data'
import type { WorkCase } from '@/lib/workspace/model'

const VIEWS = new Set(['desk', 'inbox', 'work', 'calendar', 'workforce', 'systems'])

function errorMessage(value: unknown, fallback: string) {
  return value instanceof Error && value.message ? value.message : fallback
}

function asWorkspaceMeetings(meetings: Awaited<ReturnType<typeof getMeetings>>, range: WeekRange) {
  return toDoorMeetings(meetings, range).map((item) => ({
    id: item.id,
    title: item.title,
    company: item.company,
    timeLabel: item.timeLabel,
    startsAt: item.startsAt,
    people: item.people,
    place: item.place,
  }))
}

export default async function TodayPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = (await searchParams) ?? {}
  const viewParam = Array.isArray(params.view) ? params.view[0] : params.view
  const workParam = Array.isArray(params.work) ? params.work[0] : params.work
  const requestedWork = workParam && isUuid(workParam) ? workParam : ''
  const initialView = requestedWork ? 'work' : viewParam && VIEWS.has(viewParam) ? viewParam : 'desk'
  const selectedWeek = parseWeekParam(params.week)
  const currentWeek = thisWeekRange()

  let items: WorkCase[] = []
  let meetings: ReturnType<typeof asWorkspaceMeetings> = []
  let deskMeetings: ReturnType<typeof asWorkspaceMeetings> = []
  let arrangeMeetings: { id: string; title: string; company: string; timeLabel: string; people: string; place: string }[] = []
  let loadError = ''
  let founderUserId = ''
  let account = { name: 'Your account', email: '' }

  try {
    const sb = await createClient()
    const { data: { user } } = await sb.auth.getUser()
    founderUserId = user?.id ?? ''
    if (user) account = { name: accountName(user), email: user.email ?? '' }
  } catch {
    founderUserId = ''
  }

  try {
    items = await readWorkCases()
    if (requestedWork && !items.some((item) => item.id === requestedWork)) {
      const linked = await readOwnedWorkCase(requestedWork)
      if (linked) items = [linked, ...items]
    }
  } catch (error) {
    loadError = errorMessage(error, 'Saved work could not be loaded yet.')
  }

  try {
    const selectedRows = await getMeetings(undefined, selectedWeek)
    meetings = asWorkspaceMeetings(selectedRows, selectedWeek)
    deskMeetings = selectedWeek.monday === currentWeek.monday
      ? meetings
      : asWorkspaceMeetings(await getMeetings(undefined, currentWeek), currentWeek)
    arrangeMeetings = (await getArrangeMeetings()).flatMap((row) => {
      const core = readMeetingCore(row.meta ?? {}, row.due_at, entitySlugFrom(row.entities))
      if (!core || appearsOnCalendar(core) || core.lifecycle === 'closed' || core.lifecycle === 'cancelled') return []
      return [{ id: row.id, title: row.title || core.purpose || 'Meeting', company: core.company, timeLabel: 'To arrange', people: core.attendees, place: core.place }]
    })
  } catch (error) {
    const meetingError = errorMessage(error, 'Meetings could not be loaded yet.')
    loadError = loadError ? `${loadError} ${meetingError}` : meetingError
  }

  return <PivotWorkspace account={account} key={`${selectedWeek.monday}:${requestedWork}`} initialCases={items} meetings={meetings} deskMeetings={deskMeetings} arrangeMeetings={arrangeMeetings} week={{ label: selectedWeek.label, monday: selectedWeek.monday, previousMonday: selectedWeek.previousMonday, nextMonday: selectedWeek.nextMonday, isCurrent: selectedWeek.isCurrent, currentMonday: currentWeek.monday }} loadError={loadError} initialView={initialView} initialWorkId={requestedWork} founderUserId={founderUserId} />
}
