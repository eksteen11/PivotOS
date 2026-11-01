import { createRoot } from 'react-dom/client'
import { DigitalProductDesk } from '../../../components/modules/011/DigitalProductDesk'
import { exampleDeskState } from '../../../lib/modules/011/desk'

createRoot(document.getElementById('root')!).render(<DigitalProductDesk initial={exampleDeskState()} />)
