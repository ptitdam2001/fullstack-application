import type { Page } from '@playwright/test'

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/auth/signin')
  }

  async fillEmail(email: string) {
    await this.page.getByPlaceholder('vous@exemple.com').fill(email)
  }

  async fillPassword(password: string) {
    await this.page.locator('input[type="password"]').fill(password)
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Se connecter' }).click()
  }

  async login(email: string, password: string) {
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.submit()
  }
}