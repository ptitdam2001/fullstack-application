import { test, expect } from '@playwright/test'

test.describe('smoke — navigation', () => {
  test('dashboard loads', async ({ page }) => {
    await page.goto('/app')

    await expect(page).toHaveURL(/\/app/)
  })

  test('teams page loads', async ({ page }) => {
    await page.goto('/app/team/list')

    await expect(page.getByTestId('TeamList')).toBeVisible({ timeout: 15_000 })
  })

  test('games page loads', async ({ page }) => {
    await page.goto('/app/games')

    await expect(page).toHaveURL(/\/app\/games/)
  })

  test('admin users page loads', async ({ page }) => {
    await page.goto('/app/admin/users')

    await expect(page).toHaveURL(/\/admin\/users/)
  })

  test('calendar page loads', async ({ page }) => {
    await page.goto('/app/calendar')

    await expect(page).toHaveURL(/\/app\/calendar/)
  })
})
