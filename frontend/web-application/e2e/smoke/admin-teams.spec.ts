import { test, expect } from '@playwright/test'

test.describe('smoke — admin teams', () => {
  test('admin teams page loads with table', async ({ page }) => {
    await page.goto('/app/admin/teams')

    await expect(page.locator('table')).toBeVisible({ timeout: 15_000 })
  })

  test('table displays seed team data', async ({ page }) => {
    await page.goto('/app/admin/teams')

    await expect(page.locator('table')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText('Équipe Test')).toBeVisible()
  })

  test('create team dialog opens via URL', async ({ page }) => {
    await page.goto('/app/admin/teams/create')

    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })
  })

  test('create team with name and color, verify it appears in table', async ({ page }) => {
    const teamName = `Smoke-Admin-${Date.now()}`

    await page.goto('/app/admin/teams/create')
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })

    const nameInput = page.getByTestId('team-form.name.input')
    await nameInput.click()
    await nameInput.pressSequentially(teamName)

    const colorTrigger = page.locator('.ColorInput button')
    await colorTrigger.click()
    await expect(page.locator('.react-colorful')).toBeVisible({ timeout: 3_000 })
    await page.locator('.react-colorful__saturation').click({ position: { x: 80, y: 40 } })

    await expect(page.getByRole('button', { name: 'Create' })).toBeEnabled({ timeout: 5_000 })
    await page.getByRole('button', { name: 'Create' }).click()

    await page.goto('/app/admin/teams')
    await expect(page.getByText(teamName)).toBeVisible({ timeout: 15_000 })
  })
})
