import { userEvent, within } from 'storybook/test'

export class SigninFormPage {
  private readonly canvas: ReturnType<typeof within>

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement)
  }

  emailInput() {
    return this.canvas.findByLabelText(/^email/i)
  }

  passwordInput() {
    return this.canvas.getByPlaceholderText('••••••••')
  }

  submitButton() {
    return this.canvas.getByRole('button', { name: /^(sign in|se connecter)$/i })
  }

  toast(matcher: RegExp) {
    return within(document.body).findByText(matcher)
  }

  async signIn(email: string, password: string) {
    await userEvent.type(await this.emailInput(), email)
    await userEvent.type(this.passwordInput(), password)
    await userEvent.click(this.submitButton())
    return this
  }
}
