import { userEvent, within } from 'storybook/test'

export class ForgottenPasswordFormPage {
  private readonly canvas: ReturnType<typeof within>

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement)
  }

  emailInput() {
    return this.canvas.findByRole('textbox', { name: /email/i })
  }

  submitButton() {
    return this.canvas.getByRole('button', { name: /reset password|réinitialiser/i })
  }

  resendResetLinkButton() {
    return this.canvas.findByRole('button', {
      name: /send the reset link again|renvoyer le lien de réinitialisation/i,
    })
  }

  resendActivationButton() {
    return this.canvas.findByRole('button', {
      name: /request a new activation link|renvoyer un lien d'activation/i,
    })
  }

  successMessage() {
    return this.canvas.getByText(
      /if an account exists for this address, a reset link|si un compte existe pour cette adresse, un lien de réinitialisation/i
    )
  }

  toast(matcher: RegExp) {
    return within(document.body).findByText(matcher)
  }

  /** Toasts outlive their story: count them to tell a new one from a leftover */
  toasts(matcher: RegExp) {
    return within(document.body).queryAllByText(matcher)
  }

  async fillEmail(email: string) {
    const input = await this.emailInput()
    await userEvent.type(input, email)
    return this
  }

  async submit() {
    await userEvent.click(this.submitButton())
    return this
  }

  async clickResendResetLink() {
    await userEvent.click(await this.resendResetLinkButton())
    return this
  }

  async clickResendActivation() {
    await userEvent.click(await this.resendActivationButton())
    return this
  }
}
