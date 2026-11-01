import type { Company } from '../../workspace/catalogue'
import { EXAMPLE_AS_OF, MODULE_011_INTEGRATION, PUBLIC_SITE, module011Integrations } from './contract'
import { addAcceptance, attachRelease, captureReadiness, captureRequest, deliveryStatus, latestJira, linkGithub, linkJira, type ProductRequest } from './request'

export type DeskState = {
  example: boolean
  asOf: string
  productName: string
  publicSite: typeof PUBLIC_SITE
  requests: ProductRequest[]
  message: string
  alert: string
  executed: false
  separateApp: boolean
  integrations: typeof module011Integrations
}

export type NextMove = {
  action: 'capture' | 'clarify' | 'link-jira' | 'link-github' | 'release-note' | 'review'
  title: string
  detail: string
  requestId: string | null
}

export type DeskAction =
  | { type: 'capture'; productName: string; workType: string; problem: string; desiredOutcome: string; acceptance: string; originalWording: string; reporter: string; capturedAt: string }
  | { type: 'add-acceptance'; requestId: string; criterion: string; desiredOutcome: string }
  | { type: 'link-jira'; requestId: string; key: string; observedStatus: string; observedAt: string; evidenceNote: string; observer: string }
  | { type: 'link-github'; requestId: string; reference: string; recordKind: string; observedStatus: string; observedAt: string; evidenceNote: string; observer: string }
  | { type: 'record-release'; requestId: string; version: string; approver: string; approvedAt: string; stagingEvidence: string; emergency: boolean; retrospectiveNote: string; githubReference: string; githubKind: string; githubStatus: string; githubObservedAt: string; observer: string }
  | { type: 'publish-site' }
  | { type: 'deploy' }
  | { type: 'create-jira' }
  | { type: 'open-pull-request' }

const refusedCopy = {
  'publish-site': `Pivot did not publish ${PUBLIC_SITE}. The public site stays outside this module.`,
  deploy: 'Pivot did not deploy. A pasted status is not a deployment, and GitHub remains the source for the code.',
  'create-jira': 'Jira is not connected. Pivot did not create an issue. Delivery records stay in Jira.',
  'open-pull-request': 'Pivot did not open a pull request. Code records stay on GitHub.',
} as const

export function refusedAction(kind: keyof typeof refusedCopy): string {
  return refusedCopy[kind]
}

export function exampleDeskState(): DeskState {
  const share = captureRequest({
    id: '011-example-share-preview',
    productName: 'DigiKraal marketplace',
    type: 'defect',
    problem: 'Example only. A shared listing preview is missing its image.',
    desiredOutcome: 'A shared listing shows its current image.',
    acceptanceCriteria: [],
    originalWording: 'Example: the share preview has no image.',
    reporter: 'Example reporter',
    capturedAt: EXAMPLE_AS_OF,
    company: 'digikraal',
  })
  const recent = captureRequest({
    id: '011-example-recent-media',
    productName: 'DigiKraal marketplace',
    type: 'defect',
    problem: 'Example only. Recently viewed media is out of date.',
    desiredOutcome: 'The recent media matches the listing the customer opened.',
    acceptanceCriteria: ['the recent media shows the listing the customer opened'],
    originalWording: 'Example: recently viewed media looks old.',
    reporter: 'Example reporter',
    capturedAt: '2026-10-01T12:00:00.000Z',
  })
  if (!share.ok || !recent.ok) throw new Error('Example requests could not be built.')
  const linked = linkJira(recent.request, { key: 'mrk-241', observedStatus: 'staging', observedAt: '2026-10-01T12:00:00.000Z', evidenceNote: 'Example pasted from a Jira board.', observer: 'Example reviewer' }, EXAMPLE_AS_OF)
  if (!linked.ok) throw new Error(linked.error)
  return {
    example: true,
    asOf: EXAMPLE_AS_OF,
    productName: 'DigiKraal marketplace',
    publicSite: PUBLIC_SITE,
    requests: [share.request, linked.request],
    message: 'MRK-241 was pasted earlier and is no longer current.',
    alert: '',
    executed: false,
    separateApp: false,
    integrations: module011Integrations,
  }
}

export function visibleToCompany(state: DeskState, company: Company): DeskState | null {
  if (company !== 'digikraal') return null
  if (state.separateApp) return null
  if (state.requests.some((item) => item.company !== 'digikraal' || item.moduleId !== '011')) return null
  return state
}

