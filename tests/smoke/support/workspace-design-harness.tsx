import { createRoot } from 'react-dom/client'
import { PivotWorkspace } from '@/components/workspace/PivotWorkspace'
import { sampleCases } from '@/lib/workspace/model'

const items = sampleCases().map((item) => ({ ...item, due: item.id === 'sample-personal' ? '2026-10-27' : '' }))
const meetings = [{ id: 'visit', title: 'Ceres farm visit', company: 'digikraal', timeLabel: 'Tue, 27 Oct, 08:00', people: 'Drikus and CP', place: 'Ceres', startsAt: '2026-10-27T06:00:00Z' }]
createRoot(document.getElementById('root')!).render(<PivotWorkspace account={{ name: 'Drikus Eksteen', email: 'drikus@example.test' }} initialCases={items} meetings={meetings} initialView={new URLSearchParams(location.search).get('view') ?? 'desk'} />)
