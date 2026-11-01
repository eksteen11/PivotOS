import { createRoot } from 'react-dom/client'
import { PropertyInvestmentDesk } from '../../../components/modules/006/PropertyInvestmentDesk'
import { exampleDeskState } from '../../../lib/modules/006/desk'

createRoot(document.getElementById('root')!).render(<PropertyInvestmentDesk initial={exampleDeskState()} />)
