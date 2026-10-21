import { PivotWorkspace } from '@/components/workspace/PivotWorkspace'
import { getMeetings } from '@/lib/data/meetings'
import { parseWeekParam, thisWeekRange, toDoorMeetings, type WeekRange } from '@/lib/door/meetings'
import { createClient } from '@/lib/supabase/server'
import { readWorkCases } from '@/lib/workspace/data'
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
  const initialView = viewParam && VIEWS.has(viewParam) ? viewParam : 'desk'
  const selectedWeek = parseWeekParam(params.week)
  const currentWeek = thisWeekRange()

  let items: WorkCase[] = []
  let meetings: ReturnType<typeof asWorkspaceMeetings> = []
  let deskMeetings: ReturnType<typeof asWorkspaceMeetings> = []
  let loadError = ''
  let founderUserId = ''

  try {
    const sb = await createClient()
    const { data: { user } } = await sb.auth.getUser()
    founderUserId = user?.id ?? ''
  } catch {
    founderUserId = ''
  }

  try {
    items = await readWorkCases()
  } catch (error) {
    loadError = errorMessage(error, 'Saved work could not be loaded yet.')
  }

  try {
    const selectedRows = await getMeetings(undefined, selectedWeek)
    meetings = asWorkspaceMeetings(selectedRows, selectedWeek)
    deskMeetings = selectedWeek.monday === currentWeek.monday
      ? meetings
      : asWorkspaceMeetings(await getMeetings(undefined, currentWeek), currentWeek)
  } catch (error) {
    const meetingError = errorMessage(error, 'Meetings could not be loaded yet.')
    loadError = loadError ? `${loadError} ${meetingError}` : meetingError
  }

  return <PivotWorkspace key={selectedWeek.monday} initialCases={items} meetings={meetings} deskMeetings={deskMeetings} week={{ label: selectedWeek.label, monday: selectedWeek.monday, previousMonday: selectedWeek.previousMonday, nextMonday: selectedWeek.nextMonday, isCurrent: selectedWeek.isCurrent, currentMonday: currentWeek.monday }} loadError={loadError} initialView={initialView} founderUserId={founderUserId} />
}
