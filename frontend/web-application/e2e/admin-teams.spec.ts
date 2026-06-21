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
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    await page.locator('header button', { hasText: /team|équipe/i }).click()
    await expect(page).toHaveURL(/\/app\/admin\/teams\/create/)
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
  })

  test('edit button opens edit dialog', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const editButtons = page.locator('tbody tr').first().locator('button').first()
    await editButtons.click()
    await expect(page).toHaveURL(/\/app\/admin\/teams\/.*\/edit/)
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
  })

  test('delete button opens delete dialog', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const deleteButton = page.locator('tbody tr').first().locator('button').nth(1)
    await deleteButton.click()
    await expect(page).toHaveURL(/\/app\/admin\/teams\/.*\/delete/)
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
  })

  test('delete dialog has confirm and cancel buttons', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const deleteButton = page.locator('tbody tr').first().locator('button').nth(1)
    await deleteButton.click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    const dialogFooterButtons = page.getByRole('dialog').locator('[data-slot="dialog-footer"] button')
    await expect(dialogFooterButtons).toHaveCount(2)
  })

  test('cancel delete returns to teams list', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const deleteButton = page.locator('tbody tr').first().locator('button').nth(1)
    await deleteButton.click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    const cancelButton = page.getByRole('dialog').locator('button').first()
    await cancelButton.click()
    await expect(page).toHaveURL(/\/app\/admin\/teams$/)
  })

  test('direct URL /app/admin/teams/create opens create dialog', async ({ page }) => {
    await page.goto('/app/admin/teams/create')
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
  })

  test('create team — fill name and submit', async ({ page }) => {
    const teamName = `E2E-Admin-${Date.now()}`

    await page.goto('/app/admin/teams/create')
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })

    const nameInput = page.getByTestId('team-form.name.input')
    await nameInput.click()
    await nameInput.pressSequentially(teamName)

    const submitButton = page.getByRole('dialog').locator('button[type="submit"]')
    await expect(submitButton).toBeEnabled({ timeout: 5_000 })
    await submitButton.click()

    await expect(page).toHaveURL(/\/app\/admin\/teams$/, { timeout: 10_000 })
  })

  test('create team — pick color via color picker', async ({ page }) => {
    await page.goto('/app/admin/teams/create')
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })

    const nameInput = page.getByTestId('team-form.name.input')
    await nameInput.click()
    await nameInput.pressSequentially('ColorTest')

    const colorTrigger = page.locator('.ColorInput button')
    await colorTrigger.click()
    await expect(page.locator('.react-colorful')).toBeVisible({ timeout: 3_000 })
    await page.locator('.react-colorful__hue').click({ position: { x: 50, y: 7 } })
    await expect(page.locator('.react-colorful')).toBeVisible()
  })
})
