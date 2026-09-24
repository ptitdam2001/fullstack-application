import { describe, expect, it, vi } from 'vitest'
import type { User } from '../../domain/User'
import { AdminUserFormSheetPage } from './AdminUserFormSheet.page'

vi.mock('./AdminUserForm', () => ({
  AdminUserForm: ({ user, isSelf }: { user: User; isSelf: boolean }) => (
    <div data-testid="admin-user-form" data-user-id={user.id} data-is-self={String(isSelf)} />
  ),
}))

const user: User = {
  id: 'u-1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  isAdmin: false,
  isActive: true,
  isBlocked: false,
  isReferee: false,
}

describe('AdminUserFormSheet', () => {
  it('renders the edit title', () => {
    const page = new AdminUserFormSheetPage({ user }).render()
    expect(page.title()).toBeInTheDocument()
  })

  it('renders the form for the given user and forwards isSelf', () => {
    const page = new AdminUserFormSheetPage({ user, isSelf: true }).render()
    expect(page.form()).toHaveAttribute('data-user-id', 'u-1')
    expect(page.form()).toHaveAttribute('data-is-self', 'true')
  })

  it('renders no form without a user', () => {
    const page = new AdminUserFormSheetPage().render()
    expect(page.form()).not.toBeInTheDocument()
  })

  it('renders nothing when closed', () => {
    const page = new AdminUserFormSheetPage({ user, open: false }).render()
    expect(page.title()).not.toBeInTheDocument()
  })
})
