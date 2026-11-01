import type { DeskModel } from '../../../lib/modules/005/case'
import { livestockCss } from './styles'

export function LivestockDesk({ model }: { model: DeskModel }) {
  return (
    <section className="livestock-005" data-module="005" aria-label="Livestock agency">
      <style>{livestockCss}</style>
      <p className="livestock-kicker">{model.subtitle}</p>
      <h1>{model.title}</h1>
      <p>{model.sellerLine} <span className="livestock-badge">{model.sellerBadge}</span></p>
      {model.sample ? <p className="livestock-banner">Sample records for review. This is not a live seller, buyer, listing or appointment.</p> : null}
      <div className="livestock-next">
        <h2>{model.nextLabel}</h2>
        <p>{model.nextDetail}</p>
        <button type="button" disabled>Approve the information request</button>
      </div>
      <h2>Animals</h2>
      {model.groups.map((group) => (
        <article key={group.heading}>
          <h3>{group.heading}</h3>
          <ul>
            {group.lines.map((line) => (
              <li key={line.label}>{line.label}: {line.value} <span className="livestock-badge">{line.badge}</span></li>
            ))}
          </ul>
        </article>
      ))}
      <h2>Still needed</h2>
      <ul>
        {model.missing.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {model.heldBack.length ? (
        <div className="livestock-block">
          <h2>Held back</h2>
          <ul>{model.heldBack.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      ) : null}
      <h2>Draft request</h2>
      <p className="livestock-draft">{model.requestBody}</p>
      <h2>Match</h2>
      <p>{model.matchScore}</p>
      <ul>{model.matchLines.map((line) => <li key={line}>{line}</li>)}</ul>
      {model.separations.length ? <ul>{model.separations.map((line) => <li key={line}>{line}</li>)}</ul> : null}
      <h2>Buyer draft</h2>
      <p className="livestock-draft">{model.buyerDraft}</p>
      <h2>Seller update</h2>
      <p className="livestock-draft">{model.sellerMatchDraft}</p>
      <h2>Permit and approvals</h2>
      <p>{model.permitDetail}</p>
      <ul>{model.gates.map((gate) => <li key={gate.label}>{gate.label}: {gate.detail}</li>)}</ul>
      <h2>Viewing</h2>
      <p>{model.viewingDetail}</p>
      <h2>Pipeline</h2>
      <p>{model.pipeline}</p>
      <p>{model.privacy}</p>
    </section>
  )
}
