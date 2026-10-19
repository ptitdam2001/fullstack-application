import { userEvent, within } from 'storybook/test'

export class ActivateFormPage {
  private readonly canvas: ReturnType<typeof within>

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement)
  }

  activateButton() {
    return this.canvas.findByRole('button', { name: /^(activate my account|activer mon compte)$/i })
  }

  successTitle() {
    return this.canvas.findByText(/account activated|compte activé/i)
  }

  invalidLinkMessage() {
    return this.canvas.findByText(/the activation link is invalid|le lien d'activation est invalide/i)
  }

  /** An i18n key shown as is, anywhere on the page (toasts are rendered outside the canvas) */
  rawKey(key: string) {
    return within(document.body).queryByText(key)
  }

  async activate() {
    await userEvent.click(await this.activateButton())
    return this
  }
}
