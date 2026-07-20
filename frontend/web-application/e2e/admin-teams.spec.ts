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

  test('create button opens sheet', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: 'New Team' }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('dialog').getByText('Create Team')).toBeVisible()
  })

  test('edit button opens edit sheet', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const editButton = page.locator('tbody tr').first().getByRole('button').first()
    await editButton.click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('dialog').getByText('Edit Team')).toBeVisible()
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

  test('create team — fill name and submit', async ({ page }) => {
    const teamName = `E2E-Admin-${Date.now()}`

    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: 'New Team' }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })

    const nameInput = page.getByRole('textbox', { name: 'Name' })
    await nameInput.click()
    await nameInput.pressSequentially(teamName)

    const submitButton = page.getByRole('dialog').getByRole('button', { name: 'Create' })
    await expect(submitButton).toBeEnabled({ timeout: 5_000 })
    await submitButton.click()

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 })
  })

  test('create team — pick color via color picker', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: 'New Team' }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })

    const nameInput = page.getByRole('textbox', { name: 'Name' })
    await nameInput.click()
    await nameInput.pressSequentially('ColorTest')

    const colorTrigger = page.getByRole('button', { name: 'Jersey color' })
    await colorTrigger.click()
    await expect(page.locator('[data-slot="color-area"]')).toBeVisible({ timeout: 3_000 })
    await page.locator('[data-slot="color-area"]').click({ position: { x: 80, y: 40 } })
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-slot="color-area"]')).not.toBeVisible({ timeout: 3_000 })
  })
})
