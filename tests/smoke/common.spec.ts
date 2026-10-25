import { expect, test } from '@playwright/test'

const smokeMode = process.env.SMOKE_MODE === 'local' ? 'local' : 'production'

test('landing renders with loaded styles', async ({ page }) => {
  const cssResponsePromise = page.waitForResponse(
    (response) => response.url().includes('/_next/static/css/') && response.status() === 200,
  )
  await page.goto('/', { waitUntil: 'networkidle' })
  await cssResponsePromise

  const heroStyles = await page.getByRole('heading', { level: 1 }).evaluate((el) => {
    const style = window.getComputedStyle(el)
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
    }
  })
  expect(heroStyles.fontFamily.toLowerCase()).not.toContain('times')
  expect(parseFloat(heroStyles.fontSize)).toBeGreaterThan(32)

  await expect(page.locator('.pivot-landing-header-inner')).toHaveCSS('display', 'flex')
  const signIn = page.getByRole('banner').getByRole('link', { name: 'Sign in', exact: true })
  if (!(await signIn.isVisible())) await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await expect(signIn).toBeVisible()
})

test('preview sample workflow supports approval action', async ({ page }) => {
  await page.goto('/preview', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /cp van der merwe/i }).click()
  await page.getByRole('button', { name: /approve work plan/i }).click()
  await expect(page.locator('.pivot-status.is-in_progress')).toContainText(/in progress/i)
})

test('auth service health is operational', async ({ request, baseURL }) => {
  test.skip(smokeMode === 'local', 'Local smoke runs without guaranteed Supabase env.')
  if (!baseURL) throw new Error('Base URL is required for smoke tests.')
  const response = await request.get(new URL('/api/auth/health', baseURL).toString(), { timeout: 10_000 })
  const body = (await response.json()) as { ok?: boolean; status?: string }
  expect(response.status()).toBe(200)
  expect(body.ok).toBe(true)
  expect(body.status).toBe('ok')
})

test('protected route redirects anonymous users to login', async ({ page }) => {
  test.skip(smokeMode === 'local', 'Local smoke runs without guaranteed Supabase auth wiring.')
  await page.goto('/today', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/login(\?|$)/)
})

test('anonymous api writes are rejected', async ({ request, baseURL }) => {
  test.skip(smokeMode === 'local', 'Local smoke runs without guaranteed Supabase env.')
  if (!baseURL) throw new Error('Base URL is required for smoke tests.')
  const response = await request.post(new URL('/api/work', baseURL).toString(), { data: {} })
  expect(response.status()).toBe(401)
})
