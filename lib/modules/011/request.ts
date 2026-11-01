import { GITHUB_REPOSITORY, MODULE_011_COMPANY, MODULE_011_ID, PUBLIC_SITE, jiraStatusLabels, module011Integrations, productionLookingStatuses, releaseApprovers, workItemTypes, type GithubKind, type GithubStatus, type JiraStatus, type ReleaseApprover, type WorkItemType } from './contract'
import { assessFreshness, confluenceStatement, githubProductionStatement, githubProvesProduction, isGithubStatus, isJiraStatus, parseGithubReference, parseJiraKey, parseTimestamp, type Freshness } from './links'

export type JiraObservation = {
  system: 'jira'
  key: string
  observedStatus: JiraStatus
  observedAt: string
  evidenceNote: string
  observer: string
  kind: 'pasted_observation'
}

export type GithubObservation = {
  system: 'github'
  repository: typeof GITHUB_REPOSITORY
  recordKind: GithubKind
  key: string
  observedStatus: GithubStatus
  observedAt: string
  evidenceNote: string
  observer: string
  kind: 'pasted_observation'
}

export type ReleaseNote = {
  version: string
  approver: ReleaseApprover | null
  approvedAt: string | null
  stagingEvidence: string
  jiraKeys: string[]
  emergency: boolean
  retrospectiveNote: string
}

export type ProductRequest = {
  id: string
  company: typeof MODULE_011_COMPANY
  moduleId: typeof MODULE_011_ID
  productName: string
  type: WorkItemType
  problem: string
  desiredOutcome: string
  acceptanceCriteria: string[]
  originalWording: string
  reporter: string
  capturedAt: string
  jira: JiraObservation[]
  github: GithubObservation[]
  release: ReleaseNote | null
}

export type CaptureInput = {
  id: string
  productName: string
  type: string
  problem: string
  desiredOutcome: string
  acceptanceCriteria: string[]
  originalWording: string
  reporter: string
  capturedAt: string
  company?: string
}

const vagueCriterion = /^(improve( it)?|make it better|fix( it)?|tbd|todo|as discussed|looks good)\.?$/i

export function criterionIsObservable(text: string): boolean {
  const trimmed = text.trim()
  return trimmed.length >= 12 && !vagueCriterion.test(trimmed)
}

export function roadmapIsReleasePromise(): false {
  return false
}

export function captureRequest(input: CaptureInput): { ok: true; request: ProductRequest } | { ok: false; error: string } {
  if (input.company && input.company !== MODULE_011_COMPANY) return { ok: false, error: 'Digital product requests stay on DigiKraal.' }
  if (!input.id.trim()) return { ok: false, error: 'A request needs an id.' }
  if (!input.productName.trim()) return { ok: false, error: 'Name the product or website.' }
  if (!(workItemTypes as readonly string[]).includes(input.type)) return { ok: false, error: 'Choose a work-item type.' }
  if (input.problem.trim().length < 8) return { ok: false, error: 'Describe the problem.' }
  if (!input.originalWording.trim()) return { ok: false, error: 'Keep the original wording.' }
  if (!input.reporter.trim()) return { ok: false, error: 'Name the reporter.' }
  if (!parseTimestamp(input.capturedAt)) return { ok: false, error: 'The captured time is not valid.' }
  const acceptanceCriteria = input.acceptanceCriteria.map((item) => item.trim()).filter(Boolean)
  if (acceptanceCriteria.some((item) => !criterionIsObservable(item))) return { ok: false, error: 'Acceptance criteria need an observable result.' }
  return {
    ok: true,
    request: {
      id: input.id.trim(),
      company: MODULE_011_COMPANY,
      moduleId: MODULE_011_ID,
      productName: input.productName.trim(),
      type: input.type as WorkItemType,
      problem: input.problem.trim(),
      desiredOutcome: input.desiredOutcome.trim(),
      acceptanceCriteria,
      originalWording: input.originalWording,
      reporter: input.reporter.trim(),
      capturedAt: input.capturedAt,
      jira: [],
      github: [],
      release: null,
    },
  }
}

export type CaptureReadiness = 'needs_clarification' | 'ready_to_link'

