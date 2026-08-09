import { test, expect } from '@playwright/test'

test.describe('admin — championships', () => {
  test('list page has a button that opens the wizard', async ({ page }) => {
    await page.goto('/app/admin/championships')
    await expect(page).toHaveURL(/\/app\/admin\/championships$/)

    await page.getByRole('button', { name: /New championship/i }).click()
    await expect(page).toHaveURL(/\/app\/admin\/championships\/new$/)
  })

  test('wizard loads on the season step', async ({ page }) => {
    await page.goto('/app/admin/championships/new')
    await expect(page.getByRole('heading', { name: 'Season', exact: true })).toBeVisible({ timeout: 10_000 })
  })
})

test.describe('admin — championship wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/admin/championships/new')
  })

  test('walks season → category → name, creating the championship on leaving the name step', async ({ page }) => {
    await expect(page.getByRole('radio').first()).toBeVisible({ timeout: 10_000 })
    await page.getByRole('radio').first().click({ force: true })
    await page.getByRole('button', { name: 'Next' }).click()

    await expect(page.getByRole('heading', { name: 'Category', exact: true })).toBeVisible()
    await page.locator('[aria-pressed]').first().click({ force: true })
    await page.getByRole('button', { name: 'Next' }).click()

    await expect(page.getByRole('heading', { name: 'Name', exact: true })).toBeVisible()
    const nameInput = page.getByRole('textbox')
    await nameInput.click()
    await nameInput.pressSequentially(`E2E Championship ${Date.now()}`)

    const nextButton = page.getByRole('button', { name: 'Next' })
    await expect(nextButton).toBeEnabled()
    await nextButton.click()

    // POST /championship succeeded — the phase step is rendered
    await expect(page.getByRole('heading', { name: 'Phase 1', exact: true })).toBeVisible({ timeout: 10_000 })
  })

  test('selecting a phase type creates the phase and advances to the teams step', async ({ page }) => {
    await expect(page.getByRole('radio').first()).toBeVisible({ timeout: 10_000 })
    await page.getByRole('radio').first().click({ force: true })
    await page.getByRole('button', { name: 'Next' }).click()

    await expect(page.getByRole('heading', { name: 'Category', exact: true })).toBeVisible()
    await page.locator('[aria-pressed]').first().click({ force: true })
    await page.getByRole('button', { name: 'Next' }).click()

    const nameInput = page.getByRole('textbox')
    await nameInput.click()
    await nameInput.pressSequentially(`E2E Championship ${Date.now()}`)
    await page.getByRole('button', { name: 'Next' }).click()

    await expect(page.getByRole('heading', { name: 'Phase 1', exact: true })).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: /Pools \(GROUP\)/ }).click({ force: true })
    await page.getByRole('button', { name: 'Next' }).click()

    // POST /phase succeeded — the pools & teams step is rendered
    await expect(page.getByRole('heading', { name: 'Pools & teams', exact: true })).toBeVisible({ timeout: 10_000 })
  })

  test('"previous" navigates back through completed steps without losing selections', async ({ page }) => {
    await expect(page.getByRole('radio').first()).toBeVisible({ timeout: 10_000 })
    await page.getByRole('radio').first().click({ force: true })
    await page.getByRole('button', { name: 'Next' }).click()

    await expect(page.getByRole('heading', { name: 'Category', exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Previous' }).click()

    await expect(page.getByRole('heading', { name: 'Season', exact: true })).toBeVisible()
    await expect(page.getByRole('radio').first()).toBeChecked()
  })
})
