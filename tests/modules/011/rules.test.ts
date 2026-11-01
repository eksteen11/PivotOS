import assert from 'node:assert/strict'
import { test } from 'node:test'
import { EXAMPLE_AS_OF, FRESHNESS_HOURS, MODULE_011_INTEGRATION, module011Integrations } from '../../../lib/modules/011/contract'
import { applyDeskAction, exampleDeskState, nextMove, visibleToCompany } from '../../../lib/modules/011/desk'
import { assessFreshness, githubProvesProduction, parseGithubReference, parseJiraKey } from '../../../lib/modules/011/links'
import { attachRelease, captureRequest, deliveryStatus, linkGithub, linkJira, roadmapIsReleasePromise, type ProductRequest } from '../../../lib/modules/011/request'

const asOf = EXAMPLE_AS_OF
const fresh = asOf
const exactWindow = '2026-10-18T12:00:00.000Z'
const justStale = '2026-10-18T11:59:59.000Z'

function request(overrides: Partial<Parameters<typeof captureRequest>[0]> = {}): ProductRequest {
  const captured = captureRequest({
    id: 'req-1',
    productName: 'DigiKraal marketplace',
    type: 'defect',
    problem: 'The shared listing image is missing.',
    desiredOutcome: 'The share shows the current listing image.',
    acceptanceCriteria: ['the shared link opens the correct listing'],
    originalWording: '  The share image is missing.  ',
    reporter: 'Drikus',
    capturedAt: asOf,
    ...overrides,
  })
  if (!captured.ok) throw new Error(captured.error)
  return captured.request
}

function withJira(item: ProductRequest, status: string, observedAt = fresh, key = 'MRK-300'): ProductRequest {
  const linked = linkJira(item, { key, observedStatus: status, observedAt, evidenceNote: 'Pasted from the MRK board.', observer: 'Drikus' }, asOf)
  if (!linked.ok) throw new Error(linked.error)
  return linked.request
}

test('a request without a linked source has unavailable delivery', () => {
  const item = request()
  assert.equal(item.originalWording, '  The share image is missing.  ')
  const delivery = deliveryStatus(item, asOf)
  assert.equal(delivery.production, 'unavailable')
  assert.equal(delivery.executed, false)
  assert.equal(delivery.publishesSite, false)
  assert.equal(delivery.jira.freshness, 'unlinked')
  assert.equal(delivery.integration.jira, 'not_connected')
  assert.equal(delivery.integration.github, 'not_connected')
  assert.match(delivery.statement, /unavailable/)
  assert.match(delivery.statement, /Nothing has been deployed or published/)
})

test('linked sources go stale on the freshness window and undated times are not current', () => {
  assert.equal(FRESHNESS_HOURS, 168)
  assert.equal(assessFreshness(exactWindow, asOf).freshness, 'fresh')
  assert.equal(assessFreshness(exactWindow, asOf).usableAsCurrent, true)
  assert.equal(assessFreshness(justStale, asOf).freshness, 'stale')
  assert.equal(assessFreshness(justStale, asOf).usableAsCurrent, false)
  assert.equal(assessFreshness(null, asOf).freshness, 'undated')
  assert.equal(assessFreshness('2026-10-25', asOf).freshness, 'undated')
  assert.equal(assessFreshness('2026-10-25T12:00:01.000Z', asOf).freshness, 'undated')
  const stale = withJira(request(), 'staging', justStale)
  const delivery = deliveryStatus(stale, asOf)
  assert.equal(delivery.jira.freshness, 'stale')
  assert.equal(delivery.production, 'unavailable')
  assert.match(delivery.statement, /not current delivery status/)
  const staleDone = withJira(request(), 'done', justStale)
  assert.equal(deliveryStatus(staleDone, asOf).production, 'unsupported')
  assert.match(deliveryStatus(staleDone, asOf).statement, /not a delivery/)
})

