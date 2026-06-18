import { test, expect } from '@playwright/test'

test.describe('smoke — teams', () => {
  test('teams list page loads and shows seed team', async ({ page }) => {
    await page.goto('/app/team/list')

    await expect(page.getByTestId('TeamList')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText('Équipe Test')).toBeVisible()
  })

  test('create team and verify it appears in list', async ({ page }) => {
    const teamName = `Smoke-${Date.now()}`

    await page.goto('/app/team/list/create')
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })

    await page.getByLabel(/nom/i).fill(teamName)
    await page.getByRole('button', { name: /créer|enregistrer|valider/i }).click()

    await page.goto('/app/team/list')
    await expect(page.getByText(teamName)).toBeVisible({ timeout: 15_000 })
  })
})
