import { defineConfig, devices } from '@playwright/test'

// Playwright 1.51 requires this flag to apply offline emulation to service workers.
process.env.PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS = '1'

const baseURL = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000'

export default defineConfig({
  testDir: './tests/smoke',
  timeout: 30_000,
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
      },
    },
  ],
})
