import { expect, test } from '@playwright/test'

// All email requests are intercepted: this suite never sends real email.
test('recovery cooldown prevents duplicate sends and survives correcting the address', async ({ page }) => {
  let sends = 0
  await page.route('**/auth/v1/recover*', route => { sends++; return route.fulfill({ json: {} }) })
  await page.goto('/forgot-password')
  await page.getByLabel('Email address', { exact: true }).fill('typo@example.com')
  await page.getByRole('button', { name: 'Send reset link', exact: true }).click()
  await expect(page.getByRole('status')).toBeFocused()
  if (test.info().project.name === 'chromium-desktop') await page.screenshot({ path: '.verify-auth-recovery-hardened.png', fullPage: true })
  await expect(page.getByRole('button', { name: /Try again in/ })).toBeDisabled()
  await page.getByRole('button', { name: 'Use a different email address' }).click()
  await expect(page.getByLabel('Email address', { exact: true })).toBeFocused()
  await page.getByLabel('Email address', { exact: true }).fill('correct@example.com')
  await expect(page.getByRole('button', { name: /Try again in/ })).toBeDisabled()
  expect(sends).toBe(1)
})

test('provider failures show a private retry message instead of sensitive details', async ({ page }) => {
  await page.route('**/auth/v1/recover*', route => route.fulfill({ status: 500, json: { msg: 'SMTP credentials invalid for person@example.com' } }))
  await page.goto('/forgot-password')
  await page.getByLabel('Email address', { exact: true }).fill('person@example.com')
  await page.getByRole('button', { name: 'Send reset link', exact: true }).click()
  await expect(page.locator('.account-error[role=alert]')).toContainText('try again shortly')
  await expect(page.locator('.account-error[role=alert]')).not.toContainText('SMTP')
  await expect(page.getByRole('button', { name: /Try again in/ })).toBeDisabled()
})

test('anonymous second-factor route returns to sign-in with a safe destination', async ({ page }) => {
  await page.route('**/api/auth/health', route => route.fulfill({ json: { ok: true } }))
  await page.goto('/verify?next=https://example.com')
  await expect(page).toHaveURL(/\/login\?next=%2Ftoday$/)
})
