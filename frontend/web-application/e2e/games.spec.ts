import { test, expect } from '@playwright/test'

// These tests run with the storageState from setup/auth.setup.ts (admin user)

test.describe('games — list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/games')
  })

  test('renders the games list container', async ({ page }) => {
    await expect(page.getByTestId('GameList')).toBeVisible()
  })

  test('navigating to a game detail shows the correct URL', async ({ page }) => {
    await page.goto('/app/games/000000000000000000000001')

    await expect(page).toHaveURL(/\/games\/000000000000000000000001/)
  })
})