export function captureReadiness(request: ProductRequest): CaptureReadiness {
  if (!request.desiredOutcome.trim() || !request.acceptanceCriteria.some(criterionIsObservable)) return 'needs_clarification'
  return 'ready_to_link'
}

export function latestJira(request: ProductRequest): JiraObservation | null {
  return request.jira.at(-1) ?? null
}

export function latestGithub(request: ProductRequest): GithubObservation | null {
  return request.github.at(-1) ?? null
}

export function addAcceptance(request: ProductRequest, criterion: string): { ok: true; request: ProductRequest } | { ok: false; error: string } {
  if (!criterionIsObservable(criterion)) return { ok: false, error: 'Acceptance criteria need an observable result. Nothing was added.' }
  return { ok: true, request: { ...request, acceptanceCriteria: [...request.acceptanceCriteria, criterion.trim()] } }
}

export function linkJira(request: ProductRequest, input: { key: string; observedStatus: string; observedAt: string; evidenceNote: string; observer: string }, asOf: string): { ok: true; request: ProductRequest } | { ok: false; error: string } {
  const key = parseJiraKey(input.key)
  if (!key.ok) return key
  if (!isJiraStatus(input.observedStatus)) return { ok: false, error: 'That status is not a recognised Jira lifecycle state. It was not recorded as delivered.' }
  const timed = evidenceTime(input.observedAt, asOf, input.evidenceNote, input.observer)
  if (!timed.ok) return timed
  const previous = latestJira(request)
  if (previous && previous.key !== key.key) return { ok: false, error: 'This request already follows another MRK key. A second delivery record was not created.' }
  if (previous && timed.observedMs <= timed.previousMs(previous.observedAt)) return { ok: false, error: 'That observation is not newer than the one already linked. It was not recorded as current.' }
  const observation: JiraObservation = { system: 'jira', key: key.key, observedStatus: input.observedStatus, observedAt: input.observedAt, evidenceNote: input.evidenceNote.trim(), observer: input.observer.trim(), kind: 'pasted_observation' }
  return { ok: true, request: { ...request, jira: [...request.jira, observation] } }
}

export function linkGithub(request: ProductRequest, input: { reference: string; recordKind: string; observedStatus: string; observedAt: string; evidenceNote: string; observer: string }, asOf: string): { ok: true; request: ProductRequest } | { ok: false; error: string } {
  const ref = parseGithubReference(input.reference, input.recordKind)
  if (!ref.ok) return ref
  if (!isGithubStatus(ref.ref.kind, input.observedStatus)) return { ok: false, error: 'That status does not belong to this GitHub record. Nothing was recorded.' }
  const timed = evidenceTime(input.observedAt, asOf, input.evidenceNote, input.observer)
  if (!timed.ok) return timed
  const previous = latestGithub(request)
  if (previous && timed.observedMs <= timed.previousMs(previous.observedAt)) return { ok: false, error: 'That GitHub observation is not newer than the one already linked. It was not recorded as current.' }
  const observation: GithubObservation = { system: 'github', repository: GITHUB_REPOSITORY, recordKind: ref.ref.kind, key: ref.ref.key, observedStatus: input.observedStatus, observedAt: input.observedAt, evidenceNote: input.evidenceNote.trim(), observer: input.observer.trim(), kind: 'pasted_observation' }
  return { ok: true, request: { ...request, github: [...request.github, observation] } }
}

export type ReleaseInput = {
  version: string
  approver: string
  approvedAt: string
  stagingEvidence: string
  emergency: boolean
  retrospectiveNote: string
  githubReference: string
  githubKind: string
  githubStatus: string
  githubObservedAt: string
  observer: string
}

