import { createServer, type Server } from 'node:http'
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'

let server: Server
let url = ''

test.beforeAll(async ({ browserName }, worker) => {
  const file = `test-results/011-desk-${browserName}-${worker.workerIndex}.js`
  await esbuild.build({
    entryPoints: ['tests/modules/011/harness.tsx'],
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

test('a founder can record pasted status and cannot publish or deploy', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(url)
  const desk = page.getByRole('region', { name: 'Digital products and marketplace' })
  await expect(desk.getByRole('heading', { level: 1, name: 'Linked source is stale' })).toBeVisible()
  await expect(desk.getByText('Jira is not connected.')).toBeVisible()
  await expect(desk.getByText('GitHub is not connected.')).toBeVisible()
  await expect(desk.getByText('digikraal.co.za is not published from Pivot.')).toBeVisible()
  await expect(desk.locator('.p011-note')).toHaveText('Example only. Not a live incident, release or publication.')
  await expect(desk.getByText('Nothing has been deployed or published from Pivot.')).toBeVisible()
  await expect(desk.getByText('Site is live')).toHaveCount(0)

  await page.getByRole('button', { name: 'Publish the public site', exact: true }).click()
  await expect(desk.getByRole('alert')).toContainText('did not publish')
  await page.getByRole('button', { name: 'Deploy', exact: true }).click()
  await expect(desk.getByRole('alert')).toContainText('did not deploy')
  await page.getByRole('button', { name: 'Create a Jira issue', exact: true }).click()
  await expect(desk.getByRole('alert')).toContainText('did not create')
  await page.getByRole('button', { name: 'Open a pull request', exact: true }).click()
  await expect(desk.getByRole('alert')).toContainText('did not open')
  await expect(desk.getByRole('heading', { level: 1, name: 'Linked source is stale' })).toBeVisible()

  await page.getByLabel('Jira key').fill('WEB-1')
  await page.getByLabel('What you saw').fill('Tried another project key.')
  await page.getByLabel('Observer').fill('Drikus')
  await page.getByRole('button', { name: 'Paste Jira observation' }).click()
  await expect(desk.getByRole('alert')).toContainText('was not recorded')
  await expect(desk.getByRole('heading', { level: 1, name: 'Linked source is stale' })).toBeVisible()

  await page.getByLabel('Jira key').fill('MRK-241')
  await page.getByLabel('Jira status').selectOption('staging')
  await page.getByLabel('What you saw').fill('Checked the MRK board again.')
  await page.getByLabel('Observer').fill('Drikus')
  await page.getByRole('button', { name: 'Paste Jira observation' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Acceptance is still unclear' })).toBeVisible()
  await expect(desk.locator('[data-request-id="011-example-recent-media"]')).toContainText('not a live read')
  await expect(desk.getByRole('alert')).toHaveCount(0)

  await page.getByLabel('Acceptance criterion').fill('the shared link opens the correct listing')
  await page.getByRole('button', { name: 'Add acceptance criterion' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Jira record is still missing' })).toBeVisible()

  await page.getByLabel('Jira key').fill('MRK-300')
  await page.getByLabel('Jira status').selectOption('done')
  await page.getByLabel('What you saw').fill('The MRK board showed Done.')
  await page.getByLabel('Observer').fill('Drikus')
  await page.getByRole('button', { name: 'Paste Jira observation' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Production is not confirmed' })).toBeVisible()
  await expect(desk.locator('[data-request-id="011-example-share-preview"]')).toHaveAttribute('data-production', 'unsupported')

  await page.getByRole('button', { name: 'Record the pasted release note' }).click()
  await expect(desk.getByRole('alert')).toContainText('Nothing was marked delivered')

  await page.getByLabel('Version').fill('1.2.0')
  await page.getByLabel('Approver').selectOption('Drikus')
  await page.getByLabel('Staging evidence').fill('Checked the share preview on staging.')
  await page.getByLabel('GitHub reference').fill('Digikraal/digikraal-deftsoft#300')
  await page.getByLabel('GitHub status').selectOption('merged')
  await page.getByLabel('Observer').fill('Drikus')
  await page.getByRole('button', { name: 'Record the pasted release note' }).click()
  await expect(desk.getByRole('heading', { level: 1, name: 'Review pasted status' })).toBeVisible()
  await expect(desk.locator('[data-request-id="011-example-share-preview"]')).toContainText('did not deploy')
  await expect(desk.locator('[data-request-id="011-example-share-preview"]')).toContainText('was not published')
  await expect(desk.locator('[data-request-id="011-example-share-preview"]')).toHaveAttribute('data-production', 'reported_from_pasted_sources')
  await expect(desk.getByText('Jira is not connected.')).toBeVisible()
  await expect(desk.getByText('GitHub is not connected.')).toBeVisible()
  await expect(desk.getByRole('status')).toContainText('does not show that the public site is live')
  await page.getByRole('button', { name: 'Publish the public site' }).click()
  await expect(desk.getByRole('alert')).toContainText('did not publish')
  expect(errors).toEqual([])
})
