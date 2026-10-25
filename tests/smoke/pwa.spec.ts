import { expect, test } from '@playwright/test'

test('install metadata supplies phone icons and a scoped standalone app', async ({ request, page }, testInfo) => {
  const response = await request.get('/manifest.webmanifest')
  expect(response.ok()).toBe(true)
  const manifest = await response.json()
  expect(manifest).toMatchObject({ id: '/', scope: '/', start_url: '/today', display: 'standalone' })
  for (const icon of manifest.icons) {
    const response = await request.get(icon.src)
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('image/png')
    const bytes = await response.body()
    const size = Number(icon.sizes.split('x')[0])
    expect(bytes.readUInt32BE(16)).toBe(size)
    expect(bytes.readUInt32BE(20)).toBe(size)
  }
  await page.goto('/install')
  await expect(page.getByRole('heading', { name: 'iPhone or iPad' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Android' })).toBeVisible()
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('install.png'), fullPage: true })
  const worker = await request.get('/sw.js')
  expect(worker.headers()['cache-control']).toContain('no-store')
})

test('offline navigation shows a reconnect screen without caching private pages or API data', async ({ page, context }, testInfo) => {
  await page.goto('/install')
  // Exercise the production worker even when this spec targets a dev server.
  await page.evaluate(async () => {
    await navigator.serviceWorker.register('/sw.js', { scope: '/' })
    await navigator.serviceWorker.ready
  })
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true)
  await page.goto('/today')
  await page.evaluate(() => fetch('/api/auth/health'))
  const cachedURLs = await page.evaluate(async () => {
    const keys = await caches.keys()
    const urls: string[] = []
    for (const key of keys.filter((key) => key.startsWith('pivot-offline-'))) {
      const cache = await caches.open(key)
      urls.push(...(await cache.keys()).map((request) => new URL(request.url).pathname))
    }
    return urls
  })
  expect(cachedURLs).toEqual(['/offline.html'])
  await context.setOffline(true)
  try {
    await page.goto('/today')
    await expect(page.getByRole('heading', { name: "Let's reconnect." })).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('offline.png'), fullPage: true })
    expect(await page.evaluate(async () => {
      try { await fetch('/api/work'); return true } catch { return false }
    })).toBe(false)
  } finally {
    await context.setOffline(false)
  }
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByRole('heading', { name: "Let's reconnect." })).toHaveCount(0)
})