test('Jira and GitHub ownership stay on the real records', () => {
  const item = request()
  const wrongJira = linkJira(item, { key: 'WEB-9', observedStatus: 'done', observedAt: fresh, evidenceNote: 'Pasted from another board.', observer: 'Drikus' }, asOf)
  assert.equal(wrongJira.ok, false)
  if (wrongJira.ok) return
  assert.match(wrongJira.error, /MRK/)
  assert.equal(item.jira.length, 0)
  const wrongRepo = parseGithubReference('https://github.com/Other/widget/pull/4', 'pull_request')
  assert.equal(wrongRepo.ok, false)
  const pull = parseGithubReference('https://github.com/Digikraal/digikraal-deftsoft/pull/241', 'pull_request')
  if (!pull.ok) throw new Error(pull.error)
  assert.equal(pull.ref.key, 'Digikraal/digikraal-deftsoft#241')
  const commit = parseGithubReference('Digikraal/digikraal-deftsoft@abcdef1', 'commit')
  if (!commit.ok) throw new Error(commit.error)
  assert.equal(commit.ref.key, 'Digikraal/digikraal-deftsoft@abcdef1')
  const parsedKey = parseJiraKey('mrk-241')
  if (!parsedKey.ok) throw new Error(parsedKey.error)
  assert.equal(parsedKey.key, 'MRK-241')
  const unknown = linkJira(item, { key: 'MRK-241', observedStatus: 'shipped', observedAt: fresh, evidenceNote: 'Someone said shipped.', observer: 'Drikus' }, asOf)
  assert.equal(unknown.ok, false)
  if (unknown.ok) return
  assert.match(unknown.error, /not recorded as delivered/)
  assert.equal(githubProvesProduction(), false)
  assert.equal(roadmapIsReleasePromise(), false)
})

test('a pasted production status is not a deployment without approval and a GitHub record', () => {
  const done = withJira(request(), 'done')
  const missing = deliveryStatus(done, asOf)
  assert.equal(missing.production, 'unsupported')
  assert.equal(missing.executed, false)
  assert.match(missing.statement, /not treated as delivered/)
  const ryan = attachRelease(done, releaseInput({ approver: 'Ryan' }), asOf)
  assert.equal(ryan.ok, false)
  if (ryan.ok) return
  assert.match(ryan.error, /Ryan can deploy/)
  assert.equal(done.github.length, 0)
  const branch = attachRelease(done, releaseInput({ githubKind: 'branch', githubReference: 'Digikraal/digikraal-deftsoft:main', githubStatus: 'named' }), asOf)
  assert.equal(branch.ok, false)
  if (branch.ok) return
  assert.match(branch.error, /not a release record/)
  const waiting = withJira(request(), 'ready_for_production')
  assert.equal(deliveryStatus(waiting, asOf).production, 'not_claimed')
  assert.match(deliveryStatus(waiting, asOf).statement, /not a deployment/)
  const noted = attachRelease(done, releaseInput({}), asOf)
  assert.equal(noted.ok, true)
  if (!noted.ok) return
  const reported = deliveryStatus(noted.request, asOf)
  assert.equal(reported.production, 'reported_from_pasted_sources')
  assert.equal(reported.executed, false)
  assert.equal(reported.publishesSite, false)
  assert.equal(reported.provesProductionFromGithub, false)
  assert.equal(reported.integration, module011Integrations)
  assert.match(reported.statement, /did not deploy/)
  assert.match(reported.statement, /was not published/)
  assert.match(reported.statement, /Drikus/)
})

test('an emergency note still waits for Drikus, Conrad or Emma', () => {
  const done = withJira(request(), 'done')
  const pending = attachRelease(done, releaseInput({ approver: '', emergency: true, retrospectiveNote: 'Hotfix was committed before approval.', stagingEvidence: '' }), asOf)
  assert.equal(pending.ok, true)
  if (!pending.ok) return
  const delivery = deliveryStatus(pending.request, asOf)
  assert.equal(delivery.production, 'reported_pending_approval')
  assert.match(delivery.statement, /still missing/)
  assert.match(delivery.statement, /did not deploy/)
})

