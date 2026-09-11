import { http, HttpResponse, type JsonBodyType } from 'msw'
import type { SetupWorker } from 'msw/browser'

export type MswOverrideMethod = 'get' | 'post' | 'patch' | 'delete' | 'put'
export type MswOverrideArgs = [method: MswOverrideMethod, path: string, body: JsonBodyType, status?: number]

declare global {
  interface Window {
    __mswOverrideQueue?: MswOverrideArgs[]
    __mswApplyOverride?: (...args: MswOverrideArgs) => void
  }
}

const applyOverride = (
  worker: SetupWorker,
  method: MswOverrideMethod,
  path: string,
  body: JsonBodyType,
  status = 200
) => {
  worker.use(http[method](path, () => HttpResponse.json(body, { status })))
}

// e2e-only: lets Playwright tests queue deterministic MSW response overrides via page.addInitScript
// (queued before this module runs) or window.__mswApplyOverride directly (once drained below).
// MSW's Service Worker responds to requests before they reach Playwright's network-level page.route(),
// so route() interception alone cannot make these mocked responses deterministic — this bridges that gap.
export const exposeE2eOverrides = (worker: SetupWorker) => {
  window.__mswApplyOverride = (...args) => applyOverride(worker, ...args)
  const queued = window.__mswOverrideQueue ?? []
  queued.forEach(args => window.__mswApplyOverride?.(...args))
}
