import { test, expect } from './fixtures/test'
import { LoginPage } from './pages/LoginPage'
import { mockMsw } from './mockMsw'

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

    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('successful login redirects to app (MSW intercepts login + me)', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await loginPage.login('test@example.com', 'password123')

    // MSW returns random user data — may redirect to /app or /app/onboarding
    await expect(page).toHaveURL(/\/app/, { timeout: 10_000 })
  })

  test('wrong password keeps the sign-in form: toast shown, no page reload', async ({ page }) => {
    await mockMsw(page, 'post', '*/login', { status: 401, message: 'Email ou mot de passe incorrect' }, 401)
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    // A reload of the page would wipe this marker: the 401 interceptor must leave the sign-in to the form
    await page.evaluate(() => {
      ;(window as Window & { __noReload?: boolean }).__noReload = true
    })

    await loginPage.login('test@example.com', 'WrongPassw0rd')

    await expect(page.getByText('Incorrect email or password.')).toBeVisible()
    await expect(page).toHaveURL(/\/auth\/signin/)
    expect(await page.evaluate(() => (window as Window & { __noReload?: boolean }).__noReload)).toBe(true)
  })

  test('/ root route redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/')

    // RootLayout redirects unauthenticated users
    await page.waitForURL(url => !url.pathname.startsWith('/app'), { timeout: 5_000 })
  })
})
