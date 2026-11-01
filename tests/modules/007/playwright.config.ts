import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  outputDir: '../../test-results/module-007-report',
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'logic', testMatch: 'reconciliation.spec.ts' },
    { name: 'chromium-desktop', testMatch: 'desk.spec.ts', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-mobile', testMatch: 'desk.spec.ts', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
})
