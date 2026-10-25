import { createServer } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import esbuild from 'esbuild'
import { test, expect } from '@playwright/test'

test.use({ launchOptions: { args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] } })

test('real browser audio pauses, stays active across views and recovers an interrupted upload after reload', async ({ page }) => {
  await esbuild.build({ entryPoints: ['tests/smoke/support/meeting-recording-harness.tsx'], bundle: true, outfile: 'test-results/meeting-recording.js', format: 'iife', platform: 'browser', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"development"' }, plugins: [{ name: 'at', setup(build) {
    build.onResolve({ filter: /^@\// }, (args) => {
      const base = path.join(process.cwd(), args.path.slice(2))
      return { path: ['.tsx', '.ts'].map((extension) => base + extension).find(existsSync) ?? base }
    })
  } }] })
  const script = readFileSync('test-results/meeting-recording.js')
  const server = createServer((request, response) => {
    if (request.url === '/app.js') { response.setHeader('Content-Type', 'text/javascript'); response.end(script); return }
    if (request.url === '/pivot.css') { response.setHeader('Content-Type', 'text/css'); response.end(readFileSync('app/pivot.css')); return }
    response.setHeader('Content-Type', 'text/html')
    response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/pivot.css"><div id="root"></div><script src="/app.js"></script>')
  })
  const port = await new Promise<number>((resolve) => server.listen(0, '127.0.0.1', () => { const address = server.address(); resolve(typeof address === 'object' && address ? address.port : 0) }))
  try {
    await page.goto(`http://127.0.0.1:${port}/?offline=1`)
    await expect(page.getByRole('button', { name: 'Start recording' })).toBeDisabled()
    await page.getByLabel('Everyone present has agreed to recording').check()
    await expect(page.getByRole('button', { name: 'Start recording' })).toBeEnabled()
    await page.getByRole('button', { name: 'Start recording' }).click()
    await expect(page.getByRole('button', { name: 'Pause recording' })).toBeEnabled()
    await page.getByRole('button', { name: 'Switch view' }).click()
    await expect(page.getByRole('button', { name: 'Pause recording' })).not.toBeVisible()
    await page.getByRole('button', { name: 'Switch view' }).click()
    await expect(page.getByRole('button', { name: 'Pause recording' })).toBeVisible()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: 'Pause recording' }).click()
    await expect(page.getByRole('button', { name: 'Resume recording' })).toBeEnabled()
    await page.getByRole('button', { name: 'Resume recording' }).click()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: 'Stop and save recording' }).click()
    await expect(page.getByRole('alert')).toContainText('Connection dropped')
    await expect(page.getByRole('button', { name: 'Recover saved recording' })).toBeEnabled()
    await page.goto(`http://127.0.0.1:${port}/`)
    await expect(page.getByRole('button', { name: 'Recover saved recording' })).toBeEnabled()
    await page.getByRole('button', { name: 'Recover saved recording' }).click()
    await expect(page.getByRole('button', { name: 'Recover saved recording' })).toHaveCount(0)
    await expect(page.getByText(/Audio saved/)).toBeVisible()
    const uploads = await page.evaluate(() => (window as unknown as { uploads: { sequence: number; size: number; type: string }[] }).uploads)
    expect(uploads.map((item) => item.sequence)).toEqual([0, 1])
    expect(uploads.every((item) => item.size > 100 && item.type === 'audio/webm')).toBe(true)
    await page.screenshot({ path: `test-results/meeting-recording-recovered-${test.info().project.name}.png`, fullPage: true })
  } finally { await new Promise<void>((resolve) => server.close(() => resolve())) }
})
