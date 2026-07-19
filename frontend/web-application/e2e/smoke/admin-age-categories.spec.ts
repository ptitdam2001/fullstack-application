import { test, expect } from '@playwright/test'

test.describe('smoke — admin age categories', () => {
  test('page loads with table', async ({ page }) => {
    await page.goto('/app/settings/age-categories')
    await expect(page.locator('table')).toBeVisible({ timeout: 15_000 })
  })

  test('table displays seed age category', async ({ page }) => {
    await page.goto('/app/settings/age-categories')
    await expect(page.locator('table')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText('Senior')).toBeVisible()
  })

  test('create sheet opens via New Category button', async ({ page }) => {
    await page.goto('/app/settings/age-categories')
    await expect(page.locator('table')).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'New Category' }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('dialog').getByText('Create Age Category')).toBeVisible()
  })

  test('create age category, verify it appears in table', async ({ page }) => {
    const label = `Smoke-Cat-${Date.now()}`

    await page.goto('/app/settings/age-categories')
    await expect(page.locator('table')).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'New Category' }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })

    const labelInput = page.getByRole('textbox', { name: 'Label' })
    await labelInput.click()
    await labelInput.pressSequentially(label)

    const genreSelect = page.getByRole('button', { name: /Genre/i })
    await genreSelect.click()
    await page.getByRole('option', { name: 'Female' }).click()

    await expect(page.getByRole('button', { name: 'New Category' })).toBeEnabled({ timeout: 5_000 })
    await page.getByRole('button', { name: 'New Category' }).click()

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 })
    await page.goto('/app/settings/age-categories')
    await expect(page.getByText(label)).toBeVisible({ timeout: 15_000 })
  })

  test('edit seed age category', async ({ page }) => {
    await page.goto('/app/settings/age-categories')
    await expect(page.getByText('Senior')).toBeVisible({ timeout: 15_000 })

    const seniorRow = page.locator('tbody tr').filter({ hasText: 'Senior' })
    await seniorRow.getByRole('button').first().click()

    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('dialog').getByText('Edit Age Category')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Label' })).toHaveValue('Senior')
  })

  test('delete age category created in test', async ({ page }) => {
    const label = `Smoke-Del-${Date.now()}`

    await page.goto('/app/settings/age-categories')
    await expect(page.locator('table')).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'New Category' }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })

    const labelInput = page.getByRole('textbox', { name: 'Label' })
    await labelInput.click()
    await labelInput.pressSequentially(label)
    await page.getByRole('button', { name: /Genre/i }).click()
    await page.getByRole('option', { name: 'Mixed' }).click()
    await page.getByRole('button', { name: 'New Category' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 })

    await page.goto('/app/settings/age-categories')
    await expect(page.getByText(label)).toBeVisible({ timeout: 15_000 })

    const row = page.locator('tbody tr').filter({ hasText: label })
    await row.getByRole('button').nth(1).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /^Delete$/i })
      .click()
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 })

    await page.goto('/app/settings/age-categories')
    await expect(page.getByText(label)).not.toBeVisible({ timeout: 10_000 })
  })
})
