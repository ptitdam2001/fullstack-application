import { test as setup } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const AUTH_FILE = path.join(__dirname, '../.auth/user.json')

/**
 * Injects a pre-built auth state directly into localStorage, bypassing the
 * login UI. The app's CheckAuthentication guard only checks that `user` is
 * truthy in localStorage['user'] — no real JWT validation on the frontend.
 * MSW intercepts all subsequent API calls, so the token value is irrelevant.
 */
setup('inject auth state', async ({ page }) => {
  await page.goto('/')

  await page.evaluate(() => {
    const authData = {
      token: 'e2e-test-token',
      user: {
        id: '000000000000000000000001',
        email: 'admin@e2e.local',
        firstName: 'Admin',
        lastName: 'E2E',
        isAdmin: true,
        isActive: true,
        isBlocked: false,
        isReferee: false,
        roles: ['ADMIN'],
      },
    }
    localStorage.setItem('user', JSON.stringify(authData))
  })

  await page.context().storageState({ path: AUTH_FILE })
})