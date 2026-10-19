import { test as base, expect } from '@playwright/test'

/**
 * `test` of the mocked e2e specs: fails a test when the page throws an uncaught error.
 * React recovers from an error thrown during a concurrent render by rendering again synchronously,
 * so the final DOM is right and every assertion passes: the error only shows as a `pageerror`.
 */
export const test = base.extend<{ failOnPageError: void }>({
  failOnPageError: [
    async ({ page }, use) => {
      const pageErrors: string[] = []
      page.on('pageerror', error => pageErrors.push(error.stack ?? error.message))
      await use()
      expect(pageErrors, 'uncaught errors thrown by the page').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
