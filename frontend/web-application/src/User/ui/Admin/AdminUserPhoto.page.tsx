import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import type { User } from '../../domain/User'
import { AdminUserPhoto } from './AdminUserPhoto'

const { mockRemoveUserAvatar } = vi.hoisted(() => ({ mockRemoveUserAvatar: vi.fn() }))

vi.mock('../../application/useUserAvatarRemove', () => ({
  useUserAvatarRemove: () => ({ removeUserAvatar: mockRemoveUserAvatar, isPending: false }),
}))

const defaultUser: User = {
  id: 'u-1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  avatar: '/images/abc',
  isAdmin: false,
  isActive: true,
  isBlocked: false,
  isReferee: false,
  roles: [],
}

export class AdminUserPhotoPage {
  removeUserAvatar = mockRemoveUserAvatar
  private readonly user: User

  constructor(userOverrides: Partial<User> = {}) {
    this.user = { ...defaultUser, ...userOverrides }
    mockRemoveUserAvatar.mockReset()
    mockRemoveUserAvatar.mockResolvedValue({ ...this.user, avatar: null })
  }

  /** Makes the next removal fail, as the API would on a server error. */
  failRemoval() {
    mockRemoveUserAvatar.mockRejectedValue(new Error('boom'))
    return this
  }

  render() {
    render(<AdminUserPhoto user={this.user} />)
    return this
  }

  avatar() {
    return screen.getByTestId('user-avatar')
  }

  removeButton() {
    return screen.queryByRole('button', { name: 'adminUsers.photo.remove' })
  }

  dialogTitle() {
    return screen.queryByText('adminUsers.removeAvatar.title')
  }

  confirmButton() {
    return screen.getByText('adminUsers.removeAvatar.confirm').closest('button')!
  }

  clickRemove() {
    fireEvent.click(this.removeButton()!)
    return this
  }

  clickConfirm() {
    fireEvent.click(this.confirmButton())
    return this
  }

  async waitForRemovalSettled() {
    await waitFor(() => expect(this.dialogTitle()).not.toBeInTheDocument())
    return this
  }
}
