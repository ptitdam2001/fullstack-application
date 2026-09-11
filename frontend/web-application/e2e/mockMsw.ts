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
  await page.evaluate(overrideArgs => window.__mswApplyOverride?.(...overrideArgs), args)
}
