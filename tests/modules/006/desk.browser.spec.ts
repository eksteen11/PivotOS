import { createServer, type Server } from 'node:http'
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'

let server: Server
let url = ''

test.beforeAll(async ({ browserName }, worker) => {
  const file = `test-results/006-desk-${browserName}-${worker.workerIndex}.js`
  await esbuild.build({
    entryPoints: ['tests/modules/006/harness.tsx'],
    bundle: true,
    outfile: file,
    format: 'iife',
    platform: 'browser',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"development"' },
  })
  const script = readFileSync(file)
  const css = readFileSync(file.replace('.js', '.css'), 'utf8')
  server = createServer((request, response) => {
    if (request.url === '/app.js') {
      response.setHeader('content-type', 'text/javascript')
      response.end(script)
      return
    }
    response.setHeader('content-type', 'text/html')
    response.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;font-family:ui-sans-serif,system-ui,sans-serif}${css}</style></head><body><div id="root"></div><script src="/app.js"></script></body></html>`)
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  url = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`
})

test.afterAll(async () => {
  if (server) await new Promise<void>((resolve) => server.close(() => resolve()))
})

test('a reviewer can set a ceiling only after evidence and known costs, and cannot bid', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(url)
  const desk = page.getByRole('region', { name: 'DigiKraal property investment' })
  await expect(desk.getByRole('heading', { level: 1, name: 'Ceiling blocked' })).toBeVisible()
  await expect(desk.getByText('Not Northpoint')).toBeVisible()
  await expect(desk.getByRole('region', { name: 'Valuation' })).toContainText('No achieved-sale range')
  await expect(desk.getByRole('region', { name: 'Costs' })).toContainText('Unknown')
  await expect(desk.getByText('R 595 000.00')).toHaveCount(0)
  await page.getByLabel('Registered price (R)').fill('1000000')
  await page.getByLabel('Adjustment (R)').fill('0')
  await page.getByLabel('Source', { exact: true }).fill('Deeds office example')
  await page.getByLabel('Source date').fill('2026-08-01')
  await page.getByRole('button', { name: 'Add achieved-sale evidence' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Ceiling blocked' })).toBeVisible()
  await expect(desk.getByRole('heading', { level: 2, name: 'Municipal arrears is unknown and was not treated as zero.' })).toBeVisible()
  await page.getByLabel('Known amount (R)').fill('25000')
  await page.getByLabel('Source', { exact: true }).fill('Municipal statement example')
  await page.getByRole('button', { name: 'Save known cost' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Ceiling ready for review' })).toBeVisible()
  await expect(desk.getByRole('region', { name: 'Bid ceiling' })).toContainText('R 595 000.00')
  await expect(desk.getByRole('region', { name: 'Valuation' })).toContainText('not a formal valuation')
  await page.getByLabel('Reviewer').fill('Deal preparer')
  await page.getByLabel('Approved ceiling (R)').fill('595000')
  await page.getByLabel('Reason').fill('Same person should not pass.')
  await page.getByRole('button', { name: 'Review ceiling' }).click()
  await expect(desk.getByRole('alert')).toContainText('preparer cannot review')
  await page.getByLabel('Reviewer').fill('Second reviewer')
  await page.getByLabel('Approved ceiling (R)').fill('600000')
  await page.getByLabel('Reason').fill('This tries to go above the recommendation.')
  await page.getByRole('button', { name: 'Review ceiling' }).click()
  await expect(desk.getByRole('alert')).toContainText('above the recommendation')
  await page.getByLabel('Approved ceiling (R)').fill('595000')
  await page.getByLabel('Reason').fill('Reviewed under the recommendation.')
  await page.getByRole('button', { name: 'Review ceiling' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Ceiling reviewed' })).toBeVisible()
  await expect(desk.getByText('This is a limit, not a bid.')).toBeVisible()
  await page.getByLabel('Approved ceiling (R)').fill('596000')
  await page.getByLabel('Reason').fill('Trying to raise the ceiling.')
  await page.getByRole('button', { name: 'Review ceiling' }).click()
  await expect(desk.getByRole('alert')).toContainText('cannot raise')
  await expect(desk.getByText('Reviewed ceiling R 595 000.00')).toBeVisible()
  await page.getByRole('button', { name: 'Record a bid' }).click()
  await expect(desk.getByRole('alert')).toContainText('does not place bids')
  await page.getByRole('button', { name: 'Prepare a contract' }).click()
  await expect(desk.getByRole('alert')).toContainText('does not prepare or sign contracts')
  await page.getByRole('button', { name: 'Release finance' }).click()
  await expect(desk.getByRole('alert')).toContainText('does not release finance')
  expect(errors).toEqual([])
})
