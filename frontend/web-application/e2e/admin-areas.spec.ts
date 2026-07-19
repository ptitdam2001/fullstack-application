import { test, expect } from '@playwright/test'

test.describe('admin — areas management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/settings/areas')
  })

  test('page loads with table', async ({ page }) => {
    await expect(page).toHaveURL(/\/app\/settings\/areas/)
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
  })

  test('table displays rows from MSW data', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
  })

  test('create button opens sheet', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: /New Area/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('dialog').getByText('Create Area')).toBeVisible()
  })

  test('create sheet has all form fields', async ({ page }) => {
    await page.getByRole('button', { name: /New Area/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('textbox', { name: /Name/i })).toBeVisible()
    await expect(page.getByRole('textbox', { name: /Address/i })).toBeVisible()
    await expect(page.getByRole('textbox', { name: /City/i })).toBeVisible()
    await expect(page.locator('input[name="longitude"]')).toBeVisible()
    await expect(page.locator('input[name="latitude"]')).toBeVisible()
  })

  test('create — submit enabled after filling required fields', async ({ page }) => {
    await page.getByRole('button', { name: /New Area/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })

    await page.getByRole('textbox', { name: /Address/i }).pressSequentially('1 rue du Stade')
    await page.getByRole('textbox', { name: /City/i }).pressSequentially('Paris')
    await page.locator('input[name="longitude"]').pressSequentially('2.35')
    await page.locator('input[name="latitude"]').pressSequentially('48.85')

    const submitButton = page.getByRole('dialog').getByRole('button', { name: /New Area/i })
    await expect(submitButton).toBeEnabled({ timeout: 5_000 })
    await submitButton.click()

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 })
  })

  test('edit button opens edit sheet', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const editButton = page.locator('tbody tr').first().getByRole('button').first()
    await editButton.click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('dialog').getByText('Edit Area')).toBeVisible()
  })

  test('delete button opens confirm dialog', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const deleteButton = page.locator('tbody tr').first().getByRole('button').nth(1)
    await deleteButton.click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('dialog').getByText('Delete Area')).toBeVisible()
  })

  test('delete dialog has confirm and cancel buttons', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    const deleteButton = page.locator('tbody tr').first().getByRole('button').nth(1)
    await deleteButton.click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('dialog').getByRole('button', { name: /Cancel/i })).toBeVisible()
    await expect(page.getByRole('dialog').getByRole('button', { name: /Delete/i })).toBeVisible()
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
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /^Delete$/i })
      .click()
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 })
  })
})
