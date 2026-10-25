import { expect, test } from '@playwright/test'

// Browser tests use a fresh anonymous context and intercept email/password writes.
// No real account is created, reset email sent, or password changed.
test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/health', (route) => route.fulfill({ json: { ok: true, status: 'ok' } }))
})

test('account pages require sign-in and preserve the requested tab', async ({ page }) => {
  await page.goto('/account?tab=team')
  await expect(page).toHaveURL(/\/login\?next=%2Faccount%3Ftab%3Dteam/)
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible()
})

test('sign-in errors stay visible and allow another attempt', async ({ page }) => {
  await page.route('**/auth/v1/token*', (route) => route.fulfill({ status: 400, json: { error: 'invalid_grant', error_description: 'Invalid login credentials' } }))
  await page.goto('/login')
  await page.getByLabel('Email address', { exact: true }).fill('person@example.com')
  await page.getByLabel('Password', { exact: true }).fill('test-only-password')
  await page.getByRole('button', { name: 'Sign in →', exact: true }).click()
  await expect(page.locator('.account-error[role=alert]')).toContainText('Invalid login credentials')
  await expect(page.getByRole('button', { name: 'Sign in →', exact: true })).toBeEnabled()
})

test('registration checks availability and rejects mismatched passwords', async ({ page }) => {
  await page.route('**/rest/v1/rpc/account_registration_open', (route) => route.fulfill({ json: true }))
  await page.route('**/auth/v1/signup*', () => { throw new Error('Mismatched passwords must never reach Supabase') })
  await page.goto('/register')
  await page.getByLabel('Your name', { exact: true }).fill('Test Person')
  await page.getByLabel('Email address', { exact: true }).fill('person@example.com')
  await page.getByLabel('Password', { exact: true }).fill('a-long-test-password')
  await page.getByLabel('Confirm password', { exact: true }).fill('a-different-test-password')
  await page.getByRole('button', { name: 'Create account →' }).click()
  await expect(page.locator('.account-error[role=alert]')).toContainText('passwords do not match')
})

test('registration fails safely when the database migration is missing', async ({ page }) => {
  await page.route('**/rest/v1/rpc/account_registration_open', (route) => route.fulfill({ status: 404, json: { message: 'Function missing' } }))
  await page.goto('/register')
  await expect(page.getByRole('button', { name: 'Create account →' })).not.toBeVisible()
  await expect(page.locator('.account-error[role=alert]')).toContainText('being set up')
})

test('private registration shows an invitation boundary instead of a signup form', async ({ page }) => {
  await page.route('**/rest/v1/rpc/account_registration_open', (route) => route.fulfill({ json: false }))
  await page.goto('/register')
  await expect(page.getByRole('heading', { name: 'By invitation. By design.' })).toBeVisible()
  await expect(page.getByText('Pivot is private.', { exact: false })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Create account →' })).not.toBeVisible()
})

test('recovery sends the callback destination and shows a private confirmation', async ({ page }) => {
  let recoveryRedirect = ''
  await page.route('**/auth/v1/recover*', (route) => {
    recoveryRedirect = new URL(route.request().url()).searchParams.get('redirect_to') ?? ''
    return route.fulfill({ json: {} })
  })
  await page.goto('/forgot-password')
  await page.getByLabel('Email address', { exact: true }).fill('person@example.com')
  await page.getByRole('button', { name: 'Send reset link' }).click()
  await expect(page.getByRole('status')).toContainText('If an account exists')
  expect(recoveryRedirect).toContain('/auth/callback?next=/reset-password')
})

test('invalid confirmation links cannot redirect to an external website', async ({ page }) => {
  await page.goto('/auth/callback?next=https://example.com')
  await expect(page).toHaveURL(/\/login\?error=link$/)
  await expect(page.locator('.account-error[role=alert]')).toContainText('invalid or has expired')
  await page.goto('/auth/confirm?type=unsupported&token_hash=test&next=//example.com')
  await expect(page).toHaveURL(/\/login\?error=link$/)
})

test('a signed-out visitor cannot submit a new password', async ({ page }) => {
  await page.goto('/reset-password')
  await expect(page.getByRole('button', { name: 'Save new password' })).toBeDisabled()
  await expect(page.locator('.account-error[role=alert]')).toContainText('valid password reset link')
})

test('the preview account menu supports keyboard dismissal and links to sign-in', async ({ page }) => {
  await page.goto('/preview')
  const trigger = page.getByLabel('Open account menu', { exact: true })
  await trigger.click()
  await expect(page.getByRole('link', { name: 'Sign in to your account' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('link', { name: 'Sign in to your account' })).not.toBeVisible()
  await expect(trigger).toBeFocused()
})
