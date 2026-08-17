'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Entity } from '@/lib/types/database'

export function MeetingCapture({ entities }: { entities: Entity[] }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [entityId, setEntityId] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !entityId) return
    setBusy(true)
    await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, entity_id: entityId }),
    })
    setTitle('')
    setContent('')
    setBusy(false)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-black/[0.07] bg-white/80 p-4 shadow-deck sm:p-5">
      <label className="block text-sm font-semibold">
        Meeting name
        <input className="field-input mt-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Northpoint Pacesetter" />
      </label>
      <label className="block text-sm font-semibold">
        Notes
        <textarea className="field-input mt-2 min-h-24 resize-y" value={content} onChange={(e) => setContent(e.target.value)} placeholder="What this meeting is for…" />
      </label>
      <label className="block text-sm font-semibold">
        Business
        <select className="field-input mt-2" value={entityId} onChange={(e) => setEntityId(e.target.value)}>
          <option value="" disabled>Choose a business</option>
          {entities.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn-primary w-full" disabled={busy || !title.trim() || !content.trim() || !entityId}>
        {busy ? 'Saving…' : 'Save meeting'}
      </button>
    </form>
  )
}
