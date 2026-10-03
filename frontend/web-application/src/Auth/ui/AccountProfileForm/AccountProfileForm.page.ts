import { userEvent, within } from 'storybook/test'

export class AccountProfileFormPage {
  private readonly canvas: ReturnType<typeof within>

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement)
  }

  firstNameInput() {
    return this.canvas.findByRole('textbox', { name: /^(first name|prénom)$/i })
  }

  lastNameInput() {
    return this.canvas.getByRole('textbox', { name: /^(last name|nom)$/i })
  }

  email() {
    return this.canvas.getByTestId('account-email')
  }

  submitButton() {
    return this.canvas.getByRole('button', { name: /^(save|enregistrer)$/i })
  }

  firstNameError() {
    return this.canvas.getByText(/first name is required|le prénom est obligatoire/i)
  }

  toast(matcher: RegExp) {
    return within(document.body).findByText(matcher)
  }

  async setFirstName(firstName: string) {
    const input = await this.firstNameInput()
    await userEvent.clear(input)
    if (firstName) {
      await userEvent.type(input, firstName)
    }
    return this
  }

  async clearLastName() {
    await userEvent.clear(this.lastNameInput())
    return this
  }

  async submit() {
    await userEvent.click(this.submitButton())
    return this
  }
}
