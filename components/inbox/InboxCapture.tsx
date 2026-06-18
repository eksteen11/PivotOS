'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Entity } from '@/lib/types/database'

export function InboxCapture({ entities }: { entities: Entity[] }) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [source, setSource] = useState('manual')
  const [entityId, setEntityId] = useState(entities[0]?.id ?? '')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setBusy(true)
    await fetch('/api/inbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, source, entity_id: entityId, title: text.slice(0, 80) }),
    })
    setText('')
    setBusy(false)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="deck-card space-y-3">
      <textarea className="field-input min-h-[100px]" placeholder="Paste message, lead, idea…" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex flex-wrap gap-3">
        <select className="field-input max-w-[140px]" value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="manual">Manual</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="gmail">Gmail</option>
          <option value="voice_note">Voice note</option>
          <option value="website">Form lead</option>
        </select>
        <select className="field-input max-w-[180px]" value={entityId} onChange={(e) => setEntityId(e.target.value)}>
          {entities.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary" disabled={busy}>Capture</button>
      </div>
    </form>
  )
}