test('the example desk shows stale Jira and refuses publication', () => {
  const state = exampleDeskState()
  assert.equal(state.example, true)
  assert.equal(state.executed, false)
  assert.equal(state.separateApp, false)
  assert.equal(nextMove(state).title, 'Linked source is stale')
  assert.equal(nextMove(state).requestId, '011-example-recent-media')
  assert.equal(deliveryStatus(state.requests[1], state.asOf).jira.key, 'MRK-241')
  assert.equal(visibleToCompany(state, 'digikraal'), state)
  assert.equal(visibleToCompany(state, 'farm-feed'), null)
  assert.equal(visibleToCompany(state, 'northpoint'), null)
  assert.equal(visibleToCompany(state, 'personal'), null)
  assert.equal(visibleToCompany({ ...state, separateApp: true }, 'digikraal'), null)
  const published = applyDeskAction(state, { type: 'publish-site' })
  const deployed = applyDeskAction(state, { type: 'deploy' })
  const created = applyDeskAction(state, { type: 'create-jira' })
  const opened = applyDeskAction(state, { type: 'open-pull-request' })
  assert.equal(published.requests, state.requests)
  assert.equal(deployed.requests, state.requests)
  assert.equal(created.requests, state.requests)
  assert.equal(opened.requests, state.requests)
  assert.match(published.alert, /did not publish/)
  assert.match(deployed.alert, /did not deploy/)
  assert.match(created.alert, /did not create/)
  assert.match(opened.alert, /did not open/)
  for (const next of [published, deployed, created, opened]) {
    assert.equal(next.executed, false)
    assert.equal(next.integrations.jira, 'not_connected')
    assert.equal(next.integrations.publicSite, 'not_published_from_pivot')
  }
  const staleDone = { ...state, requests: [withJira(request({ id: 'stale-done' }), 'done', justStale)] }
  assert.equal(nextMove(staleDone).action, 'link-jira')
  assert.equal(MODULE_011_INTEGRATION.separateApp, false)
  assert.equal(MODULE_011_INTEGRATION.company, 'digikraal')
  assert.deepEqual(MODULE_011_INTEGRATION.ownedPaths, ['lib/modules/011/', 'components/modules/011/', 'tests/modules/011/', 'plan/CURSOR_MODULE_011_STATUS.md'])
})

test('a newer pasted observation replaces current status without becoming a live read', () => {
  const state = exampleDeskState()
  const refreshed = applyDeskAction(state, { type: 'link-jira', requestId: '011-example-recent-media', key: 'mrk-241', observedStatus: 'staging', observedAt: fresh, evidenceNote: 'Checked the MRK board again.', observer: 'Drikus' })
  assert.equal(refreshed.alert, '')
  const delivery = deliveryStatus(refreshed.requests[1], refreshed.asOf)
  assert.equal(delivery.jira.freshness, 'fresh')
  assert.equal(delivery.production, 'not_claimed')
  assert.match(delivery.statement, /not a live read/)
  assert.match(delivery.statement, /did not deploy/)
  assert.equal(refreshed.requests[1].jira.length, 2)
  assert.equal(refreshed.requests[1].originalWording, state.requests[1].originalWording)
  const older = applyDeskAction(refreshed, { type: 'link-jira', requestId: '011-example-recent-media', key: 'MRK-241', observedStatus: 'done', observedAt: justStale, evidenceNote: 'Trying to backdate done.', observer: 'Drikus' })
  assert.match(older.alert, /not newer/)
  assert.equal(older.requests, refreshed.requests)
  const duplicate = applyDeskAction(refreshed, { type: 'link-jira', requestId: '011-example-share-preview', key: 'MRK-241', observedStatus: 'captured', observedAt: fresh, evidenceNote: 'Same key on another request.', observer: 'Drikus' })
  assert.match(duplicate.alert, /already linked/)
})

test('a branch observation is kept as code history and is not production', () => {
  const linked = linkGithub(withJira(request(), 'staging'), { reference: 'Digikraal/digikraal-deftsoft:staging', recordKind: 'branch', observedStatus: 'named', observedAt: fresh, evidenceNote: 'Branch name seen in GitHub.', observer: 'Ryan' }, asOf)
  assert.equal(linked.ok, true)
  if (!linked.ok) return
  const delivery = deliveryStatus(linked.request, asOf)
  assert.equal(delivery.production, 'not_claimed')
  assert.match(delivery.github.statement, /do not prove that staging and production are separate/)
})

function releaseInput(overrides: Partial<Parameters<typeof attachRelease>[1]> = {}): Parameters<typeof attachRelease>[1] {
  return {
    version: '1.2.0',
    approver: 'Drikus',
    approvedAt: fresh,
    stagingEvidence: 'Checked the share preview on staging.',
    emergency: false,
    retrospectiveNote: '',
    githubReference: 'Digikraal/digikraal-deftsoft#300',
    githubKind: 'pull_request',
    githubStatus: 'merged',
    githubObservedAt: fresh,
    observer: 'Drikus',
    ...overrides,
  }
}
