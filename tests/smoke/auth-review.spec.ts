import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/health', (route) => route.fulfill({ json: { ok: true, status: 'ok' } }))
})

test('account entry pages fit the viewport and have one clear page heading', async ({ page }) => {
  for (const path of ['/login', '/register', '/forgot-password', '/reset-password']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    const size = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }))
    expect(size.content, path).toBeLessThanOrEqual(size.viewport)
    await expect(page.getByRole('link', { name: 'Pivot OS home' })).toBeVisible()
  }
})

test('password visibility is keyboard operable and keeps the entered value', async ({ page }) => {
  await page.goto('/login')
  const password = page.getByLabel('Password', { exact: true })
  await password.fill('Only-a-dummy-review-value')
  await expect(password).toHaveAttribute('type', 'password')
  const reveal = page.getByLabel('Show password', { exact: true })
  await reveal.focus()
  await page.keyboard.press('Space')
  await expect(password).toHaveAttribute('type', 'text')
  await expect(password).toHaveValue('Only-a-dummy-review-value')
  await page.getByLabel('Hide password', { exact: true }).click()
  await expect(password).toHaveAttribute('type', 'password')
})
