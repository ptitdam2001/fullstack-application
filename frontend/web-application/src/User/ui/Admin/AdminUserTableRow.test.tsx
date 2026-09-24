import { describe, expect, it } from 'vitest'
import { type User, UserRole } from '../../domain/User'
import { AdminUserTableRowPage } from './AdminUserTableRow.page'

const user: User = {
  id: 'u-1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  isAdmin: false,
  isActive: true,
  isBlocked: false,
  isReferee: false,
  roles: [UserRole.COACH, UserRole.REFEREE],
}

describe('AdminUserTableRow', () => {
  it('renders the full name', () => {
    const page = new AdminUserTableRowPage(user).render()
    expect(page.fullName('Jane Doe')).toBeInTheDocument()
  })

  it('renders the first name alone when last name is null', () => {
    const page = new AdminUserTableRowPage({ ...user, lastName: null }).render()
    expect(page.cells()[0]).toHaveTextContent(/^Jane$/)
  })

  it('renders the email', () => {
    const page = new AdminUserTableRowPage(user).render()
    expect(page.email()).toBeInTheDocument()
  })

  it('renders one badge per role', () => {
    const page = new AdminUserTableRowPage(user).render()
    expect(page.roleBadge('COACH')).toBeInTheDocument()
    expect(page.roleBadge('REFEREE')).toBeInTheDocument()
  })

  it('renders — when the user has no role', () => {
    const page = new AdminUserTableRowPage({ ...user, roles: [] }).render()
    expect(page.cells()[2]).toHaveTextContent('—')
  })

  describe('status', () => {
    it('is active for an active, unblocked user', () => {
      const page = new AdminUserTableRowPage(user).render()
      expect(page.statusBadge()).toHaveAttribute('data-status', 'active')
    })

    it('is pending for an inactive user', () => {
      const page = new AdminUserTableRowPage({ ...user, isActive: false }).render()
      expect(page.statusBadge()).toHaveAttribute('data-status', 'pending')
    })

    it('is blocked for a blocked user', () => {
      const page = new AdminUserTableRowPage({ ...user, isBlocked: true }).render()
      expect(page.statusBadge()).toHaveAttribute('data-status', 'blocked')
    })

    it('is blocked when the user is both inactive and blocked (blocked wins, spec 10)', () => {
      const page = new AdminUserTableRowPage({ ...user, isActive: false, isBlocked: true }).render()
      expect(page.statusBadge()).toHaveAttribute('data-status', 'blocked')
    })
  })

  describe('actions', () => {
    it('calls onEdit with the user id', () => {
      const page = new AdminUserTableRowPage(user).render().clickEdit()
      expect(page.onEdit).toHaveBeenCalledWith('u-1')
    })

    it('calls onDelete with the user', () => {
      const page = new AdminUserTableRowPage(user).render().clickDelete()
      expect(page.onDelete).toHaveBeenCalledWith(user)
    })

    it("hides delete on the admin's own row", () => {
      const page = new AdminUserTableRowPage(user, true).render()
      expect(page.queryDeleteButton()).not.toBeInTheDocument()
    })

    it("keeps edit on the admin's own row", () => {
      const page = new AdminUserTableRowPage(user, true).render()
      expect(page.editButton()).toBeInTheDocument()
    })

    it('hides activate and unblock for an active, unblocked user', () => {
      const page = new AdminUserTableRowPage(user).render()
      expect(page.activateButton()).not.toBeInTheDocument()
      expect(page.unblockButton()).not.toBeInTheDocument()
    })

    it('shows activate for an inactive user and calls onActivate with the id', () => {
      const page = new AdminUserTableRowPage({ ...user, isActive: false }).render().clickActivate()
      expect(page.onActivate).toHaveBeenCalledWith('u-1')
    })

    it('shows unblock for a blocked user and calls onUnblock with the id', () => {
      const page = new AdminUserTableRowPage({ ...user, isBlocked: true }).render().clickUnblock()
      expect(page.onUnblock).toHaveBeenCalledWith('u-1')
    })
  })
})