export function nextMove(state: DeskState): NextMove {
  if (state.requests.length === 0) return { action: 'capture', title: 'Capture the product problem', detail: 'Record the problem and the original wording. This does not create a Jira issue.', requestId: null }
  const readings = state.requests.map((request) => ({ request, delivery: deliveryStatus(request, state.asOf) }))
  const staleJira = readings.find((item) => item.delivery.jira.freshness === 'stale' || item.delivery.jira.freshness === 'undated')
  if (staleJira) return { action: 'link-jira', requestId: staleJira.request.id, title: 'Linked source is stale', detail: `${staleJira.delivery.jira.statement} Paste a newer Jira observation if you have one. Pivot cannot read Jira.` }
  const staleGithub = readings.find((item) => item.delivery.github.freshness === 'stale' || item.delivery.github.freshness === 'undated')
  if (staleGithub) return { action: 'link-github', requestId: staleGithub.request.id, title: 'GitHub source is stale', detail: `${staleGithub.delivery.github.statement} Paste a newer GitHub observation if you have one. Pivot cannot read GitHub.` }
  const unsupported = readings.find((item) => item.delivery.production === 'unsupported' || item.delivery.production === 'reported_pending_approval')
  if (unsupported) return { action: 'release-note', requestId: unsupported.request.id, title: 'Production is not confirmed', detail: unsupported.delivery.statement }
  const clarify = state.requests.find((item) => captureReadiness(item) === 'needs_clarification')
  if (clarify) return { action: 'clarify', requestId: clarify.id, title: 'Acceptance is still unclear', detail: 'Add an observable result. Development is not started from this desk.' }
  const unlinked = readings.find((item) => item.delivery.jira.freshness === 'unlinked')
  if (unlinked) return { action: 'link-jira', requestId: unlinked.request.id, title: 'Jira record is still missing', detail: 'Paste the MRK key when it exists. Pivot will not create the Jira issue.' }
  return { action: 'review', requestId: readings[0]?.request.id ?? null, title: 'Review pasted status', detail: 'Nothing is published from this desk.' }
}

export function applyDeskAction(state: DeskState, action: DeskAction): DeskState {
  if (action.type === 'publish-site' || action.type === 'deploy' || action.type === 'create-jira' || action.type === 'open-pull-request') return refuse(state, refusedCopy[action.type])
  if (action.type === 'capture') {
    const captured = captureRequest({ id: `011-request-${state.requests.length + 1}`, productName: action.productName, type: action.workType, problem: action.problem, desiredOutcome: action.desiredOutcome, acceptanceCriteria: action.acceptance ? [action.acceptance] : [], originalWording: action.originalWording, reporter: action.reporter, capturedAt: action.capturedAt, company: 'digikraal' })
    if (!captured.ok) return refuse(state, captured.error)
    return done(state, [captured.request, ...state.requests], 'Problem captured in Pivot. No Jira issue was created.')
  }
  const current = state.requests.find((item) => item.id === action.requestId)
  if (!current) return refuse(state, 'That request is not on this desk.')
  if (action.type === 'add-acceptance') {
    const added = addAcceptance(current, action.criterion)
    if (!added.ok) return refuse(state, added.error)
    const desiredOutcome = action.desiredOutcome.trim() || current.desiredOutcome
    if (!desiredOutcome) return refuse(state, 'Describe the desired outcome. Nothing was added.')
    return done(state, replace(state, { ...added.request, desiredOutcome }), 'Acceptance criterion added. Development was not started.')
  }
  if (action.type === 'link-jira') {
    if (state.requests.some((item) => item.id !== current.id && item.jira.some((link) => link.key === action.key.trim().toUpperCase()))) return refuse(state, 'That MRK key is already linked. Duplicate roadmap entries should point at one delivery record.')
    const linked = linkJira(current, action, state.asOf)
    if (!linked.ok) return refuse(state, linked.error)
    return done(state, replace(state, linked.request), deliveryStatus(linked.request, state.asOf).statement)
  }
  if (action.type === 'link-github') {
    const linked = linkGithub(current, action, state.asOf)
    if (!linked.ok) return refuse(state, linked.error)
    return done(state, replace(state, linked.request), deliveryStatus(linked.request, state.asOf).statement)
  }
  const released = attachRelease(current, action, state.asOf)
  if (!released.ok) return refuse(state, released.error)
  return done(state, replace(state, released.request), deliveryStatus(released.request, state.asOf).statement)
}

export { MODULE_011_INTEGRATION }

function refuse(state: DeskState, alert: string): DeskState {
  return { ...state, alert, executed: false, separateApp: false, integrations: module011Integrations }
}

function done(state: DeskState, requests: ProductRequest[], message: string): DeskState {
  return { ...state, requests, message, alert: '', executed: false, separateApp: false, integrations: module011Integrations }
}

function replace(state: DeskState, request: ProductRequest): ProductRequest[] {
  return state.requests.map((item) => item.id === request.id ? request : item)
}

export function focusedRequest(state: DeskState): ProductRequest | null {
  const id = nextMove(state).requestId
  return state.requests.find((item) => item.id === id) ?? null
}

export function currentJiraKey(request: ProductRequest | null): string {
  return request ? latestJira(request)?.key ?? '' : ''
}
