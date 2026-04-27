export function LibraryPage() {
  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Library</h2>
        <p className="muted" style={{ margin: 0 }}>
          Processes (SOPs), decisions, problems/solutions, templates. This gets powerful once items sync and become searchable.
        </p>
      </div>

      <div className="card">
        <h2 className="cardTitle">Categories</h2>
        <ul style={{ margin: 0, paddingLeft: 18, color: 'rgba(26, 28, 28, 0.92)' }}>
          <li>Processes</li>
          <li>Decisions</li>
          <li>Problems</li>
          <li>Solutions</li>
          <li>Templates</li>
        </ul>
      </div>
    </section>
  )
}

