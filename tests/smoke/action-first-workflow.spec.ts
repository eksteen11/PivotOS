import { createServer, type Server } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'
import { applyWorkAction, validateWorkInput, type WorkCase } from '../../lib/workspace/model'
import { caseFromRow } from '../../lib/workspace/data'
import { emptyActionPlan } from '../../lib/workspace/actionPlan'

let server: Server
let base = ''
const rows = new Map<string, WorkCase>()
const rejectedIds = new Set<string>()
let revision = 0

test.beforeAll(async ({ browserName }, worker) => {
  const file = `test-results/action-first-${browserName}-${worker.workerIndex}.js`
  await esbuild.build({ entryPoints: ['tests/smoke/support/action-first-harness.tsx'], bundle: true, outfile: file, format: 'iife', platform: 'browser', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"development"' }, alias: { 'next/link': path.join(process.cwd(), 'tests/smoke/support/test-link.tsx') }, plugins: [{ name: 'at-alias', setup(build) {
    build.onResolve({ filter: /^@\// }, (args) => { const source = path.join(process.cwd(), args.path.slice(2)); return { path: ['.tsx', '.ts', '.jsx', '.js'].map((ext) => source + ext).find(existsSync) ?? source } })
  } }] })
  const script = readFileSync(file)
  const css = ['app/pivot.css', 'app/account.css', file.replace('.js', '.css')].map((file) => readFileSync(file, 'utf8')).join('\n')
  server = createServer(async (request, response) => {
    const json = (status: number, body: unknown) => { response.writeHead(status, { 'content-type': 'application/json' }); response.end(JSON.stringify(body)) }
    if (request.url === '/app.js') { response.setHeader('content-type', 'text/javascript'); response.end(script); return }
    if (request.url === '/records') { json(200, [...rows.values()]); return }
    if (request.url === '/api/work') {
      let raw = ''
      for await (const chunk of request) raw += chunk
      const body = JSON.parse(raw)
      if (request.method === 'POST' && String(body.notes).includes('[fail-first]') && !rejectedIds.has(body.id)) { rejectedIds.add(body.id); json(403, { error: 'Request origin is not allowed.' }); return }
      const now = new Date(Date.UTC(2026, 9, 25, 16, 0, revision++)).toISOString()
      let item: WorkCase
      if (request.method === 'POST') item = rows.get(body.id) ?? { ...validateWorkInput(body), id: body.id, entityId: 'test-owned-entity', status: 'planned', source: 'Manual capture', kind: 'work', updatedAt: now, checked: [], facts: {}, history: [], lessons: [] }
      else {
        const current = rows.get(body.id)
        if (!current || current.updatedAt !== body.updatedAt) { json(409, { error: 'This work changed in another window.' }); return }
        try { item = applyWorkAction(current, body, now) } catch (error) { json(400, { error: String(error) }); return }
      }
      // Exercise the same persisted JSON shape used by the real item API.
      const reloaded = caseFromRow({ id: item.id, entity_id: item.entityId, title: item.title, content: item.notes, status: item.status, updated_at: item.updatedAt, meta: { workspace_version: 1, pivot_case: item } })!
      rows.set(item.id, reloaded)
      json(200, { item: reloaded }); return
    }
    response.setHeader('content-type', 'text/html')
    response.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}button,input,select,textarea{font:inherit}button{cursor:pointer;background:none;border:0;color:inherit}a{color:inherit;text-decoration:none}h1,h2,h3,p{margin:0}${css}</style></head><body><div id="root"></div><script src="/app.js"></script></body></html>`)
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  base = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`
})
test.afterAll(async () => { if (server) await new Promise<void>((resolve) => server.close(() => resolve())) })
test.beforeEach(() => { rows.clear(); rejectedIds.clear() })

