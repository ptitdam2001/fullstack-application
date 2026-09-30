import type { Page } from '@playwright/test'
import type { MswOverrideArgs } from '../src/mocks/e2eOverrides'

// Queues a deterministic MSW response override, applied once the app's Service Worker is ready
// (see src/mocks/e2eOverrides.ts). Must be called before page.goto() — page.addInitScript runs
// before any of the page's own scripts, so the queue is populated before enableMocking() drains it.
export const mockMsw = async (page: Page, ...args: MswOverrideArgs) => {
  await page.addInitScript(overrideArgs => {
    window.__mswOverrideQueue = window.__mswOverrideQueue ?? []
    window.__mswOverrideQueue.push(overrideArgs)
  }, args)
}

// For overrides added mid-test, after the app has already booted (window.__mswApplyOverride
// exists by then) — e.g. mocking a PATCH response right before triggering the action that fires it.
export const applyMswOverride = async (page: Page, ...args: MswOverrideArgs) => {
  // page.goto() resolves on `load`, before main.tsx has awaited worker.start() and exposed the
  // bridge — wait for it, and call it without `?.` so a missing bridge fails instead of no-op'ing.
  await page.waitForFunction(() => typeof window.__mswApplyOverride === 'function', undefined, { timeout: 5_000 })
  await page.evaluate(overrideArgs => window.__mswApplyOverride!(...overrideArgs), args)
}
