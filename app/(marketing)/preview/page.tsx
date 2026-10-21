import { PivotWorkspace } from '@/components/workspace/PivotWorkspace'

const previewMeetings = [
  {
    id: 'sample-meet-1',
    title: 'Seller visit prep review',
    company: 'digikraal',
    timeLabel: 'Wed, 21 Oct, 08:00',
    people: 'Drikus · CP van der Merwe',
    place: 'Ceres',
  },
]

export default function PreviewPage() {
  return <PivotWorkspace preview meetings={previewMeetings} />
}
