import { createServer, type Server } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'

const draftKey = 'pivotos:intake-draft:v1:founder-test'
const draft = {
  sourceLabel: 'Manual',
  transcript: 'Hou hierdie konsep',
  language: 'af',
  summary: 'Konsep bly staan',
  questions: [],
  clarifications: [],
  proposals: [],
  removedProposalIds: [],
  captureId: '0d0f0d0f-1111-4111-8111-0d0f0d0f0d0f',
  idempotencyKey: '9e9d9c9b-2222-4222-8222-9e9d9c9b9e9d',
  analysisStale: false,
}

test('week navigation and reload show the same meetings without clearing the draft', async ({ page }) => {
  await esbuild.build({
    entryPoints: ['tests/smoke/support/calendar-nav-harness.tsx'],
    bundle: true,
    outfile: 'test-results/calendar-nav.js',
    format: 'iife',
    platform: 'browser',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"development"' },
    alias: { 'next/link': path.join(process.cwd(), 'tests/smoke/support/test-link.tsx') },
    plugins: [
      {
        name: 'at-alias',
        setup(build) {
          build.onResolve({ filter: /^@\// }, (args) => ({ path: resolveSource(path.join(process.cwd(), args.path.slice(2))) }))
        },
      },
    ],
  })
  const script = readFileSync('test-results/calendar-nav.js')
  const server = createServer((request, response) => {
    if (request.url?.startsWith('/app.js')) {
      response.setHeader('content-type', 'text/javascript')
      response.end(script)
      return
    }
    response.setHeader('content-type', 'text/html')
    response.end('<!doctype html><html><body><div id="root"></div><script src="/app.js"></script></body></html>')
  })
  const port = await listen(server)
  try {
    await page.goto(`http://127.0.0.1:${port}/today?view=calendar`)
    await page.evaluate(({ key, value }) => localStorage.setItem(key, value), { key: draftKey, value: JSON.stringify(draft) })
    await expect(page.getByText('Midweek check')).toBeVisible()
    await expect(page.getByText('Plaasbesoek Ceres')).toHaveCount(0)

    await page.getByRole('link', { name: 'Next week' }).click()
    await expect(page.getByRole('heading', { name: /26 Oct 2026/ })).toBeVisible()
    await expect(page.getByText('Plaasbesoek Ceres')).toBeVisible()
    await expect(page.getByText('Wed, 28 Oct, 08:00')).toBeVisible()
    await expect(page.getByText('Midweek check')).toHaveCount(0)
    await expect(page).toHaveURL(/week=2026-10-26/)

    await page.reload()
    await expect(page.getByText('Plaasbesoek Ceres')).toBeVisible()
    await expect(page.getByText('Midweek check')).toHaveCount(0)
    await expect(page.getByText('Wed, 28 Oct, 08:00')).toBeVisible()

    await page.locator('.pivot-sidebar').getByRole('button', { name: 'My desk' }).click()
    await expect(page.getByText('Midweek check')).toBeVisible()
    await expect(page.getByText('Plaasbesoek Ceres')).toHaveCount(0)

    await page.locator('.pivot-sidebar').getByRole('button', { name: 'Calendar' }).click()
    await page.getByRole('link', { name: 'This week' }).click()
    await expect(page.getByText('Midweek check')).toBeVisible()
    await expect(page.getByText('Plaasbesoek Ceres')).toHaveCount(0)

    const stored = await page.evaluate((key) => localStorage.getItem(key), draftKey)
    expect(stored).toContain('Hou hierdie konsep')
    await page.getByRole('button', { name: 'Tell Pivot what happened' }).click()
    await expect(page.getByLabel('Tell Pivot what happened')).toHaveValue('Hou hierdie konsep')
    const afterOpen = await page.evaluate((key) => localStorage.getItem(key), draftKey)
    expect(afterOpen).toContain('Hou hierdie konsep')
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})

function resolveSource(base: string) {
  for (const ext of ['.tsx', '.ts', '.jsx', '.js']) {
    if (existsSync(base + ext)) return base + ext
    if (existsSync(path.join(base, `index${ext}`))) return path.join(base, `index${ext}`)
  }
  return base
}

function listen(server: Server) {
  return new Promise<number>((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      resolve(typeof address === 'object' && address ? address.port : 0)
    })
  })
}
