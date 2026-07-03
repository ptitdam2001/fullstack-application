import { test, expect } from '@playwright/test'

test.describe('admin — age categories management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/admin/age-categories')
  })

  test('page loads with table', async ({ page }) => {
    await expect(page).toHaveURL(/\/app\/admin\/age-categories/)
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
  })

  test('table displays rows from MSW data', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
  })

  test('create button opens sheet', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: /New Category/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('dialog').getByText('Create Age Category')).toBeVisible()
  })

  test('create sheet has label and genre fields', async ({ page }) => {
    await page.getByRole('button', { name: /New Category/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('textbox', { name: /Label/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Genre/i })).toBeVisible()
  })

  test('create — submit enabled after filling label and genre', async ({ page }) => {
    await page.getByRole('button', { name: /New Category/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })

    const labelInput = page.getByRole('textbox', { name: /Label/i })
    await labelInput.click()
    await labelInput.pressSequentially(`E2E-Cat-${Date.now()}`)

    const genreSelect = page.getByRole('button', { name: /Genre/i })
    await genreSelect.click()
    await page.getByRole('option', { name: 'Male' }).click()

    const submitButton = page.getByRole('dialog').getByRole('button', { name: /New Category/i })
    await expect(submitButton).toBeEnabled({ timeout: 5_000 })
    await submitButton.click()

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 })
  })

  test('edit button opens edit sheet', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const editButton = page.locator('tbody tr').first().getByRole('button').first()
    await editButton.click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('dialog').getByText('Edit Age Category')).toBeVisible()
  })

  test('delete button opens confirm dialog', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const deleteButton = page.locator('tbody tr').first().getByRole('button').nth(1)
    await deleteButton.click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('dialog').getByText('Delete Age Category')).toBeVisible()
  })

  test('delete dialog has confirm and cancel buttons', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const deleteButton = page.locator('tbody tr').first().getByRole('button').nth(1)
    await deleteButton.click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('button', { name: /Cancel/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Delete/i })).toBeVisible()
  })

  test('cancel delete closes dialog', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const deleteButton = page.locator('tbody tr').first().getByRole('button').nth(1)
    await deleteButton.click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await page.getByRole('button', { name: /Cancel/i }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 3_000 })
  })

  test('confirm delete closes dialog', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const deleteButton = page.locator('tbody tr').first().getByRole('button').nth(1)
    await deleteButton.click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await page.getByRole('button', { name: /^Delete$/i }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 })
  })
})
