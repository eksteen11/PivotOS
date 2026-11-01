import { createServer, type Server } from 'node:http'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'

let server: Server
let base = ''

test.beforeAll(async ({ browserName }, worker) => {
  const file = path.join('test-results', `module-007-${browserName}-${worker.workerIndex}.js`)
  await esbuild.build({
    entryPoints: ['tests/modules/007/harness.tsx'],
    bundle: true,
    outfile: file,
    format: 'iife',
    platform: 'browser',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"development"' },
    alias: { '@': process.cwd() },
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

test('the partnership desk shows one custody action and does not move money', async ({ page }) => {
  await page.goto(base)
  const module = page.locator('[data-module="007"]')
  await expect(module).toHaveAttribute('data-money-moved', 'false')
  await expect(module).toHaveAttribute('data-paid', 'false')
  await expect(module).toHaveAttribute('data-provider', 'not-connected')
  await expect(module).toHaveAttribute('data-payable', 'false')
  await expect(module).toHaveAttribute('data-split', 'unsigned')
  await expect(page.getByRole('heading', { name: 'Partner safe differs by -R50.00' })).toBeVisible()
  await expect(page.getByText('Not signed. No split was applied.')).toBeVisible()
  await expect(page.getByText('Other partnerships stay off this desk.')).toBeVisible()
  await expect(page.getByText('hidden-partner-evidence-9f3a')).toHaveCount(0)
  await expect(page.getByText('This screen does not move money.')).toBeVisible()
  await expect(page.getByText('Bank and Xero are not connected.')).toBeVisible()
  await expect(page.getByRole('button', { name: /^(Pay|Send|Transfer|Deposit)/ })).toHaveCount(0)
  const next = page.getByRole('button', { name: 'Explain the variance' })
  await expect(next).toBeVisible()
  const box = await next.boundingBox()
  expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
  expect(overflow).toBe(false)
  await next.click()
  await expect(page.getByTestId('opened')).toHaveText('cash:operating-partner-safe')
})
