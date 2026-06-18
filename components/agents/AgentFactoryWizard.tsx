'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Entity } from '@/lib/types/database'

type Props = {
  entities: Entity[]
  suggestion?: { title: string; description: string; preset?: { name: string; role: string; slug: string } }
}

export function AgentFactoryWizard({ entities, suggestion }: Props) {
  const router = useRouter()
  const [name, setName] = useState(suggestion?.preset?.name ?? '')
  const [role, setRole] = useState(suggestion?.preset?.role ?? '')
  const [slug, setSlug] = useState(suggestion?.preset?.slug ?? '')
  const [entityId, setEntityId] = useState(entities[0]?.id ?? '')
  const [jobDescription, setJobDescription] = useState(suggestion?.description ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        role,
        slug: slug || name.toLowerCase().replace(/\s+/g, '_'),
        entity_id: entityId,
        job_description: jobDescription,
        status: 'active',
      }),
    })
    setBusy(false)
    if (!res.ok) {
      setError(await res.text())
      return
    }
    router.push('/agents')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="deck-card space-y-4">
      {suggestion ? (
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{suggestion.title}</p>
      ) : null}
      <div>
        <label className="text-sm font-medium">Agent name</label>
        <input className="field-input mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="text-sm font-medium">Entity</label>
        <select className="field-input mt-1" value={entityId} onChange={(e) => setEntityId(e.target.value)} required>
          {entities.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Slug</label>
        <input className="field-input mt-1" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from name" />
      </div>
      <div>
        <label className="text-sm font-medium">Role</label>
        <input className="field-input mt-1" value={role} onChange={(e) => setRole(e.target.value)} required />
      </div>
      <div>
        <label className="text-sm font-medium">Job description</label>
        <textarea className="field-input mt-1 min-h-[100px]" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Creating…' : 'Activate agent'}</button>
    </form>
  )
}
