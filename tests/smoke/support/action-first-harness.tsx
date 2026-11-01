import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { PivotWorkspace } from '@/components/workspace/PivotWorkspace'
import type { WorkCase } from '@/lib/workspace/model'

export function Harness() {
  const [items, setItems] = useState<WorkCase[] | null>(null)
  useEffect(() => { void fetch('/records').then((response) => response.json()).then(setItems) }, [])
  return items ? <PivotWorkspace account={{ name: 'Drikus Eksteen', email: 'drikus@example.test' }} founderUserId="workflow-test" initialCases={items} initialView="work" /> : <p>Loading test records…</p>
}

createRoot(document.getElementById('root')!).render(<Harness />)
