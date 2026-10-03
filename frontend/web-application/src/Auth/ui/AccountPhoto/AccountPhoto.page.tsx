import { fireEvent, render, screen } from '@testing-library/react'
import { type UserWithoutPassword } from '../../domain/Account'
import { AccountPhoto } from './AccountPhoto'

const defaultUser: UserWithoutPassword = { id: 'u1', email: 'jane@doe.io', firstName: 'Jane', lastName: 'Doe' }

export class AccountPhotoPage {
  private readonly user: UserWithoutPassword

  constructor(userOverrides: Partial<UserWithoutPassword> = {}) {
    this.user = { ...defaultUser, ...userOverrides }
  }

  render() {
    render(<AccountPhoto user={this.user} />)
    return this
  }

  section() {
    return screen.getByRole('region', { name: 'account.photo.title' })
  }

  avatar() {
    return screen.getByTestId('user-avatar')
  }

  fileInput() {
    return screen.getByTestId('account-photo-input') as HTMLInputElement
  }

  chooseButton() {
    return screen.getByRole('button', { name: 'account.photo.choose' })
  }

  removeButton() {
    return screen.queryByRole('button', { name: 'account.photo.remove' })
  }

  error() {
    return screen.queryByRole('alert')
  }

  clickChoose() {
    fireEvent.click(this.chooseButton())
    return this
  }

  clickRemove() {
    fireEvent.click(this.removeButton()!)
    return this
  }

  selectFile(file: File) {
    fireEvent.change(this.fileInput(), { target: { files: [file] } })
    return this
  }
}
