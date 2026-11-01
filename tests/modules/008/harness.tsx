import { createRoot } from 'react-dom/client'
import { CapitalDesk } from '../../../components/modules/008/CapitalDesk'
import { exampleDeskState } from '../../../lib/modules/008/desk'

createRoot(document.getElementById('root')!).render(<CapitalDesk initial={exampleDeskState()} />)
