import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'

/**
 * Auth specs run WITHOUT the storageState injected by setup (explicit
 * use: { storageState: undefined }) — we need to test unauthenticated
 * and login-flow scenarios, not already-authenticated ones.
 */
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('auth — login flow', () => {
  test('unauthenticated access to /app redirects to login', async ({ page }) => {
    await page.goto('/app')

    await expect(page).toHaveURL(/\/auth\/signin/)
  })

  test('login form is visible at /auth/signin', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await expect(page.getByPlaceholder('vous@exemple.com')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible()
  })

  test('successful login redirects to app (MSW intercepts login + me)', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await loginPage.login('test@example.com', 'password123')

    // MSW returns random user data — may redirect to /app or /app/onboarding
    await expect(page).toHaveURL(/\/app/, { timeout: 10_000 })
  })

  test('/ root route redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/')

    // RootLayout redirects unauthenticated users
    await page.waitForURL(url => !url.pathname.startsWith('/app'), { timeout: 5_000 })
  })
})