import { createServer, type Server } from 'node:http'
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'

let server: Server
let url = ''

test.beforeAll(async ({ browserName }, worker) => {
  const file = `test-results/008-desk-${browserName}-${worker.workerIndex}.js`
  await esbuild.build({
    entryPoints: ['tests/modules/008/harness.tsx'],
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

test('a board can record a release only after evidence, and cannot move the money', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(url)
  const desk = page.getByRole('region', { name: 'DigiKraal strategic growth and capital' })
  await expect(desk.getByRole('heading', { level: 1, name: 'Capital blocked' })).toBeVisible()
  await expect(desk.getByText('not a statutory share register')).toBeVisible()
  await expect(desk.getByRole('region', { name: 'Money figures' })).toContainText('R 1 000 000.00')
  await expect(desk.getByText('R 1 250 000.00')).toHaveCount(0)
  await expect(desk.getByRole('region', { name: 'Portfolio score' })).toContainText('does not release capital')
  await expect(desk.getByRole('region', { name: 'Portfolio score' })).toContainText('not treated as zero')
  await page.getByRole('button', { name: 'Record signed policy' }).click()
  await expect(desk.getByRole('alert')).toContainText('draft')
  await page.getByRole('checkbox', { name: 'Signed pack, not a draft' }).check()
  await page.getByLabel('ITS representative').fill('Tiaan Oosthuizen')
  await page.getByLabel('CJ du Plessis').fill('CJ du Plessis')
  await page.getByLabel('DJ Eksteen').fill('DJ Eksteen')
  await page.getByLabel('Policy source').fill('Example policy pack')
  await page.getByLabel('Policy date').fill('2026-10-20')
  await page.getByRole('button', { name: 'Record signed policy' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Funding stopped' })).toBeVisible()
  await page.getByLabel('Evidence source').fill('Example reporting pack')
  await page.getByLabel('Evidence date').fill('2026-10-20')
  await page.getByRole('button', { name: 'Record current evidence' }).click()
  await expect(desk.getByRole('region', { name: 'Your next action' })).toContainText('Opening stock count is overdue')
  await page.getByLabel('Evidence source').fill('Example stock count')
  await page.getByLabel('Evidence date').fill('2026-10-21')
  await page.getByRole('button', { name: 'Record current evidence' }).click()
  await expect(desk.getByRole('region', { name: 'Your next action' })).toContainText('Still open: Shareholder and project agreements.')
  await page.getByLabel('Agreement source').fill('Example signed agreements')
  await page.getByLabel('Agreement date').fill('2026-10-22')
  await page.getByRole('button', { name: 'Record signed agreements' }).click()
  await expect(desk.getByRole('region', { name: 'Your next action' })).toContainText('Pipeline funding is not cash.')
  await page.getByLabel('Verified cash (R)').fill('250000')
  await page.getByLabel('Cash source').fill('Example bank statement')
  await page.getByLabel('Cash date').fill('2026-10-23')
  await page.getByRole('button', { name: 'Record verified cash' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Board decision needed' })).toBeVisible()
  await expect(desk.getByRole('region', { name: 'Money figures' })).toContainText('R 900 000.00')
  await expect(desk.getByText('R 1 250 000.00')).toHaveCount(0)
  await page.getByLabel('ITS representative').fill('Tiaan Oosthuizen')
  await page.getByLabel('CJ du Plessis').fill('CJ du Plessis')
  await page.getByLabel('DJ Eksteen').fill('DJ Eksteen')
  await page.getByLabel('Verifier').fill('Project sponsor')
  await page.getByRole('button', { name: 'Record board decision' }).click()
  await expect(desk.getByRole('alert')).toContainText('requester')
  await page.getByLabel('Verifier').fill('Finance verifier')
  await page.getByRole('button', { name: 'Record board decision' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Decision recorded' })).toBeVisible()
  await expect(desk.getByRole('region', { name: 'Your next action' })).toContainText('No money moved')
  await expect(desk.getByRole('region', { name: 'Release gate' })).toContainText('Receipt is unconfirmed.')
  await page.getByRole('button', { name: 'Transfer funds' }).click()
  await expect(desk.getByRole('alert')).toContainText('does not transfer')
  await expect(desk.getByRole('heading', { level: 1, name: 'Decision recorded' })).toBeVisible()
  await page.getByRole('button', { name: 'Invest' }).click()
  await expect(desk.getByRole('alert')).toContainText('does not invest')
  await page.getByRole('button', { name: 'Pay a distribution' }).click()
  await expect(desk.getByRole('alert')).toContainText('does not pay a distribution')
  await page.getByRole('button', { name: 'Record a WhatsApp approval' }).click()
  await expect(desk.getByRole('alert')).toContainText('not the board decision')
  await expect(desk.getByRole('heading', { level: 1, name: 'Decision recorded' })).toBeVisible()
  expect(errors).toEqual([])
})
