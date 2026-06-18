import { test, expect } from '@playwright/test'

test.describe('smoke — auth', () => {
  test('authenticated user lands on dashboard', async ({ page }) => {
    await page.goto('/app')

    await expect(page).toHaveURL(/\/app/)
    await expect(page.locator('body')).not.toHaveText(/signin/)
  })

  test('logout redirects to login page', async ({ page }) => {
    await page.goto('/auth/logout')

    await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 10_000 })
  })
})
