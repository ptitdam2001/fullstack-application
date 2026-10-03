import { userEvent, within } from 'storybook/test'

export class ChangePasswordFormPage {
  private readonly canvas: ReturnType<typeof within>

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement)
  }

  currentPasswordInput() {
    return this.canvas.findByLabelText(/^(current password|mot de passe actuel)$/i)
  }

  newPasswordInput() {
    return this.canvas.getByLabelText(/^(new password|nouveau mot de passe)$/i)
  }

  confirmPasswordInput() {
    return this.canvas.getByLabelText(/^(confirm new password|confirmer le nouveau mot de passe)$/i)
  }

  submitButton() {
    return this.canvas.getByRole('button', { name: /^(change password|changer le mot de passe)$/i })
  }

  rulesError() {
    return this.canvas.getByText(/the password needs at least 8|le mot de passe doit contenir au moins 8/i)
  }

  mismatchError() {
    return this.canvas.getByText(/passwords do not match|les mots de passe ne correspondent pas/i)
  }

  submitError() {
    return this.canvas.findByRole('alert')
  }

  toast(matcher: RegExp) {
    return within(document.body).findByText(matcher)
  }

  async fill(currentPassword: string, newPassword: string, confirmPassword: string) {
    const currentPasswordInput = await this.currentPasswordInput()
    if (currentPassword) {
      await userEvent.type(currentPasswordInput, currentPassword)
    }
    await userEvent.type(this.newPasswordInput(), newPassword)
    await userEvent.type(this.confirmPasswordInput(), confirmPassword)
    return this
  }

  async blur() {
    await userEvent.tab()
    return this
  }

  async submit() {
    await userEvent.click(this.submitButton())
    return this
  }
}
