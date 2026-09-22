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

  resendButton() {
    return this.canvas.findByRole('button', {
      name: /request a new activation link|renvoyer un lien d'activation/i,
    })
  }

  successMessage() {
    return this.canvas.getByText(/email sent if your account exists|email envoyé si votre compte existe/i)
  }

  toast(matcher: RegExp) {
    return within(document.body).findByText(matcher)
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

  async clickResend() {
    const button = await this.resendButton()
    await userEvent.click(button)
    return this
  }
}