export function attachRelease(request: ProductRequest, input: ReleaseInput, asOf: string): { ok: true; request: ProductRequest } | { ok: false; error: string } {
  const current = latestJira(request)
  if (!current || !(productionLookingStatuses as readonly string[]).includes(current.observedStatus)) {
    return { ok: false, error: 'A release note is only recorded against a pasted production status. Nothing was marked delivered.' }
  }
  if (!assessFreshness(current.observedAt, asOf).usableAsCurrent) {
    return { ok: false, error: 'Refresh the Jira observation before recording an approval. Nothing was marked delivered.' }
  }
  const approver = readApprover(input.approver)
  if (!approver.ok) return approver
  if (!input.version.trim()) return { ok: false, error: 'Name the release or version. Nothing was marked delivered.' }
  if (!approver.approver && !input.emergency) return { ok: false, error: 'Name Drikus, Conrad or Emma before a production status can be reported. Nothing was marked delivered.' }
  if (!approver.approver && input.emergency && input.retrospectiveNote.trim().length < 8) {
    return { ok: false, error: 'An emergency change needs an immediate retrospective note. Nothing was marked delivered.' }
  }
  if (approver.approver) {
    if (!parseTimestamp(input.approvedAt) || parseTimestamp(input.approvedAt)! > parseTimestamp(asOf)!) return { ok: false, error: 'The approval time is not valid. Nothing was marked delivered.' }
    if (input.stagingEvidence.trim().length < 8) return { ok: false, error: 'Staging evidence is required before a production status can be reported. Nothing was marked delivered.' }
  }
  const seen = input.stagingEvidence.trim() || input.retrospectiveNote.trim()
  const linked = linkGithub(request, { reference: input.githubReference, recordKind: input.githubKind, observedStatus: input.githubStatus, observedAt: input.githubObservedAt, evidenceNote: seen, observer: input.observer }, asOf)
  if (!linked.ok) return linked
  const github = latestGithub(linked.request)
  if (!github || github.recordKind === 'branch') return { ok: false, error: 'A branch name is not a release record. Main and staging do not prove the environments are separate. Nothing was marked delivered.' }
  const note: ReleaseNote = {
    version: input.version.trim(),
    approver: approver.approver,
    approvedAt: approver.approver ? input.approvedAt : null,
    stagingEvidence: input.stagingEvidence.trim(),
    jiraKeys: [current.key],
    emergency: input.emergency,
    retrospectiveNote: input.retrospectiveNote.trim(),
  }
  return { ok: true, request: { ...linked.request, release: note } }
}

export type LinkReading = {
  system: 'jira' | 'github'
  connection: 'not_connected'
  record: 'none' | 'pasted_observation'
  freshness: Freshness
  observedStatus: string | null
  key: string | null
  usableAsCurrent: boolean
  statement: string
}

export type ProductionReading = 'unavailable' | 'not_claimed' | 'unsupported' | 'reported_pending_approval' | 'reported_from_pasted_sources'

export type DeliveryReading = {
  integration: typeof module011Integrations
  jira: LinkReading
  github: LinkReading
  production: ProductionReading
  publishesSite: false
  executed: false
  provesProductionFromGithub: false
  statement: string
}

export function deliveryStatus(request: ProductRequest, asOf: string): DeliveryReading {
  const jira = readJira(request, asOf)
  const github = readGithub(request, asOf)
  const base = { integration: module011Integrations, jira, github, publishesSite: false as const, executed: false as const, provesProductionFromGithub: githubProvesProduction() }
  const current = latestJira(request)
  if (!current) return { ...base, production: 'unavailable', statement: 'Delivery status is unavailable until a real MRK record is linked. Nothing has been deployed or published from Pivot.' }
  if (!jira.usableAsCurrent) {
    const lookedDone = (productionLookingStatuses as readonly string[]).includes(current.observedStatus)
    return { ...base, production: lookedDone ? 'unsupported' : 'unavailable', statement: lookedDone ? `${jira.statement} A stale or undated production status is not a delivery.` : jira.statement }
  }
  if (!(productionLookingStatuses as readonly string[]).includes(current.observedStatus)) {
    const waiting = current.observedStatus === 'ready_for_production'
    return { ...base, production: 'not_claimed', statement: waiting ? `${jira.statement} Ready for production is not a deployment. ${PUBLIC_SITE} was not published from Pivot.` : `${jira.statement} This is not a production outcome. Pivot did not deploy it.` }
  }
  const note = request.release
  const code = latestGithub(request)
  const githubSupports = Boolean(github.usableAsCurrent && code && code.recordKind !== 'branch')
  if (note?.emergency && note.retrospectiveNote.trim() && !note.approver && githubSupports) {
    return { ...base, production: 'reported_pending_approval', statement: 'An emergency note and a GitHub record were pasted. Retrospective approval from Drikus, Conrad or Emma is still missing. Pivot did not deploy this.' }
  }
  const approverOk = Boolean(note?.approver && note.approvedAt && parseTimestamp(note.approvedAt) && note.stagingEvidence.trim() && note.version.trim() && note.jiraKeys.includes(current.key))
  if (!approverOk || !githubSupports || !note?.approver || !code) {
    return { ...base, production: 'unsupported', statement: `A production status was pasted without a fresh GitHub record and an identifiable approval from Drikus, Conrad or Emma. It is not treated as delivered. ${githubProductionStatement}` }
  }
  const emergencyLine = note.emergency ? ' Retrospective approval was pasted.' : ''
  return { ...base, production: 'reported_from_pasted_sources', statement: `Pasted Jira ${current.key} and GitHub ${code.key} name ${note.approver} as approver.${emergencyLine} Pivot did not deploy this, and ${PUBLIC_SITE} was not published from here. ${githubProductionStatement}` }
}

