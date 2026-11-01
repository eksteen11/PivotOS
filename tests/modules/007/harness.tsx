import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { PartnerFarmingDesk } from '../../../components/modules/007/PartnerFarmingDesk'
import { unsignedWaterfall, varianceBooks } from './fixtures'

function Harness() {
  const [opened, setOpened] = useState('')
  return (
    <section>
      <p data-testid="opened">{opened}</p>
      <PartnerFarmingDesk books={varianceBooks} waterfall={unsignedWaterfall} onOpen={setOpened} />
    </section>
  )
}

createRoot(document.getElementById('root')!).render(<Harness />)
