import { createServer, type Server } from 'node:http'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'

let server: Server
let base = ''

test.beforeAll(async ({ browserName }, worker) => {
  const file = path.join('test-results', `module-002-${browserName}-${worker.workerIndex}.js`)
  await esbuild.build({
    entryPoints: ['tests/modules/002/harness.tsx'],
    bundle: true,
    outfile: file,
    format: 'iife',
    platform: 'browser',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"development"' },
  })
  const script = readFileSync(file)
  const css = readFileSync(file.replace(/\.js$/, '.css'), 'utf8')
  server = createServer((request, response) => {
    if (request.url === '/app.js') {
      response.setHeader('content-type', 'text/javascript')
      response.end(script)
      return
    }
    response.setHeader('content-type', 'text/html')
    response.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}${css}</style></head><body><div id="root"></div><script src="/app.js"></script></body></html>`)
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  base = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`
})

test.afterAll(async () => {
  if (server) await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
})

test('the founder view names one next action and a company view stays private', async ({ page }) => {
  test.setTimeout(60_000)
  test.setTimeout(90_000)
  page.on('pageerror', (error) => { throw error })
  await page.goto(base)
  const module = page.locator('[data-module="002"]')
  await expect(module).toHaveAttribute('data-lens', 'founder')
  await expect(module).toHaveAttribute('data-focus-id', 'leslie-payment')
  await expect(module).toHaveAttribute('data-provider', 'not-connected')
  await expect(page.getByRole('heading', { name: 'What needs you' })).toBeVisible()
  const next = page.getByRole('button', { name: 'Add evidence: Leslie payment' })
  await expect(next).toBeVisible()
  const box = await next.boundingBox()
  expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height)
  await next.click()
  await expect(page.getByTestId('opened')).toHaveText('leslie-payment')
  await page.getByTestId('lens-digikraal').click()
  await expect(module).toHaveAttribute('data-lens', 'digikraal')
  await expect(page.getByText('Leslie payment')).toHaveCount(0)
  await expect(page.getByText('Church roster')).toHaveCount(0)
  await expect(page.getByText('Personal debt note')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Review for approval: Buyer reply for Digikraal' })).toBeVisible()
  await expect(page.getByText('WhatsApp and email are not connected')).toBeVisible()
  await expect(page.getByText('Private family, church, health and personal money stay on the founder view.')).toBeVisible()
})
