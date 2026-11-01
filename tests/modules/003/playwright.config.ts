import path from 'node:path'
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  outputDir: path.join(process.cwd(), 'test-results/modules-003'),
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } },
})
