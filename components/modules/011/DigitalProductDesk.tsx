'use client'

import { useState } from 'react'
import { githubStatuses, jiraLifecycle, jiraStatusLabels, releaseApprovers, workItemLabels, workItemTypes, type GithubKind } from '../../../lib/modules/011/contract'
import { applyDeskAction, currentJiraKey, nextMove, type DeskState } from '../../../lib/modules/011/desk'
import { confluenceStatement } from '../../../lib/modules/011/links'
import { deliveryStatus, latestJira } from '../../../lib/modules/011/request'
import './digital-product.css'

export function DigitalProductDesk({ initial }: { initial: DeskState }) {
  const [state, setState] = useState(initial)
  const move = nextMove(state)
  const focus = state.requests.find((item) => item.id === move.requestId) ?? null
  const jiraStatus = focus ? latestJira(focus)?.observedStatus ?? 'captured' : 'captured'
  const formKey = `${move.action}:${move.requestId ?? 'new'}`
  return <section className="p011" aria-label="Digital products and marketplace" data-module="011" data-company="digikraal" data-jira="not-connected" data-github="not-connected" data-public-site="not-published-from-pivot" data-payments="unavailable" data-separate-app="false" data-focus-id={move.requestId ?? ''} data-provider="not-connected">
    <p className="p011-kicker">DigiKraal · Digital products · Marketplace</p>
    <h1>{move.title}</h1>
    <p className="p011-quiet-copy">Internal Pivot OS module. Jira owns delivery records. GitHub owns the code.</p>
    {state.example ? <p className="p011-note">Example only. Not a live incident, release or publication.</p> : null}
    <p role="status">{state.message}</p>
    {state.alert ? <p role="alert" key={state.alert}>{state.alert}</p> : null}
    <section className="p011-block" aria-label="Integrations">
      <h2>Integrations</h2>
      <div className="p011-integrations">
        <p>Jira is not connected.</p>
        <p>GitHub is not connected.</p>
        <p>{state.publicSite} is not published from Pivot.</p>
        <p>Payments are unavailable.</p>
        <p>{confluenceStatement}</p>
      </div>
    </section>
    <section className="p011-action" aria-label="Your next action">
      <h2>{move.detail}</h2>
      {move.action === 'capture' ? <form key={formKey} onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); setState(applyDeskAction(state, { type: 'capture', productName: value(data, 'productName'), workType: value(data, 'workType'), problem: value(data, 'problem'), desiredOutcome: value(data, 'desiredOutcome'), acceptance: value(data, 'acceptance'), originalWording: value(data, 'originalWording'), reporter: value(data, 'reporter'), capturedAt: value(data, 'capturedAt') })) }}>
        <label>Product or website<input name="productName" defaultValue={state.productName} /></label>
        <label>Work type<select name="workType" defaultValue="defect">{workItemTypes.map((type) => <option key={type} value={type}>{workItemLabels[type]}</option>)}</select></label>
        <label>Problem<textarea name="problem" /></label>
        <label>Desired outcome<textarea name="desiredOutcome" /></label>
        <label>Acceptance criterion<input name="acceptance" /></label>
        <label>Original wording<textarea name="originalWording" /></label>
        <label>Reporter<input name="reporter" /></label>
        <label>Captured at<input name="capturedAt" defaultValue={state.asOf} /></label>
        <button className="p011-primary" type="submit">Save the product problem</button>
      </form> : null}
      {move.action === 'clarify' ? <form key={formKey} onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); setState(applyDeskAction(state, { type: 'add-acceptance', requestId: move.requestId ?? '', criterion: value(data, 'criterion'), desiredOutcome: value(data, 'desiredOutcome') })) }}>
        <label>Desired outcome<input name="desiredOutcome" defaultValue={focus?.desiredOutcome ?? ''} /></label>
        <label>Acceptance criterion<input name="criterion" /></label>
        <button className="p011-primary" type="submit">Add acceptance criterion</button>
      </form> : null}
      {move.action === 'link-jira' ? <form key={formKey} onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); setState(applyDeskAction(state, { type: 'link-jira', requestId: move.requestId ?? '', key: value(data, 'key'), observedStatus: value(data, 'observedStatus'), observedAt: value(data, 'observedAt'), evidenceNote: value(data, 'evidenceNote'), observer: value(data, 'observer') })) }}>
        <label>Jira key<input name="key" defaultValue={currentJiraKey(focus)} /></label>
        <label>Jira status<select name="observedStatus" defaultValue={jiraStatus}>{jiraLifecycle.map((status) => <option key={status} value={status}>{jiraStatusLabels[status]}</option>)}</select></label>
        <label>Observed at<input name="observedAt" defaultValue={state.asOf} /></label>
        <label>What you saw<input name="evidenceNote" /></label>
        <label>Observer<input name="observer" /></label>
        <button className="p011-primary" type="submit">Paste Jira observation</button>
      </form> : null}
      {move.action === 'link-github' ? <form key={formKey} onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); setState(applyDeskAction(state, { type: 'link-github', requestId: move.requestId ?? '', reference: value(data, 'githubReference'), recordKind: value(data, 'githubKind'), observedStatus: value(data, 'githubStatus'), observedAt: value(data, 'githubObservedAt'), evidenceNote: value(data, 'evidenceNote'), observer: value(data, 'observer') })) }}>
        <GithubFields asOf={state.asOf} />
        <label>What you saw<input name="evidenceNote" /></label>
        <label>Observer<input name="observer" /></label>
        <button className="p011-primary" type="submit">Paste GitHub observation</button>
      </form> : null}
      {move.action === 'release-note' ? <form key={formKey} onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); setState(applyDeskAction(state, { type: 'record-release', requestId: move.requestId ?? '', version: value(data, 'version'), approver: value(data, 'approver'), approvedAt: value(data, 'approvedAt'), stagingEvidence: value(data, 'stagingEvidence'), emergency: data.get('emergency') === 'on', retrospectiveNote: value(data, 'retrospectiveNote'), githubReference: value(data, 'githubReference'), githubKind: value(data, 'githubKind'), githubStatus: value(data, 'githubStatus'), githubObservedAt: value(data, 'githubObservedAt'), observer: value(data, 'observer') })) }}>
        <label>Version<input name="version" /></label>
        <label>Approver<select name="approver" defaultValue=""><option value="">Approval still outstanding</option>{releaseApprovers.map((name) => <option key={name}>{name}</option>)}</select></label>
        <label>Approved at<input name="approvedAt" defaultValue={state.asOf} /></label>
        <label>Staging evidence<input name="stagingEvidence" /></label>
        <label className="p011-check">Emergency hotfix<input name="emergency" type="checkbox" /></label>
        <label>Retrospective note<input name="retrospectiveNote" /></label>
        <GithubFields asOf={state.asOf} />
        <label>Observer<input name="observer" /></label>
        <button className="p011-primary" type="submit">Record the pasted release note</button>
      </form> : null}
    </section>
    <section className="p011-block" aria-label="Requests">
      <h2>Requests</h2>
      {state.requests.map((request) => {
        const reading = deliveryStatus(request, state.asOf)
        return <article key={request.id} data-request-id={request.id} data-production={reading.production} data-jira-freshness={reading.jira.freshness}>
          <h3>{request.problem}</h3>
          <p className="p011-status">{reading.statement}</p>
          <p>{workItemLabels[request.type]} · {request.productName}</p>
          <p>Original wording: {request.originalWording}</p>
          {request.acceptanceCriteria.length ? <ul>{request.acceptanceCriteria.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No observable acceptance criterion yet.</p>}
          <ul>{request.jira.map((item, index) => <li key={`${item.key}-${item.observedAt}`}>{index === request.jira.length - 1 ? 'Current Jira observation' : 'Earlier Jira observation'}: {item.key} · {jiraStatusLabels[item.observedStatus]} · {item.observedAt}. {item.evidenceNote}</li>)}</ul>
          <ul>{request.github.map((item) => <li key={`${item.key}-${item.observedAt}`}>GitHub observation: {item.key} · {item.observedStatus}. {item.evidenceNote}</li>)}</ul>
        </article>
      })}
    </section>
    <section className="p011-block" aria-label="Not done here">
      <h2>Not done here</h2>
      <p>Publishing, deploys, new Jira issues and new pull requests stay refused.</p>
      <div className="p011-refused">
        <button className="p011-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'publish-site' }))}>Publish the public site</button>
        <button className="p011-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'deploy' }))}>Deploy</button>
        <button className="p011-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'create-jira' }))}>Create a Jira issue</button>
        <button className="p011-quiet" type="button" onClick={() => setState(applyDeskAction(state, { type: 'open-pull-request' }))}>Open a pull request</button>
      </div>
    </section>
  </section>
}

function GithubFields({ asOf }: { asOf: string }) {
  const [kind, setKind] = useState<GithubKind>('pull_request')
  const statuses = githubStatuses[kind]
  return <>
    <label>GitHub reference<input name="githubReference" placeholder="Digikraal/digikraal-deftsoft#241" /></label>
    <label>GitHub record<select name="githubKind" value={kind} onChange={(event) => setKind(event.target.value as GithubKind)}><option value="pull_request">Pull request</option><option value="commit">Commit</option><option value="branch">Branch</option></select></label>
    <label>GitHub status<select name="githubStatus" key={kind} defaultValue={statuses[0]}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
    <label>GitHub observed at<input name="githubObservedAt" defaultValue={asOf} /></label>
  </>
}

function value(data: FormData, name: string): string {
  return String(data.get(name) ?? '')
}
