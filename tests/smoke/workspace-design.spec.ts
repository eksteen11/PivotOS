import { createServer, type Server } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'
import { acceptFounderCommand, buildFounderCommand } from '../../lib/modules/002/prioritise'
import { founderDeskSignals } from '../../lib/workspace/founderSignals'
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

test('founder command centre ranks saved work and keeps private titles off a company lens', () => {
  const today = '2026-10-26'
  const items = sampleCases().map((item) => ({ ...item, due: item.id === 'sample-personal' ? '2026-10-27' : '' }))
  const founder = founderDeskSignals(items, 'all', today)
  expect(acceptFounderCommand(founder, 'founder', today).ok).toBe(true)
  expect(buildFounderCommand(founder, 'founder', today).focus?.id).toBe('sample-personal')
  const companySignals = founderDeskSignals(items, 'digikraal', today)
  expect(acceptFounderCommand(companySignals, 'digikraal', today).ok).toBe(true)
  const company = buildFounderCommand(companySignals, 'digikraal', today)
  expect(company.focus?.id).toBe('sample-cattle')
  expect(company.focus?.next.executes).toBe(false)
  expect(JSON.stringify(company)).not.toContain('Make room for the work that matters')
  const personal = buildFounderCommand(founderDeskSignals(items, 'personal', today), 'founder', today)
  expect(personal.needsYou.every((item) => item.company === 'personal')).toBe(true)
  expect(founderDeskSignals([{ ...items[0], status: 'done', plan: undefined }], 'all', today)).toEqual([])
  expect(founderDeskSignals([{ ...items[0], id: 'long-title', title: 'A'.repeat(240) }], 'digikraal', today)[0]?.title).toHaveLength(180)
})

test('founder command centre opens the existing work record and hides private titles on a phone-width company lens', async ({ page }) => {
  await page.goto(url)
  const command = page.locator('[data-module="002"]')
  await expect(command).toHaveAttribute('data-lens', 'founder')
  await expect(command).toHaveAttribute('data-provider', 'not-connected')
  await expect(command.getByText('Nothing is sent or paid from here.')).toBeVisible()
  await expect(command.getByRole('button', { name: 'Add the next action: Make room for the work that matters', exact: true })).toBeVisible()
  await page.locator('.pivot-filter-pills').getByRole('button', { name: 'DigiKraal', exact: true }).click()
  await expect(command).toHaveAttribute('data-lens', 'digikraal')
  await expect(command.getByText('Make room for the work that matters')).toHaveCount(0)
  const open = command.getByRole('button', { name: 'Add the next action: CP van der Merwe · Angus cows & calves', exact: true })
  await open.click()
  const detail = page.getByRole('dialog', { name: 'Work detail', exact: true })
  await expect(detail).toBeVisible()
  await expect(detail.getByRole('heading', { name: 'CP van der Merwe · Angus cows & calves', exact: true })).toBeVisible()
  await expect(detail.getByText(/has been sent|has been paid|agent executed/i)).toHaveCount(0)
})

test('new work keeps the save action visible and retries the same capture after an origin rejection', async ({ page }) => {
  await page.goto(url)
  await page.getByRole('button', { name: 'New work', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Who is this for?', exact: true })).toBeDisabled()
  await page.getByLabel('Actions to complete · one per line', { exact: true }).fill('Prepare the Ceres farm visit')
  await page.getByRole('button', { name: 'Who is this for?', exact: true }).click()
  await page.getByLabel('Business', { exact: true }).selectOption('digikraal')
  await page.getByLabel('Division', { exact: true }).selectOption('005')
  await expect(page.getByLabel('Context & notes', { exact: true })).not.toBeVisible()
  await page.getByText('Add source context or notes', { exact: true }).click()
  await page.getByLabel('Context & notes', { exact: true }).fill('Retain the seller details after a rejected save.')
  await page.getByRole('button', { name: 'Build the plan', exact: true }).click()
  await page.getByText('Review or edit all plan details', { exact: true }).click()
  await page.getByLabel('Follow-up date', { exact: false }).fill('2026-10-27')
  await page.locator('.pivot-form-scroll').evaluate((element) => { element.scrollTop = element.scrollHeight })
  const save = page.getByRole('button', { name: 'Save action plan', exact: true })
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
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByText('Add source context or notes', { exact: true }).click()
  await expect(page.getByLabel('Context & notes', { exact: true })).toHaveValue('Retain the seller details after a rejected save.')
  await page.getByRole('button', { name: 'Build the plan', exact: true }).click()
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
  await page.getByLabel('Actions to complete · one per line', { exact: true }).fill('Keep this capture until saving finishes')
  await page.getByRole('button', { name: 'Who is this for?', exact: true }).click()
  await page.getByLabel('Business', { exact: true }).selectOption('digikraal')
  await page.getByLabel('Division', { exact: true }).selectOption('005')
  await page.getByRole('button', { name: 'Build the plan', exact: true }).click()
  let pending: import('@playwright/test').Route | undefined
  await page.route('**/api/work', (route) => { pending = route })
  await page.getByRole('button', { name: 'Save action plan', exact: true }).click()
  await expect.poll(() => Boolean(pending)).toBe(true)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'New work', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Saving…', exact: true })).toBeDisabled()
  const body = pending!.request().postDataJSON()
  await pending!.fulfill({ status: 201, json: { item: { ...sampleCases()[0], ...body, status: 'planned' } } })
  await expect(page.getByRole('dialog', { name: 'Work detail', exact: true })).toBeVisible()
})
