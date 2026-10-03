import { userEvent, within } from 'storybook/test'

/** Page Object for the Storybook plays (real browser) — the RTL one lives in AccountPhoto.page.tsx */
export class AccountPhotoStoryPage {
  private readonly canvas: ReturnType<typeof within>

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement)
  }

  chooseButton() {
    return this.canvas.findByRole('button', { name: /choose a photo|choisir une photo/i })
  }

  removeButton() {
    return this.canvas.queryByRole('button', { name: /remove photo|supprimer la photo/i })
  }

  fileInput() {
    return this.canvas.getByTestId('account-photo-input') as HTMLInputElement
  }

  avatar() {
    return this.canvas.getByTestId('user-avatar')
  }

  picture() {
    return this.canvas.queryByRole('img') as HTMLImageElement | null
  }

  error() {
    return this.canvas.findByRole('alert')
  }

  toast(matcher: RegExp) {
    return within(document.body).findByText(matcher)
  }

  async upload(file: File) {
    await this.chooseButton()
    await userEvent.upload(this.fileInput(), file)
    return this
  }

  /** Simulates the "All files" option of the native picker, which lets any file through `accept` */
  async uploadIgnoringAccept(file: File) {
    await this.chooseButton()
    await userEvent.setup({ applyAccept: false }).upload(this.fileInput(), file)
    return this
  }

  async remove() {
    await this.chooseButton()
    await userEvent.click(this.removeButton()!)
    return this
  }
}
