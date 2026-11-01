import type { MarginDecision } from '@/lib/modules/004/approval'
import type { MatchProposal } from '@/lib/modules/004/match'
import { formatRands } from '@/lib/modules/004/money'

export function FarmFeedEvidence({ proposal, decision }: { proposal: MatchProposal; decision: MarginDecision | null }) {
  const expected = proposal.margin.scenarios.find((scenario) => scenario.label === 'expected')
  return <section className="ff004-card" aria-label="Margin evidence">
    <h2>{proposal.viable ? 'Ready to review' : 'Needs facts before an offer'}</h2>
    <p>{proposal.recommendedAction}</p>
    <dl>
      <div><dt>Quantity</dt><dd>{proposal.quantityLabel}</dd></div>
      <div><dt>Stage</dt><dd>{proposal.stage.label}</dd></div>
      <div><dt>Expected profit per unit</dt><dd>{formatRands(expected?.profitPerUnitCents ?? null)}</dd></div>
      <div><dt>Expected profit total</dt><dd>{formatRands(expected?.profitCents ?? null)}</dd></div>
      <div><dt>Delivered cost</dt><dd>{formatRands(expected?.deliveredCostCents ?? null)}</dd></div>
      <div><dt>Break-even price</dt><dd>{formatRands(expected?.breakEvenPriceCents ?? null)}</dd></div>
    </dl>
    <p>{proposal.margin.sensitivity}</p>
    <ul className="ff004-list">{proposal.margin.scenarios.map((scenario) => <li key={scenario.label}>{scenario.label}: {formatRands(scenario.profitPerUnitCents)} per unit, {formatRands(scenario.profitCents)} total</li>)}</ul>
    {proposal.margin.reasons.length ? <ul className="ff004-list">{proposal.margin.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul> : null}
    <ul className="ff004-list">{proposal.margin.components.map((component) => <li key={component.key}>{component.key.replace(/_/g, ' ')}: {component.state}{component.cents === null ? '' : ` ${formatRands(component.cents)}`}</li>)}</ul>
    {proposal.margin.unknown.length ? <p className="ff004-note">Unknown, not zero: {proposal.margin.unknown.join(', ')}.</p> : null}
    {proposal.hardMismatches.length ? <div><h3>Does not match</h3><ul className="ff004-list">{proposal.hardMismatches.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
    {proposal.compromises.length ? <div><h3>Compromises</h3><ul className="ff004-list">{proposal.compromises.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
    {proposal.missing.length ? <div><h3>Still missing</h3><ul className="ff004-list">{proposal.missing.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
    <h3>Draft, not sent</h3>
    <p data-audience="counterparty">{proposal.draftMessage}</p>
    <h3>Internal record</h3>
    <p data-audience="internal">Supply: {proposal.internalParties.supply}. Demand: {proposal.internalParties.demand}.</p>
    <p className="ff004-note">{decision ? `${decision.outcome === 'approved' ? 'Decision recorded' : 'Rejected'} by ${decision.approver}. Nothing was sent or posted.` : 'No decision recorded. Approval does not send a message or post to the ledger.'}</p>
  </section>
}
