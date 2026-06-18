import { defineConfig, devices } from '@playwright/test'

const SMOKE_BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://localhost:3001'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    // ── MSW-mocked E2E (Vite dev server) ──
    {
      name: 'setup',
      testMatch: /setup\/.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // ── Full-stack smoke (Docker test stack) ──
    {
      name: 'smoke-setup',
      testMatch: /smoke\/.*\.setup\.ts/,
      use: {
        baseURL: SMOKE_BASE_URL,
      },
    },
    {
      name: 'fullstack-smoke',
      testDir: './e2e/smoke',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: SMOKE_BASE_URL,
        storageState: 'e2e/.auth/smoke-user.json',
      },
      dependencies: ['smoke-setup'],
    },
  ],

  webServer: {
    command: 'pnpm --filter application-material dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})