import { useState } from 'react'

type DocumentItem = {
  id: string
  title: string
  type: 'contract' | 'meeting_note' | 'report' | 'checklist'
  linkedTo: string
  updatedAt: string
}

export function DocumentsPage() {
  const [docs] = useState<DocumentItem[]>([
    {
      id: crypto.randomUUID(),
      title: 'Livestock Transport Agreement v2',
      type: 'contract',
      linkedTo: 'Deal: Livestock Bulk Sale',
      updatedAt: '2026-04-26',
    },
    {
      id: crypto.randomUUID(),
      title: 'Weekly Leadership Review Notes',
      type: 'meeting_note',
      linkedTo: 'Meeting: Strategy Sync',
      updatedAt: '2026-04-25',
    },
    {
      id: crypto.randomUUID(),
      title: 'Farm Feed Margin Snapshot',
      type: 'report',
      linkedTo: 'Entity: Farm Feed',
      updatedAt: '2026-04-24',
    },
  ])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Documents</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Link files and notes to deals, meetings, tasks, and entities.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button className="btn accent" type="button">
            Upload document
          </button>
          <button className="btn secondary" type="button">
            Ask AI to summarize
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="cardTitle">Recent linked documents</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
          {docs.map((d) => (
            <li
              key={d.id}
              style={{
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{d.title}</div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 6, fontWeight: 600 }}>
                    {d.linkedTo} · Updated {d.updatedAt}
                  </div>
                </div>
                <span className="statusPill" style={{ textTransform: 'capitalize' }}>
                  {d.type.replace('_', ' ')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

