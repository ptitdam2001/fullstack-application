import { userEvent, within } from 'storybook/test'

export class ResetPasswordFormPage {
  private readonly canvas: ReturnType<typeof within>

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement)
  }

  newPasswordInput() {
    return this.canvas.findByPlaceholderText(/min\. 8/i)
  }

  confirmPasswordInput() {
    return this.canvas.getByPlaceholderText('••••••••')
  }

  submitButton() {
    return this.canvas.getByRole('button', { name: /reset password|réinitialiser/i })
  }

  rulesError() {
    return this.canvas.getByText(/the password needs at least 8|le mot de passe doit contenir au moins 8/i)
  }

  mismatchError() {
    return this.canvas.getByText(/passwords do not match|les mots de passe ne correspondent pas/i)
  }

  toast(matcher: RegExp) {
    return within(document.body).findByText(matcher)
  }

  async fillPasswords(newPassword: string, confirmPassword: string) {
    const newPasswordInput = await this.newPasswordInput()
    await userEvent.type(newPasswordInput, newPassword)
    await userEvent.type(this.confirmPasswordInput(), confirmPassword)
    return this
  }

  async blurConfirmPassword() {
    await userEvent.tab()
    return this
  }

  async submit() {
    await userEvent.click(this.submitButton())
    return this
  }
}
