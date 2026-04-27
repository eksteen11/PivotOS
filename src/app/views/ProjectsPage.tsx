import { useState } from 'react'

type Project = {
  id: string
  title: string
  owner: string
  status: 'active' | 'blocked' | 'done'
  nextAction: string
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: crypto.randomUUID(),
      title: 'Digikraal lead pipeline revamp',
      owner: 'DJ Eksteen',
      status: 'active',
      nextAction: 'Review agent-generated pipeline tags',
    },
    {
      id: crypto.randomUUID(),
      title: 'Farm Feed export onboarding flow',
      owner: 'Operations',
      status: 'blocked',
      nextAction: 'Resolve supplier compliance checklist',
    },
    {
      id: crypto.randomUUID(),
      title: 'North Point listing media workflow',
      owner: 'Marketing',
      status: 'done',
      nextAction: 'Archive and reuse as playbook',
    },
  ])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Projects</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="statusPill">Active {projects.filter((p) => p.status === 'active').length}</span>
          <span className="statusPill">Blocked {projects.filter((p) => p.status === 'blocked').length}</span>
          <span className="statusPill">Done {projects.filter((p) => p.status === 'done').length}</span>
        </div>
      </div>

      <div className="card">
        <h2 className="cardTitle">Execution lanes</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
          {projects.map((p) => (
            <li
              key={p.id}
              style={{
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{p.title}</div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 6, fontWeight: 600 }}>
                    Owner: {p.owner}
                  </div>
                </div>
                <span className="statusPill" style={{ textTransform: 'capitalize' }}>
                  {p.status}
                </span>
              </div>
              <div className="field" style={{ marginTop: 12 }}>
                <label>Next action</label>
                <input
                  style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
                  value={p.nextAction}
                  onChange={(e) => {
                    const v = e.target.value
                    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, nextAction: v } : x)))
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

