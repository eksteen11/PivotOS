import { useMemo, useState } from 'react'

import { useAppState } from '../state/AppState'

type Contact = {
  id: string
  name: string
  company: string
  channel: 'WhatsApp' | 'Email' | 'Phone'
  lastTouch: string
  nextFollowUp: string
  priority: 'high' | 'normal'
}

export function ContactsPage() {
  const { entities, entityId } = useAppState()
  const [query, setQuery] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: crypto.randomUUID(),
      name: 'Jan van Rensburg',
      company: 'North Point Realty',
      channel: 'WhatsApp',
      lastTouch: '2026-04-24',
      nextFollowUp: '2026-04-27',
      priority: 'high',
    },
    {
      id: crypto.randomUUID(),
      name: 'Karin Botha',
      company: 'Farm Feed',
      channel: 'Email',
      lastTouch: '2026-04-21',
      nextFollowUp: '2026-04-28',
      priority: 'normal',
    },
  ])

  const entityLabel = entities.find((e) => e.id === entityId)?.label ?? entityId

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return contacts
    return contacts.filter((c) => `${c.name} ${c.company} ${c.channel}`.toLowerCase().includes(q))
  }, [contacts, query])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Contacts / CRM</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Relationship intelligence starter for {entityLabel}.
        </p>
        <div className="field">
          <label>Search contacts</label>
          <input
            style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
            placeholder="Name, company, channel"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="cardTitle">Follow-up due</h2>
        {filtered.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No contacts match your search.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {filtered.map((c) => (
              <li
                key={c.id}
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'grid',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{c.name}</div>
                  <span className="statusPill" style={c.priority === 'high' ? { background: 'var(--accent-surface)', color: '#009954', borderColor: 'transparent' } : {}}>{c.priority === 'high' ? 'High priority' : 'Normal'}</span>
                </div>
                <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
                  {c.company} · {c.channel}
                </div>
                <div className="muted" style={{ fontSize: 12, fontWeight: 500 }}>
                  Last touch: {c.lastTouch} · Follow-up: {c.nextFollowUp}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                  <button className="btn accent" type="button">
                    Log follow-up
                  </button>
                  <button
                    className="btn secondary"
                    type="button"
                    onClick={() => {
                      setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, lastTouch: new Date().toISOString().slice(0, 10) } : x)))
                    }}
                  >
                    Mark touched
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

