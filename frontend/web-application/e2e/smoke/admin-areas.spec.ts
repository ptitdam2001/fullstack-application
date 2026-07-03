import { test, expect } from '@playwright/test'

test.describe('smoke — admin areas', () => {
  test('page loads with table', async ({ page }) => {
    await page.goto('/app/settings/areas')
    await expect(page.locator('table')).toBeVisible({ timeout: 15_000 })
  })

  test('table displays seed area', async ({ page }) => {
    await page.goto('/app/settings/areas')
    await expect(page.locator('table')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText('Stade Test')).toBeVisible()
  })

  test('create dialog opens via create link', async ({ page }) => {
    await page.goto('/app/settings/areas')
    await expect(page.locator('table')).toBeVisible({ timeout: 15_000 })
    await page.locator('a[href$="/create"]').click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('dialog').getByText('Create')).toBeVisible()
  })

  test('create area, verify it appears in table', async ({ page }) => {
    const areaName = `Smoke-Area-${Date.now()}`

    await page.goto('/app/settings/areas')
    await expect(page.locator('table')).toBeVisible({ timeout: 15_000 })
    await page.locator('a[href$="/create"]').click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })

    await page.getByRole('textbox', { name: /Name/i }).pressSequentially(areaName)
    await page.getByRole('textbox', { name: /Address/i }).pressSequentially('1 rue du Test')
    await page.getByRole('textbox', { name: /City/i }).pressSequentially('Lyon')
    await page.getByRole('textbox', { name: /Longitude/i }).pressSequentially('4.83')
    await page.getByRole('textbox', { name: /Latitude/i }).pressSequentially('45.75')

    await expect(page.getByRole('button', { name: /Create/i })).toBeEnabled({ timeout: 5_000 })
    await page.getByRole('button', { name: /Create/i }).click()

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 })
    await page.goto('/app/settings/areas')
    await expect(page.getByText(areaName)).toBeVisible({ timeout: 15_000 })
  })

  test('edit seed area', async ({ page }) => {
    await page.goto('/app/settings/areas')
    await expect(page.getByText('Stade Test')).toBeVisible({ timeout: 15_000 })

    const seedRow = page.locator('tbody tr').filter({ hasText: 'Stade Test' })
    await seedRow.locator('a').click()

    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('dialog').getByText('Edit')).toBeVisible()
    await expect(page.getByRole('textbox', { name: /Name/i })).toHaveValue('Stade Test')
  })

  test('delete area created in test', async ({ page }) => {
    const areaName = `Smoke-Del-${Date.now()}`

    await page.goto('/app/settings/areas')
    await expect(page.locator('table')).toBeVisible({ timeout: 15_000 })
    await page.locator('a[href$="/create"]').click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })

    await page.getByRole('textbox', { name: /Name/i }).pressSequentially(areaName)
    await page.getByRole('textbox', { name: /Address/i }).pressSequentially('2 rue du Test')
    await page.getByRole('textbox', { name: /City/i }).pressSequentially('Marseille')
    await page.getByRole('textbox', { name: /Longitude/i }).pressSequentially('5.37')
    await page.getByRole('textbox', { name: /Latitude/i }).pressSequentially('43.29')

    await page.getByRole('button', { name: /Create/i }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 })

    await page.goto('/app/settings/areas')
    await expect(page.getByText(areaName)).toBeVisible({ timeout: 15_000 })

    const row = page.locator('tbody tr').filter({ hasText: areaName })
    await row.getByRole('button').click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 })
    await page.getByRole('button', { name: /^Delete$/i }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 })

    await page.goto('/app/settings/areas')
    await expect(page.getByText(areaName)).not.toBeVisible({ timeout: 10_000 })
  })
})
