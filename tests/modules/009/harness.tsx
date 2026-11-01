import { createRoot } from 'react-dom/client'
import { FinanceDesk } from '../../../components/modules/009/FinanceDesk'
import { exampleDeskState } from '../../../lib/modules/009/desk'

createRoot(document.getElementById('root')!).render(<FinanceDesk initial={exampleDeskState()} />)
