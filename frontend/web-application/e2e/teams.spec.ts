import { test, expect } from './fixtures/test'

// These tests run with the storageState from setup/auth.setup.ts (admin user)

test.describe('teams — list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/team/list')
  })

  test('renders the teams list container', async ({ page }) => {
    await expect(page.getByTestId('TeamList')).toBeVisible()
  })

  test('MSW returns teams — at least one team card visible', async ({ page }) => {
    // MSW mock always returns mockCoachTeam + random teams
    const teamsContainer = page.getByLabel('Teams')
    await expect(teamsContainer).toBeVisible()
    // At least one View button per team card
    await expect(page.getByLabel('View').first()).toBeVisible()
  })

  test('view mode toggles between grid and list', async ({ page }) => {
    await page.getByRole('button', { name: 'List view' }).click()
    await expect(page.getByLabel('Teams')).toBeVisible()

    await page.getByRole('button', { name: 'Grid view' }).click()
    await expect(page.getByLabel('Teams')).toBeVisible()
  })

  test('create team button navigates to create form', async ({ page }) => {
    await page.getByRole('link', { name: 'Create Team' }).click()
    await expect(page).toHaveURL(/\/create/)
  })
})
