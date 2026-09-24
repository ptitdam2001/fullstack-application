import { userEvent, within } from 'storybook/test'

export class AdminUserFormPage {
  private readonly canvas: ReturnType<typeof within>

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement)
  }

  // First query is async: the i18n decorator suspends the story on first render (pitfall 16)
  firstNameInput() {
    return this.canvas.findByRole('textbox', { name: /prénom|first name/i })
  }

  lastNameInput() {
    return this.canvas.getByRole('textbox', { name: /^nom$|last name/i })
  }

  emailInput() {
    return this.canvas.getByRole('textbox', { name: /email/i })
  }

  adminSwitch() {
    return this.canvas.getByRole('switch', { name: /administrat/i })
  }

  selfHint() {
    return this.canvas.queryByText(/propre rôle|your own administrator/i)
  }

  submitButton() {
    return this.canvas.getByRole('button', { name: /enregistrer|save/i })
  }

  toast(matcher: RegExp) {
    return within(document.body).findByText(matcher)
  }

  async replaceFirstName(value: string) {
    const input = await this.firstNameInput()
    await userEvent.clear(input)
    await userEvent.type(input, value)
    return this
  }

  async clearFirstName() {
    await userEvent.clear(await this.firstNameInput())
    await userEvent.tab()
    return this
  }

  async toggleAdmin() {
    await userEvent.click(this.adminSwitch())
    return this
  }

  async submit() {
    await userEvent.click(this.submitButton())
    return this
  }
}
