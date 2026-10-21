import { FrontDoor } from '@/components/door/FrontDoor'
import { getMeetings } from '@/lib/data/meetings'
import { getEntities } from '@/lib/data/queries'
import { doorCompanies, thisWeekRange, toDoorMeetings } from '@/lib/door/meetings'

export default async function CalendarPage() {
  const range = thisWeekRange()
  const [entities, meetings] = await Promise.all([getEntities(), getMeetings(undefined, range)])
  return <FrontDoor items={toDoorMeetings(meetings)} companies={doorCompanies(entities)} deskHref="/today?view=calendar" />
}
