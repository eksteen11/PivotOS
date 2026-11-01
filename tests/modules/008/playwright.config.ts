import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  testMatch: 'desk.browser.spec.ts',
  timeout: 30_000,
  fullyParallel: false,
  reporter: 'list',
  outputDir: '../../../test-results/008-playwright',
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
})
