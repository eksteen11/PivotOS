import { expect, test } from '@playwright/test'

test('landing navigation stays visible and section links clear the header', async ({ page }) => {
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Open navigation' })
  if (await toggle.isVisible()) await toggle.click()
  await page.getByRole('navigation', { name: 'Page navigation' }).getByRole('link', { name: 'Your businesses' }).click()
  await expect(page).toHaveURL(/#your-businesses$/)
  const bounds = await page.evaluate(() => ({
    header: document.querySelector('.pivot-landing-header')!.getBoundingClientRect().toJSON(),
    section: document.querySelector('#your-businesses')!.getBoundingClientRect().toJSON(),
    scrollWidth: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }))
  expect(Math.abs(bounds.header.top)).toBeLessThan(1)
  expect(bounds.section.top).toBeGreaterThanOrEqual(bounds.header.bottom)
  expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.viewport)
})

test('workflow keeps business context through planning, review and follow-through', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'FF Farm Feed', exact: true }).click()
  await expect(page.locator('.pl-scene')).toContainText('oat hay')
  await page.getByRole('button', { name: '02 Plan', exact: true }).click()
  await expect(page.locator('.pl-scene')).toContainText('Match the enquiry to supply')
  await page.getByRole('button', { name: '03 Review', exact: true }).click()
  await expect(page.locator('.pl-scene')).toContainText('Nothing is sent from this demonstration.')
  await page.getByRole('button', { name: 'Preview next workflow step' }).click()
  await expect(page.locator('.pl-scene')).toContainText('Awaiting review')
  await expect(page.locator('.pl-scene')).toContainText('Confirm quantity and quality')
})

test('reduced motion uses a stable, manually controlled workflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Pause workflow animation' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: '01 Capture', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Preview next workflow step' }).click()
  await expect(page.getByRole('button', { name: '02 Plan', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.pl-demo-foot')).toContainText('still being built')
})

test('cinematic workflow advances faster and pauses on a readable scene', async ({ page }) => {
  await page.goto('/')
  await page.locator('.pl-theater').scrollIntoViewIfNeeded()
  const capture = page.getByRole('button', { name: '01 Capture', exact: true })
  const plan = page.getByRole('button', { name: '02 Plan', exact: true })
  await capture.click()
  await page.getByRole('button', { name: 'Play workflow animation' }).click()
  await expect(plan).toHaveAttribute('aria-pressed', 'true', { timeout: 4000 })
  await page.getByRole('button', { name: 'Pause workflow animation' }).click()
  await expect(page.locator('.pl-theater')).toHaveAttribute('data-running', 'false')
  await expect(page.locator('.pl-cinema-screen')).toHaveCSS('animation-name', 'none')
  await page.waitForTimeout(2900)
  await expect(plan).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.pl-cinema-screen')).toBeVisible()
})

test('road cards reveal an accessible action and open the matching scene', async ({ page, isMobile }) => {
  await page.goto('/')
  const card = page.getByRole('article', { name: 'Review workflow', exact: true })
  await card.scrollIntoViewIfNeeded()
  const action = card.getByRole('button', { name: 'Explore Review example', exact: true })
  if (!isMobile) {
    await card.hover()
    await expect(card.locator('.pl-road-word').first()).toHaveCSS('opacity', '0')
  }
  await expect(action).toBeVisible()
  await action.click()
  await expect(page.getByRole('button', { name: '03 Review', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.pl-cinema-screen')).toContainText('Ready for your judgement.')
  await expect(page.locator('.pl-theater')).toHaveAttribute('data-running', 'false')
})

test('road word movement pauses and reduced motion keeps the descriptions readable', async ({ page }) => {
  await page.goto('/')
  await page.locator('.pl-road-experience').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Pause moving words', exact: true }).click()
  await expect(page.locator('.pl-road-experience')).toHaveAttribute('data-moving', 'false')
  await expect(page.locator('.pl-road-cargo').first()).toHaveCSS('animation-play-state', 'paused')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.getByRole('button', { name: 'Play moving words', exact: true })).toHaveCount(0)
  const card = page.getByRole('article', { name: 'Capture workflow', exact: true })
  await card.hover()
  await expect(card.locator('.pl-road-word').first()).toHaveCSS('opacity', '1')
  await expect(card.getByRole('button', { name: 'Explore Capture example' })).toBeVisible()
})