test('actions lead capture; failed save retains details; answers, approval and start survive reload separately', async ({ page }) => {
  test.setTimeout(120_000)
  await page.goto(base)
  await page.getByRole('button', { name: 'New work', exact: true }).click()
  await expect(page.getByLabel('Business', { exact: true })).toHaveCount(0)
  await page.getByLabel('Actions to complete · one per line', { exact: true }).fill('Confirm CP’s availability\nPrepare the visit brief')
  await page.getByRole('button', { name: 'Who is this for?', exact: true }).click()
  await page.getByLabel('Person, customer or project').fill('CP · Ceres visit')
  await expect(page.getByLabel('Business', { exact: true })).toHaveValue('')
  await page.getByLabel('Business', { exact: true }).selectOption('digikraal')
  await page.getByLabel('Division', { exact: true }).selectOption('005')
  await page.getByText('Add source context or notes', { exact: true }).click()
  await page.getByLabel('Context & notes', { exact: true }).fill('[fail-first] Preserve the seller’s original request.')
  await page.getByRole('button', { name: 'Build the plan', exact: true }).click()
  const ids: string[] = []
  page.on('request', (request) => { if (request.url().endsWith('/api/work') && request.method() === 'POST') ids.push(request.postDataJSON().id) })
  const save = page.getByRole('button', { name: 'Save action plan', exact: true })
  const bounds = await save.boundingBox()
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(page.viewportSize()!.height)
  await save.click()
  await expect(page.getByRole('alert')).toContainText('Your details are still here')
  await expect(page.getByRole('region', { name: 'Your action list' })).toContainText('Prepare the visit brief')
  await save.click()
  await expect(page.getByRole('heading', { name: 'Needs your answer', exact: true })).toBeVisible()
  expect(ids).toHaveLength(2)
  expect(ids[0]).toBe(ids[1])
  await expect(page.getByRole('button', { name: 'Approve this plan', exact: true })).toHaveCount(0)
  for (const [label, answer] of [
    ['Desired outcome', 'A confirmed and prepared visit'],
    ['Responsible person or agent', 'Drikus'],
    ['How will it be done?', 'Confirm availability then prepare the brief'],
    ['Tools or channels', 'Phone and saved documents'],
    ['Information or documents needed', 'Seller details'],
    ['Timing and dependencies', 'Next week after CP confirms availability'],
  ]) {
    await page.getByRole('button', { name: 'Answer this question', exact: true }).click()
    await page.getByLabel(label, { exact: true }).fill(answer)
    await page.getByRole('button', { name: 'Use this answer', exact: true }).click()
    await page.getByRole('button', { name: 'Save plan details', exact: true }).click()
    await expect(page.getByRole('tab', { name: 'Overview', exact: true })).toHaveAttribute('aria-selected', 'true')
  }
  await page.getByRole('button', { name: 'Approve this plan', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Ready to start', exact: true })).toBeVisible()
  await page.reload()
  await page.getByRole('button', { name: 'Confirm CP’s availability', exact: false }).click()
  await expect(page.getByRole('heading', { name: 'Ready to start', exact: true })).toBeVisible()
  await page.screenshot({ path: `test-results/action-plan-approved-${test.info().project.name}.png` })
  await page.getByRole('button', { name: 'Record work as started', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'In progress', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Record progress', exact: true }).click()
  await expect(page.getByRole('checkbox')).toHaveCount(2)
  await page.getByRole('checkbox').nth(0).click()
  await expect(page.getByRole('checkbox').nth(0)).toBeChecked()
  await expect(page.getByText('1 of 2 steps complete', { exact: true })).toBeVisible()
  await page.reload()
  await page.getByRole('button', { name: 'Confirm CP’s availability', exact: false }).click()
  await expect(page.getByRole('heading', { name: 'In progress', exact: true })).toBeVisible()
  expect([...rows.values()][0].checked).toEqual([0])
})

test('intake lists actions before questions and does not save a meeting during analysis', async ({ page }) => {
  await page.goto(base)
  const plan = { ...emptyActionPlan(['Prepare the visit brief']), forWhom: 'CP', owner: 'Drikus' }
  const task = { proposalId: '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f', kind: 'task', title: 'Prepare the visit brief', company: 'digikraal', systemId: '005', notes: 'Seller-reported details', requiresExternalApproval: false, uncertainties: [], plan, meeting: { confirmedSchedule: false, startAt: '', endAt: '', people: '', place: '' } }
  const meeting = { ...task, proposalId: '9e9d9c9b-2222-4222-8222-9e9d9c9b9e9d', kind: 'meeting', title: 'Visit CP', plan: undefined }
  let saves = 0
  await page.route('**/api/intake/analyse', (route) => route.fulfill({ json: { language: 'en', summary: 'A visit and its preparation', proposals: [task, meeting], questions: [{ id: 'date', field: 'visit_date', question: 'Which date should the visit take place?' }] } }))
  await page.route('**/api/intake/save', async (route) => {
    saves += 1
    const body = route.request().postDataJSON()
    expect(body.proposals).toHaveLength(2)
    expect(body.proposals[0].plan.owner).toBe('Drikus')
    expect(body.sourceCaptureId).toMatch(/^[0-9a-f-]{36}$/)
    return route.fulfill({ json: { saved: { workCases: [], meetings: [] } } })
  })
  await page.getByRole('button', { name: 'Tell Pivot what happened', exact: true }).click()
  await page.getByLabel('Tell Pivot what happened', { exact: true }).fill('Prepare a visit brief and arrange a visit with CP.')
  await page.getByRole('button', { name: 'Help me plan this', exact: true }).click()
  await expect(page.getByRole('region', { name: 'Actions identified' })).toContainText('Prepare the visit brief')
  await expect(page.getByText('Which date should the visit take place?', { exact: true })).toBeVisible()
  await expect(page.getByText('Nothing has been saved or started.', { exact: false })).toBeVisible()
  const positions = await page.evaluate(() => {
    const actions = document.querySelector('section[aria-label="Actions identified"]')!
    const question = document.querySelector('.pivot-intake-chat-round')!
    return Boolean(actions.compareDocumentPosition(question) & Node.DOCUMENT_POSITION_FOLLOWING)
  })
  expect(positions).toBe(true)
  expect(saves).toBe(0)
  await page.getByRole('button', { name: 'Save 2 items', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Conversational intake', exact: true })).toHaveCount(0)
  expect(saves).toBe(1)
})
