import { createServer, type Server } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'
import { sampleCases } from '../../lib/workspace/model'
import { focusMeeting, reviewOrder } from '../../lib/workspace/focus'

let server: Server
let url = ''

test.beforeAll(async ({ browserName }, worker) => {
  const file = `test-results/workspace-design-${browserName}-${worker.workerIndex}.js`
  await esbuild.build({
    entryPoints: ['tests/smoke/support/workspace-design-harness.tsx'], bundle: true, outfile: file,
    format: 'iife', platform: 'browser', jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"development"' },
    alias: { 'next/link': path.join(process.cwd(), 'tests/smoke/support/test-link.tsx') },
    plugins: [{ name: 'at-alias', setup(build) {
      build.onResolve({ filter: /^@\// }, (args) => {
        const base = path.join(process.cwd(), args.path.slice(2))
        return { path: ['.tsx', '.ts', '.jsx', '.js'].map((ext) => base + ext).find(existsSync) ?? base }
      })
    } }],
  })
  const script = readFileSync(file)
  const css = [readFileSync('app/pivot.css', 'utf8'), readFileSync('app/account.css', 'utf8'), readFileSync(file.replace('.js', '.css'), 'utf8')].join('\n')
  server = createServer((request, response) => {
    if (request.url === '/app.js') { response.setHeader('content-type', 'text/javascript'); response.end(script); return }
    response.setHeader('content-type', 'text/html')
    response.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}button,input,select,textarea{font:inherit}button{cursor:pointer;background:none;border:0;color:inherit}a{color:inherit;text-decoration:none}h1,h2,h3,p{margin:0}${css}</style></head><body><div id="root"></div><script src="/app.js"></script></body></html>`)
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  url = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`
})
test.afterAll(async () => { if (server) await new Promise<void>((resolve) => server.close(() => resolve())) })

test('focus uses explicit dates and preserves source records', () => {
  const items = sampleCases().map((item) => ({ ...item, due: item.id === 'sample-personal' ? '2026-10-27' : '' }))
  const order = reviewOrder(items.filter((item) => item.status === 'planned'))
  expect(order[0].id).toBe('sample-personal')
  expect(items[0].id).toBe('sample-cattle')
  expect(focusMeeting([{ startsAt: '2026-10-20T08:00:00Z' }, { startsAt: '2026-10-27T08:00:00Z' }], Date.parse('2026-10-25T00:00:00Z'))?.startsAt).toBe('2026-10-27T08:00:00Z')
})

test('desk leads with one review action and summary links open the right work', async ({ page }) => {
  await page.goto(url)
  const focus = page.getByRole('region', { name: 'Your next action' })
  await expect(focus.getByRole('heading', { name: 'Needs Drikus' })).toBeVisible()
  await expect(focus.getByRole('button', { name: 'Review work plan: Make room for the work that matters' })).toBeVisible()
  await expect(page.locator('.pivot-desk-stats')).toHaveCount(0)
  await expect(page.locator('.pivot-assistant-strip')).toHaveCount(0)
  await expect(page.locator('.pivot-business-overview')).not.toHaveAttribute('open', '')
  await page.getByRole('button', { name: '1 Waiting', exact: true }).click()
  await expect(page.getByLabel('Status', { exact: true })).toHaveValue('waiting')
  await expect(page.getByRole('table')).toContainText('Match an oat hay enquiry to supply')
  await expect(page.getByRole('table')).not.toContainText('CP van der Merwe')
})

test('new work keeps the save action visible and retries the same capture after an origin rejection', async ({ page }) => {
  await page.goto(url)
  await page.getByRole('button', { name: 'New work', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Save work plan', exact: true })).toBeDisabled()
  await page.getByLabel('Work title', { exact: true }).fill('Prepare the Ceres farm visit')
  await expect(page.getByLabel('Context & notes', { exact: true })).not.toBeVisible()
  await page.getByText('Add notes or a follow-up', { exact: false }).click()
  await page.getByLabel('Context & notes', { exact: true }).fill('Retain the seller details after a rejected save.')
  await page.getByLabel('Follow-up date', { exact: false }).fill('2026-10-27')
  await page.getByText('7 checklist steps included', { exact: true }).click()
  await page.locator('.pivot-form-scroll').evaluate((element) => { element.scrollTop = element.scrollHeight })
  const save = page.getByRole('button', { name: 'Save work plan', exact: true })
  const bounds = await save.boundingBox()
  expect(bounds).not.toBeNull()
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(page.viewportSize()!.height)
  const ids: string[] = []
  await page.route('**/api/work', async (route) => {
    const body = route.request().postDataJSON()
    ids.push(body.id)
    if (ids.length === 1) return route.fulfill({ status: 403, json: { error: 'Request origin is not allowed.' } })
    return route.fulfill({ status: 201, json: { item: { ...sampleCases()[0], ...body, status: 'planned' } } })
  })
  await save.click()
  await expect(page.getByRole('alert')).toContainText('Your details are still here')
  await expect(page.getByRole('alert')).not.toContainText('Request origin')
  await expect(page.getByLabel('Context & notes', { exact: true })).toHaveValue('Retain the seller details after a rejected save.')
  await save.click()
  await expect(page.getByRole('dialog', { name: 'Work detail', exact: true })).toBeVisible()
  await expect(page.getByRole('dialog', { name: 'Work detail', exact: true }).getByRole('heading', { name: 'Prepare the Ceres farm visit', exact: true })).toBeVisible()
  expect(ids).toHaveLength(2)
  expect(ids[0]).toBe(ids[1])
})

test('calendar has one preparation action and respects business filters', async ({ page }) => {
  await page.goto(`${url}/?view=calendar`)
  await expect(page.locator('.pivot-calendar-focus').getByRole('heading', { name: 'Ceres farm visit' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Open meeting & prepare' })).toHaveAttribute('href', '/today/meetings/visit')
  await page.locator('.pivot-filter-pills').getByRole('button', { name: 'Farm Feed', exact: true }).click()
  await expect(page.getByText('Ceres farm visit')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Plan a meeting', exact: true })).toBeVisible()
})

test('Escape cannot dismiss a new work plan while its save is pending', async ({ page }) => {
  await page.goto(url)
  await page.getByRole('button', { name: 'New work', exact: true }).click()
  await page.getByLabel('Work title', { exact: true }).fill('Keep this capture until saving finishes')
  let pending: import('@playwright/test').Route | undefined
  await page.route('**/api/work', (route) => { pending = route })
  await page.getByRole('button', { name: 'Save work plan', exact: true }).click()
  await expect.poll(() => Boolean(pending)).toBe(true)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'New work', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Saving…', exact: true })).toBeDisabled()
  const body = pending!.request().postDataJSON()
  await pending!.fulfill({ status: 201, json: { item: { ...sampleCases()[0], ...body, status: 'planned' } } })
  await expect(page.getByRole('dialog', { name: 'Work detail', exact: true })).toBeVisible()
})
