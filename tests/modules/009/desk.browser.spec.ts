import { createServer, type Server } from 'node:http'
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'

let server: Server
let url = ''

test.beforeAll(async ({ browserName }, worker) => {
  const file = `test-results/009-desk-${browserName}-${worker.workerIndex}.js`
  await esbuild.build({
    entryPoints: ['tests/modules/009/harness.tsx'],
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

test('finance lanes stay separate and unsupported payment claims are blocked', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(url)
  const desk = page.getByRole('region', { name: 'Finance, treasury and administration' })
  await expect(desk.getByRole('heading', { level: 1, name: 'Forecast only' })).toBeVisible()
  await expect(desk.getByText('Nothing on this screen is posted or paid.')).toBeVisible()
  await expect(desk.getByRole('region', { name: 'Obligation' })).toContainText('Xero')
  await expect(desk.getByRole('region', { name: 'Amount lanes' })).toContainText('R 15 000.00')
  await expect(desk.locator('[data-basis="accrual"]')).toContainText('Unknown')
  await expect(desk.locator('[data-basis="cash"]')).toContainText('Unknown')
  await expect(desk.getByRole('region', { name: 'Obligation' })).toContainText('Corporate register')
  await expect(desk.getByRole('region', { name: 'Obligation' })).toContainText('Founder decision')
  await expect(desk.getByRole('region', { name: 'Private founder note' })).toContainText('stays with DJ')
  await page.getByRole('button', { name: 'Shared finance view' }).click()
  await expect(desk.getByRole('region', { name: 'Private founder note' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Founder view' }).click()
  await expect(desk.getByRole('region', { name: 'Private founder note' })).toContainText('stays with DJ')
  await page.getByRole('button', { name: 'Post to the ledger' }).click()
  await expect(desk.getByRole('alert')).toContainText('does not post')
  await page.getByRole('button', { name: 'Mark as paid' }).click()
  await expect(desk.getByRole('alert')).toBeVisible()
  await expect(desk.getByText('Released: yes')).toHaveCount(0)
  await page.getByLabel('Document amount (R)').fill('15000')
  await page.getByLabel('Document number').fill('EX-100')
  await page.getByLabel('Document source').fill('Example folder')
  await page.getByLabel('Document date').fill('2026-10-20')
  await page.getByRole('button', { name: 'Add supplier document' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Accrual is not cash' })).toBeVisible()
  await expect(desk.locator('[data-basis="forecast"]')).toContainText('R 15 000.00')
  await expect(desk.locator('[data-basis="accrual"]')).toContainText('R 15 000.00')
  await expect(desk.locator('[data-basis="cash"]')).toContainText('Unknown')
  await expect(desk.getByText('Nothing was posted.')).toBeVisible()
  await page.getByLabel('Bank amount (R)').fill('15000')
  await page.getByLabel('Bank reference').fill('BNK1')
  await page.getByLabel('Bank source').fill('Example statement')
  await page.getByLabel('Bank date').fill('2026-10-21')
  await page.getByRole('button', { name: 'Add bank evidence' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Match needs a person' })).toBeVisible()
  await expect(desk.locator('[data-basis="cash"]')).toContainText('Not a live bank balance')
  await page.getByLabel('Finance user').fill('Clark')
  await page.getByLabel('Resolution').fill('Trying to close it automatically.')
  await page.getByRole('button', { name: 'Approve the match' }).click()
  await expect(desk.getByRole('alert')).toContainText('cannot approve')
  await page.getByLabel('Finance user').fill('Emma')
  await page.getByLabel('Resolution').fill('Example bank line attached.')
  await page.getByRole('button', { name: 'Approve the match' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Record a human decision' })).toBeVisible()
  await expect(desk.getByText('Residual R 0.00 stays visible.')).toBeVisible()
  await page.getByLabel('Finance user').fill('Clark')
  await page.getByRole('button', { name: 'Record the decision' }).click()
  await expect(desk.getByRole('alert')).toContainText('cannot approve')
  await page.getByLabel('Finance user').fill('Emma')
  await page.getByRole('button', { name: 'Record the decision' }).click()
  await expect(desk.getByText('Nothing was posted.')).toBeVisible()
  await expect(desk.getByText('Posted: no.')).toBeVisible()
  await page.getByRole('button', { name: 'Prepare the instruction' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Nothing to pay here' })).toBeVisible()
  await expect(desk.getByText('Released: no.')).toBeVisible()
  await expect(desk.getByText('It is not paid.')).toBeVisible()
  const markPaid = page.getByRole('button', { name: 'Mark as paid' })
  await markPaid.scrollIntoViewIfNeeded()
  await markPaid.click()
  await expect(desk.getByRole('alert')).toContainText(/not a payment|does not release|do not release/)
  await expect(desk.getByText('Released: yes')).toHaveCount(0)
  await page.getByRole('button', { name: 'DK Agri (Pty) Ltd' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Nothing to decide on this entity' })).toBeVisible()
  await expect(desk.getByText('R 15 000.00')).toHaveCount(0)
  await page.getByLabel('Exclusive amount (R)').fill('1000')
  await page.getByLabel('VAT rate').fill('15')
  await page.getByRole('button', { name: 'Check VAT' }).click()
  await expect(desk.getByRole('alert')).toContainText('cannot inherit')
  await page.getByRole('button', { name: 'Farm Feed (Pty) Ltd' }).click()
  await expect(desk.getByRole('status')).toContainText('Sage')
  await page.getByRole('button', { name: 'Digikraal (Pty) Ltd' }).click()
  await expect(desk.getByRole('status')).toContainText('Xero')
  await expect(desk.getByRole('region', { name: 'Obligation' })).toContainText('Example insurance renewal')
  await expect(desk.locator('[data-basis="cash"]')).toContainText('Not a live bank balance')
  expect(errors).toEqual([])
})
