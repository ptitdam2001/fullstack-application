import { test as base, expect, type ConsoleMessage } from '@playwright/test'

// Chromium logs every HTTP error response itself: an error-path test makes MSW answer 4xx or 5xx on purpose.
const isHttpErrorLog = (message: ConsoleMessage) =>
  message.type() === 'error' &&
  message.text().startsWith('Failed to load resource: the server responded with a status of')

const isWarningOrError = (message: ConsoleMessage) =>
  (message.type() === 'warning' || message.type() === 'error') && !isHttpErrorLog(message)

/**
 * `test` of the mocked e2e specs: fails a test when the page throws an uncaught error, or writes a
 * warning or an error to its console.
 * React recovers from an error thrown during a concurrent render by rendering again synchronously,
 * and react-aria only warns about a missing accessible name: the final DOM is right and every
 * assertion passes, so these only show as a `pageerror` or a console message.
 */
export const test = base.extend<{ failOnPageError: void }>({
  failOnPageError: [
    async ({ page }, use) => {
      const pageErrors: string[] = []
      const consoleMessages: string[] = []
      page.on('pageerror', error => pageErrors.push(error.stack ?? error.message))
      page.on('console', message => {
        if (isWarningOrError(message)) {
          consoleMessages.push(`[${message.type()}] ${message.text()}`)
        }
      })
      await use()
      expect(pageErrors, 'uncaught errors thrown by the page').toEqual([])
      expect(consoleMessages, 'warnings and errors written to the console').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
