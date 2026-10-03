import type { Locator, Page } from '@playwright/test'
import type { FilePayload } from '../fixtures/images'

// Playwright's Chromium runs in en-US, a developer's own browser may be in French: every translated
// text is matched in both languages.
const TEXT = {
  heading: /^(account|compte)$/i,
  photoSection: /^photo$/i,
  profileSection: /^(profile|profil)$/i,
  passwordSection: /^(password|mot de passe)$/i,
  choosePhoto: /^(choose a photo|choisir une photo)$/i,
  removePhoto: /^(remove photo|supprimer la photo)$/i,
  photoAlt: /^(profile photo|photo de profil)$/i,
  firstName: /^(first name|prénom)$/i,
  lastName: /^(last name|nom)$/i,
  save: /^(save|enregistrer)$/i,
  currentPassword: /^(current password|mot de passe actuel)$/i,
  newPassword: /^(new password|nouveau mot de passe)$/i,
  confirmPassword: /^(confirm new password|confirmer le nouveau mot de passe)$/i,
  changePassword: /^(change password|changer le mot de passe)$/i,
}

export const ACCOUNT_TOASTS = {
  profileUpdated: /Profile updated\.|Profil mis à jour\./,
  passwordChanged: /Password changed\.|Mot de passe modifié\./,
  photoUpdated: /Profile photo updated\.|Photo de profil mise à jour\./,
  photoRemoved: /Profile photo removed\.|Photo de profil supprimée\./,
}

export const ACCOUNT_URL = /\/app\/my-profile$/

export class AccountPage {
  readonly heading: Locator
  readonly photoSection: Locator
  readonly profileSection: Locator
  readonly passwordSection: Locator

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1, name: TEXT.heading })
    this.photoSection = page.getByRole('region', { name: TEXT.photoSection })
    this.profileSection = page.getByRole('region', { name: TEXT.profileSection })
    this.passwordSection = page.getByRole('region', { name: TEXT.passwordSection })
  }

  async goto() {
    await this.page.goto('/app/my-profile')
  }

  // ── Sidebar ──

  /** Profile entry of the sidebar footer: its accessible name is the user's full name. */
  sidebarProfileButton(fullName: string | RegExp) {
    return this.page.getByRole('button', { name: fullName })
  }

  /** `user-avatar` is rendered twice (sidebar footer + Photo section): this is the sidebar one. */
  get sidebarAvatar() {
    return this.page.locator('[data-slot="sidebar-footer"]').getByTestId('user-avatar')
  }

  async openFromSidebar(fullName: string | RegExp) {
    await this.sidebarProfileButton(fullName).click()
  }

  // ── Photo ──

  get avatar() {
    return this.photoSection.getByTestId('user-avatar')
  }

  get photo() {
    return this.photoSection.getByRole('img', { name: TEXT.photoAlt })
  }

  get choosePhotoButton() {
    return this.photoSection.getByRole('button', { name: TEXT.choosePhoto })
  }

  get removePhotoButton() {
    return this.photoSection.getByRole('button', { name: TEXT.removePhoto })
  }

  get photoError() {
    return this.photoSection.getByRole('alert')
  }

  async choosePhoto(file: FilePayload | string) {
    await this.photoSection.getByTestId('account-photo-input').setInputFiles(file)
  }

  async removePhoto() {
    await this.removePhotoButton.click()
  }

  // ── Profile ──

  get firstNameInput() {
    return this.profileSection.getByRole('textbox', { name: TEXT.firstName })
  }

  get lastNameInput() {
    return this.profileSection.getByRole('textbox', { name: TEXT.lastName })
  }

  get email() {
    return this.profileSection.getByTestId('account-email')
  }

  get saveButton() {
    return this.profileSection.getByRole('button', { name: TEXT.save })
  }

  async saveProfile() {
    await this.saveButton.click()
  }

  // ── Password ──

  get currentPasswordInput() {
    return this.passwordSection.getByLabel(TEXT.currentPassword)
  }

  get newPasswordInput() {
    return this.passwordSection.getByLabel(TEXT.newPassword)
  }

  get confirmPasswordInput() {
    return this.passwordSection.getByLabel(TEXT.confirmPassword)
  }

  get changePasswordButton() {
    return this.passwordSection.getByRole('button', { name: TEXT.changePassword })
  }

  get passwordError() {
    return this.passwordSection.getByRole('alert')
  }

  async fillPasswords(current: string, next: string, confirmation: string = next) {
    await this.currentPasswordInput.fill(current)
    await this.newPasswordInput.fill(next)
    await this.confirmPasswordInput.fill(confirmation)
  }

  async changePassword(current: string, next: string, confirmation: string = next) {
    await this.fillPasswords(current, next, confirmation)
    await this.changePasswordButton.click()
  }

  // ── Session ──

  storedToken(): Promise<string | undefined> {
    return this.page.evaluate(() => (JSON.parse(localStorage.getItem('user') ?? '{}') as { token?: string }).token)
  }
}
