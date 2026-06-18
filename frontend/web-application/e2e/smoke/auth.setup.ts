import { test as setup, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const SMOKE_AUTH_FILE = path.join(__dirname, '../.auth/smoke-user.json')

const SEED_EMAIL = 'admin@seed.local'
const SEED_PASSWORD = 'Seed@1234'

setup('login with seed admin user', async ({ page }) => {
  await page.goto('/auth/signin')

  await page.getByPlaceholder('vous@exemple.com').fill(SEED_EMAIL)
  await page.locator('input[type="password"]').fill(SEED_PASSWORD)
  await page.getByRole('button', { name: 'Se connecter' }).click()

  await expect(page).toHaveURL(/\/app/, { timeout: 15_000 })

  await page.context().storageState({ path: SMOKE_AUTH_FILE })
})