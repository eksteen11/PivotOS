import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { weekRangeForDate } from '@/lib/door/meetings'
import { PivotWorkspace } from '@/components/workspace/PivotWorkspace'

const now = new Date('2026-10-21T08:00:00+02:00')
const current = weekRangeForDate('2026-10-19', now)
const next = weekRangeForDate('2026-10-26', now)

const midweek = {
  id: 'midweek',
  title: 'Midweek check',
  company: 'digikraal',
  timeLabel: 'Wed, 21 Oct, 08:00',
  people: 'Drikus',
  place: 'Desk',
  startsAt: '2026-10-21T06:00:00.000Z',
}

const visit = {
  id: 'visit',
  title: 'Plaasbesoek Ceres',
  company: 'digikraal',
  timeLabel: 'Wed, 28 Oct, 08:00',
  people: 'Drikus + CP',
  place: 'CP plaas Ceres',
  startsAt: '2026-10-28T06:00:00.000Z',
}

function selection() {
  const selected = new URLSearchParams(window.location.search).get('week') === '2026-10-26'
  const range = selected ? next : current
  return {
    meetings: selected ? [visit] : [midweek],
    deskMeetings: [midweek],
    week: {
      label: range.label,
      monday: range.monday,
      previousMonday: range.previousMonday,
      nextMonday: range.nextMonday,
      isCurrent: range.monday === current.monday,
      currentMonday: current.monday,
    },
  }
}

export function Harness() {
  const [data, setData] = useState(selection)
  useEffect(() => {
    const apply = () => setData(selection())
    window.addEventListener('popstate', apply)
    return () => window.removeEventListener('popstate', apply)
  }, [])
  return <PivotWorkspace meetings={data.meetings} deskMeetings={data.deskMeetings} week={data.week} initialView="calendar" founderUserId="founder-test" />
}

createRoot(document.getElementById('root')!).render(<Harness />)
