import { createRoot } from 'react-dom/client'
import { NorthpointModule } from '../../../components/modules/003/NorthpointModule'

let sequence = 0
createRoot(document.getElementById('root')!).render(<NorthpointModule now={() => '2026-10-25T12:00:00.000Z'} createId={() => `record-${sequence += 1}`} />)
