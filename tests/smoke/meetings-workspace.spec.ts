import { createServer, type Server } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'

test('meeting workspace keeps the request separate and accepts a spoken reply on a phone', async ({ page }) => {
  await esbuild.build({
    entryPoints: ['tests/smoke/support/meeting-workspace-harness.tsx'],
    bundle: true,
    outfile: 'test-results/meeting-workspace.js',
    format: 'iife',
    platform: 'browser',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"development"' },
    alias: { 'next/link': path.join(process.cwd(), 'tests/smoke/support/test-link.tsx') },
    plugins: [{
      name: 'at-alias',
      setup(build) {
        build.onResolve({ filter: /^@\// }, (args) => ({ path: resolveSource(path.join(process.cwd(), args.path.slice(2))) }))
      },
    }],
  })
  const script = readFileSync('test-results/meeting-workspace.js')
  const server = createServer((request, response) => {
    if (request.url?.startsWith('/app.js')) {
      response.setHeader('content-type', 'text/javascript')
      response.end(script)
      return
    }
    if (request.url?.startsWith('/pivot.css')) {
      response.setHeader('content-type', 'text/css')
      response.end(readFileSync('app/pivot.css'))
      return
    }
    response.setHeader('content-type', 'text/html')
    response.end('<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/pivot.css"></head><body style="margin:0"><div id="root"></div><script src="/app.js"></script></body></html>')
  })
  const port = await listen(server)
  try {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`http://127.0.0.1:${port}/`)
    await expect(page.getByRole('heading', { name: 'Listing visit' })).toBeVisible()
    await expect(page.locator('.meeting-badge', { hasText: 'Northpoint Realty' })).toBeVisible()
    await expect(page.getByText('To arrange', { exact: true })).toBeVisible()
    await expect(page.getByText('No date saved', { exact: true })).toBeVisible()
    await expect(page.locator('.meeting-badge', { hasText: '08:00' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Original request' })).toBeVisible()
    await expect(page.locator('a[href*="intake/source"]')).toHaveCount(0)
    await expect(page.getByText('The original request is not used as minutes.')).toBeVisible()
    await expect(page.getByLabel(/Add the exact date|Add anything still missing/)).toBeVisible()
    await expect(page.locator('input[type="datetime-local"]:visible')).toHaveCount(0)
    const followUp = page.getByRole('tab', { name: 'Follow-up' })
    await expect(followUp).toBeVisible()
    const followUpBox = await followUp.boundingBox()
    expect(followUpBox && followUpBox.x >= 0 && followUpBox.x + followUpBox.width <= 391).toBe(true)
    await page.screenshot({ path: `test-results/meeting-phone-${test.info().project.name}.png`, fullPage: true })
    await page.getByRole('tab', { name: 'Minutes' }).click()
    await page.getByRole('button', { name: 'Draft minutes from the meeting' }).click()
    await expect(page.getByRole('alert')).toContainText('original request is not minutes')
    const calls = await page.evaluate(() => (window as unknown as { meetingCalls: { url: string }[] }).meetingCalls)
    expect(calls.some((call) => call.url.includes('/api/intake/source'))).toBe(false)
    await page.getByRole('tab', { name: 'Overview' }).click()
    await page.getByRole('button', { name: 'Original request' }).click()
    await expect(page.getByRole('dialog', { name: 'Original request' })).toContainText('Ruan called about the listing.')
    await expect(page.getByRole('dialog', { name: 'Original request' })).not.toContainText('transcriptMetadata')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
    expect(overflow).toBe(true)
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(`http://127.0.0.1:${port}/?flow=1`)
    await expect(page.getByRole('heading', { name: 'Listing visit' })).toBeVisible()
    await page.screenshot({ path: `test-results/meeting-desktop-${test.info().project.name}.png`, fullPage: true })
    await page.getByRole('tab', { name: 'Live notes' }).click()
    await page.getByLabel('Live notes').fill('Price agreed')
    await page.getByRole('tab', { name: 'Minutes' }).click()
    await page.getByRole('button', { name: 'Draft minutes from the meeting' }).click()
    await expect(page.getByText('Prices were discussed.')).toBeVisible()
    await page.getByRole('tab', { name: 'Live notes' }).click()
    await page.getByLabel('Live notes').fill('Price agreed and ages')
    await page.getByRole('tab', { name: 'Follow-up' }).click()
    await page.getByRole('button', { name: 'Approve reviewed follow-up' }).click()
    const workLink = page.getByRole('link', { name: 'Confirm prices' })
    await expect(workLink).toHaveAttribute('href', '/today?view=work&work=bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee')
    await expect(page.getByText('Needs approval')).toBeVisible()
    expect(await page.locator('a[href*="/processes"]').count()).toBe(0)
    await expect(page.getByText(/Saved work [0-9a-f-]{36}/)).toHaveCount(0)
    const saved = await page.evaluate(() => (window as unknown as { meetingCalls: { url: string; updatedAt: string }[] }).meetingCalls)
    const kinds = saved.map((call) => call.url.includes('/minutes') ? 'minutes' : call.url.includes('/approve') ? 'approve' : 'notes')
    expect(kinds).toEqual(['notes', 'minutes', 'notes', 'approve'])
    expect(saved[0].updatedAt).toBe('2026-10-21T12:00:00.000Z')
    expect(saved[1].updatedAt).toBe('2026-10-21T12:00:01.000Z')
    expect(saved[2].updatedAt).toBe('2026-10-21T12:00:02.000Z')
    expect(saved[3].updatedAt).toBe('2026-10-21T12:00:03.000Z')
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
