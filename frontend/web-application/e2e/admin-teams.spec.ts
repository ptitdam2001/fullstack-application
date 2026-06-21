import { test, expect } from '@playwright/test'

test.describe('admin — teams management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/admin/teams')
  })

  test('admin teams page loads with table', async ({ page }) => {
    await expect(page).toHaveURL(/\/app\/admin\/teams/)
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
  })

  test('table displays team rows from MSW data', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
  })

  test('create button navigates to /create dialog', async ({ page }) => {
    await page.getByText('adminTeams.action.create').click()
    await expect(page).toHaveURL(/\/app\/admin\/teams\/create/)
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
  })

  test('edit button navigates to /:teamId/edit dialog', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const editButtons = page.getByLabel('adminTeams.action.edit')
    await expect(editButtons.first()).toBeVisible()
    await editButtons.first().click()
    await expect(page).toHaveURL(/\/app\/admin\/teams\/.*\/edit/)
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
  })

  test('delete button navigates to /:teamId/delete dialog', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const deleteButtons = page.getByLabel('adminTeams.action.delete')
    await expect(deleteButtons.first()).toBeVisible()
    await deleteButtons.first().click()
    await expect(page).toHaveURL(/\/app\/admin\/teams\/.*\/delete/)
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
  })

  test('delete dialog has confirm and cancel buttons', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    await page.getByLabel('adminTeams.action.delete').first().click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('adminTeams.delete.confirm')).toBeVisible()
    await expect(page.getByText('adminTeams.delete.cancel')).toBeVisible()
  })

  test('cancel delete returns to teams list', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    await page.getByLabel('adminTeams.action.delete').first().click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await page.getByText('adminTeams.delete.cancel').click()
    await expect(page).toHaveURL(/\/app\/admin\/teams$/)
  })

  test('direct URL /app/admin/teams/create opens create dialog', async ({ page }) => {
    await page.goto('/app/admin/teams/create')
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
  })

  test('create team — full workflow: open dialog, fill name, pick color, submit', async ({ page }) => {
    const teamName = `E2E-Admin-${Date.now()}`

    await page.goto('/app/admin/teams/create')
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })

    const nameInput = page.getByTestId('team-form.name.input')
    await nameInput.click()
    await nameInput.fill(teamName)

    const colorTrigger = page.locator('.ColorInput button')
    await colorTrigger.click()
    const colorPicker = page.locator('.react-colorful')
    await expect(colorPicker).toBeVisible({ timeout: 3_000 })
    await page.locator('.react-colorful__saturation').click({ position: { x: 80, y: 40 } })

    await expect(page.getByRole('button', { name: 'Create' })).toBeEnabled({ timeout: 5_000 })
    await page.getByRole('button', { name: 'Create' }).click()

    await expect(page).toHaveURL(/\/app\/admin\/teams$/, { timeout: 10_000 })
  })
})
