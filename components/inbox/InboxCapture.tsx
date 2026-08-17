'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Entity } from '@/lib/types/database'

export function InboxCapture({ entities }: { entities: Entity[] }) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [source, setSource] = useState('manual')
  const [entityId, setEntityId] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !entityId) return
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
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-black/[0.07] bg-white/80 p-4 shadow-deck sm:p-5">
      <div>
        <label htmlFor="capture-text" className="mb-2 block text-sm font-semibold">What came in?</label>
        <textarea id="capture-text" className="field-input min-h-28 resize-y" placeholder="Paste a message, lead, idea or note…" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Source
          <select className="field-input mt-2" value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="manual">Manual note</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="gmail">Gmail</option>
            <option value="voice_note">Voice note</option>
            <option value="website">Form lead</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Business
          <select className="field-input mt-2" value={entityId} onChange={(e) => setEntityId(e.target.value)}>
            <option value="" disabled>Choose a business</option>
            {entities.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" className="btn-primary w-full" disabled={busy || !text.trim() || !entityId}>
        {busy ? 'Capturing…' : 'Capture to inbox'}
      </button>
    </form>
  )
}
