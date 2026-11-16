import { userEvent, within } from 'storybook/test'

export class RegisterFormPage {
  private readonly canvas: ReturnType<typeof within>

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement)
  }

  firstNameInput() {
    return this.canvas.findByLabelText(/^(first name|prénom)/i)
  }

  emailInput() {
    return this.canvas.getByLabelText(/^(email address|adresse e-mail)/i)
  }

  passwordInput() {
    return this.canvas.getByPlaceholderText(/min\. 8/i)
  }

  confirmPasswordInput() {
    return this.canvas.getByPlaceholderText('••••••••')
  }

  submitButton() {
    return this.canvas.getByRole('button', { name: /^(create account|créer un compte)$/i })
  }

  rulesError() {
    return this.canvas.getByText(/the password needs at least 8|le mot de passe doit contenir au moins 8/i)
  }

  mismatchError() {
    return this.canvas.getByText(/passwords do not match|les mots de passe ne correspondent pas/i)
  }

  requiredErrors() {
    return this.canvas.findAllByText(/^(required|requis)\.$/i)
  }

  invalidEmailError() {
    return this.canvas.findByText(/^(enter a valid email address|adresse e-mail invalide)\.$/i)
  }

  toast(matcher: RegExp) {
    return within(document.body).findByText(matcher)
  }

  successMessage() {
    return this.canvas.findByText(/account created|compte créé/i)
  }

  async fill(password: string, confirmPassword: string) {
    await userEvent.type(await this.firstNameInput(), 'Jane')
    await userEvent.type(this.emailInput(), 'jane.doe@example.org')
    await userEvent.type(this.passwordInput(), password)
    await userEvent.type(this.confirmPasswordInput(), confirmPassword)
    return this
  }

  async leaveFirstNameAndEmailEmpty() {
    await userEvent.click(await this.firstNameInput())
    await userEvent.click(this.emailInput())
    await userEvent.tab()
    return this
  }

  async typeEmailAndBlur(email: string) {
    await userEvent.type(this.emailInput(), email)
    await userEvent.tab()
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
