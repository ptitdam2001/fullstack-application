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

  removePhotoButton() {
    return this.canvas.queryByRole('button', { name: /supprimer la photo|remove photo/i })
  }

  avatar() {
    return this.canvas.getByTestId('user-avatar')
  }

  avatarUrlInput() {
    return this.canvas.queryByRole('textbox', { name: /avatar/i })
  }

  // The confirmation dialog is rendered in a portal, outside the story canvas
  confirmRemovePhotoButton() {
    return within(document.body)
      .getByRole('dialog')
      .querySelector<HTMLButtonElement>('button[data-variant="destructive"]')!
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

  async clearLastName() {
    await userEvent.clear(this.lastNameInput())
    await userEvent.tab()
    return this
  }

  async removePhoto() {
    await userEvent.click(this.removePhotoButton()!)
    await within(document.body).findByRole('dialog')
    await userEvent.click(this.confirmRemovePhotoButton())
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
