import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { FounderCommandCentre } from '../../../components/modules/002/FounderCommandCentre'
import type { FounderLens } from '../../../lib/modules/002/contract'
import { deskSignals, today } from './fixtures'

export function Harness() {
  const [lens, setLens] = useState<FounderLens>('founder')
  const [opened, setOpened] = useState('')
  return (
    <section>
      <nav style={{ position: 'sticky', top: 0, zIndex: 2, display: 'flex', gap: 8, padding: 12, background: '#fff' }}>
        <button type="button" data-testid="lens-founder" onClick={() => setLens('founder')}>Founder lens</button>
        <button type="button" data-testid="lens-digikraal" onClick={() => setLens('digikraal')}>Digikraal lens</button>
      </nav>
      <p data-testid="opened">{opened}</p>
      <FounderCommandCentre signals={deskSignals} lens={lens} today={today} onOpen={setOpened} />
    </section>
  )
}

createRoot(document.getElementById('root')!).render(<Harness />)
