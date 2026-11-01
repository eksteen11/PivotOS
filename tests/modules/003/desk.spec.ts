import { createServer, type Server } from 'node:http'
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'

let server: Server
let base = ''

test.beforeAll(async () => {
  const file = path.join(process.cwd(), 'test-results/modules-003/desk.js')
  mkdirSync(path.dirname(file), { recursive: true })
  await esbuild.build({
    entryPoints: ['tests/modules/003/harness.tsx'],
    bundle: true,
    outfile: file,
    format: 'iife',
    platform: 'browser',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"development"' },
    plugins: [
      { name: 'alias', setup(build) { build.onResolve({ filter: /^@\// }, (args) => { const source = path.join(process.cwd(), args.path.slice(2)); if (existsSync(source) && statSync(source).isDirectory()) { const index = ['index.ts', 'index.tsx'].map((name) => path.join(source, name)).find(existsSync); if (index) return { path: index } } return { path: ['.tsx', '.ts', '.jsx', '.js'].map((ext) => source + ext).find(existsSync) ?? source } }) } },
      { name: 'css-module', setup(build) {
        build.onResolve({ filter: /\.module\.css$/ }, (args) => ({ path: path.resolve(args.resolveDir, args.path), namespace: 'css-mod' }))
        build.onLoad({ filter: /.*/, namespace: 'css-mod' }, (args) => {
          const names = [...readFileSync(args.path, 'utf8').matchAll(/\.([A-Za-z_][\w-]*)/g)].map((match) => match[1])
          return { contents: `export default { ${[...new Set(names)].map((name) => `${JSON.stringify(name)}:${JSON.stringify(name)}`).join(',')} }`, loader: 'js' }
        })
      } },
    ],
  })
  const css = readFileSync('components/modules/003/northpoint.module.css', 'utf8')
  const script = readFileSync(file)
  server = createServer((request, response) => {
    if (request.url === '/app.js') { response.setHeader('content-type', 'text/javascript'); response.end(script); return }
    response.setHeader('content-type', 'text/html')
    response.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body><div id="root"></div><script src="/app.js"></script></body></html>`)
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  base = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`
})

test.afterAll(async () => { if (server) await new Promise<void>((resolve) => server.close(() => resolve())) })

async function capture(page: import('@playwright/test').Page) {
  await page.getByRole('textbox', { name: 'Property', exact: true }).fill('Seller call about a smallholding')
  await page.getByRole('textbox', { name: 'Seller or landlord', exact: true }).fill('The seller on the call')
  await page.getByRole('textbox', { name: 'What was said', exact: true }).fill('He may sell. No price was given.')
  await page.getByRole('textbox', { name: 'Recorded by', exact: true }).fill('Drikus')
  await page.getByRole('button', { name: 'Save property', exact: true }).click()
}

test('the desk records only what was stated and does not offer a send or a portal', async ({ page }) => {
  await page.goto(base)
  await expect(page.getByRole('heading', { name: 'Northpoint Realty' })).toBeVisible()
  await expect(page.getByText('Not connected').first()).toBeVisible()
  await expect(page.getByText('Not calculated').first()).toBeVisible()
  await capture(page)
  await expect(page.getByText('Asking price: Unknown')).toBeVisible()
  await expect(page.getByText('He may sell. No price was given.')).toBeVisible()
  await expect(page.getByText('No legal determination is recorded.')).toBeVisible()
  await page.getByRole('button', { name: 'Move stage' }).click()
  await expect(page.getByText('Commission due and commission paid are not available.')).toBeVisible()
  await expect(page.getByLabel('Next stage')).not.toContainText('Commission paid')
  await page.getByRole('button', { name: 'Buyer requirements' }).click()
  await page.getByLabel('Buyer or tenant').fill('The buyer on the call')
  await page.getByLabel('What was said').fill('Looking near Paarl. No budget yet.')
  await page.getByLabel('Recorded by').fill('Drikus')
  await page.getByRole('button', { name: 'Save requirement' }).click()
  await page.getByRole('button', { name: 'Internal matches' }).click()
  await expect(page.getByText('No client message was prepared.')).toBeVisible()
  await expect(page.getByText('Asking price is unknown')).toBeVisible()
  expect(await page.locator('a').count()).toBe(0)
  const names = (await page.getByRole('button').allTextContents()).join('\n')
  expect(names).not.toMatch(/send|publish|pay/i)
})

test('a phone width keeps the capture action reachable', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await page.goto(base)
  const button = page.getByRole('button', { name: 'Save property' })
  await button.scrollIntoViewIfNeeded()
  const box = await button.boundingBox()
  expect(box?.height).toBeGreaterThanOrEqual(44)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
  expect(overflow).toBe(true)
  await capture(page)
  await expect(page.getByText('Asking price: Unknown')).toBeVisible()
  const detailOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
  expect(detailOverflow).toBe(true)
  await context.close()
})