export { confluenceStatement }

function readJira(request: ProductRequest, asOf: string): LinkReading {
  const current = latestJira(request)
  if (!current) return { system: 'jira', connection: 'not_connected', record: 'none', freshness: 'unlinked', observedStatus: null, key: null, usableAsCurrent: false, statement: 'No Jira record is linked. Jira is not connected, so delivery status is unavailable.' }
  const freshness = assessFreshness(current.observedAt, asOf)
  return { system: 'jira', connection: 'not_connected', record: 'pasted_observation', freshness: freshness.freshness, observedStatus: current.observedStatus, key: current.key, usableAsCurrent: freshness.usableAsCurrent, statement: `${current.key}: pasted status ${jiraStatusLabels[current.observedStatus]}. ${freshness.statement}` }
}

function readGithub(request: ProductRequest, asOf: string): LinkReading {
  const current = latestGithub(request)
  if (!current) return { system: 'github', connection: 'not_connected', record: 'none', freshness: 'unlinked', observedStatus: null, key: null, usableAsCurrent: false, statement: 'No GitHub record is linked. GitHub is not connected.' }
  const freshness = assessFreshness(current.observedAt, asOf)
  const branch = current.recordKind === 'branch' ? ` ${githubProductionStatement}` : ''
  return { system: 'github', connection: 'not_connected', record: 'pasted_observation', freshness: freshness.freshness, observedStatus: current.observedStatus, key: current.key, usableAsCurrent: freshness.usableAsCurrent, statement: `${current.key}: pasted ${current.observedStatus}.${branch} ${freshness.statement}` }
}

function readApprover(value: string): { ok: true; approver: ReleaseApprover | null } | { ok: false; error: string } {
  const name = value.trim()
  if (!name) return { ok: true, approver: null }
  if (name === 'Ryan') return { ok: false, error: 'Ryan can deploy, but only Drikus, Conrad or Emma can be recorded as a production approver. Nothing was marked delivered.' }
  if (!(releaseApprovers as readonly string[]).includes(name)) return { ok: false, error: 'Only Drikus, Conrad or Emma can be recorded as a production approver. Nothing was marked delivered.' }
  return { ok: true, approver: name as ReleaseApprover }
}

function evidenceTime(observedAt: string, asOf: string, evidenceNote: string, observer: string): { ok: true; observedMs: number; previousMs: (value: string) => number } | { ok: false; error: string } {
  const observedMs = parseTimestamp(observedAt)
  const asOfMs = parseTimestamp(asOf)
  if (observedMs === null || asOfMs === null) return { ok: false, error: 'The observation time is not valid. Nothing was recorded.' }
  if (observedMs > asOfMs) return { ok: false, error: 'The observation time is after the review time. Nothing was recorded.' }
  if (evidenceNote.trim().length < 8) return { ok: false, error: 'An observation needs a short note of what was seen. Nothing was recorded.' }
  if (observer.trim().length < 2) return { ok: false, error: 'Name the person who saw the record. Nothing was recorded.' }
  return { ok: true, observedMs, previousMs: (value: string) => parseTimestamp(value) ?? Number.POSITIVE_INFINITY }
}
