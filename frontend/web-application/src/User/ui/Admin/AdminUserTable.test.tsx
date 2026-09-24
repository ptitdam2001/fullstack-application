import { describe, expect, it } from 'vitest'
import type { User } from '../../domain/User'
import { AdminUserTablePage } from './AdminUserTable.page'

const baseUser: User = {
  id: 'u-1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  isAdmin: false,
  isActive: true,
  isBlocked: false,
  isReferee: false,
  roles: [],
}

const users: User[] = [
  baseUser,
  { ...baseUser, id: 'u-2', firstName: 'John', email: 'john@example.com', isActive: false },
  { ...baseUser, id: 'u-3', firstName: 'Max', email: 'max@example.com', isBlocked: true },
]

describe('AdminUserTable', () => {
  it('renders table headers', () => {
    const page = new AdminUserTablePage(users).render()
    for (const column of ['name', 'email', 'roles', 'status', 'actions'] as const) {
      expect(page.header(column)).toBeInTheDocument()
    }
  })

  it('renders a row for each user', () => {
    const page = new AdminUserTablePage(users).render()
    expect(page.rowEmail('jane@example.com')).toBeInTheDocument()
    expect(page.rowEmail('john@example.com')).toBeInTheDocument()
    expect(page.rowEmail('max@example.com')).toBeInTheDocument()
  })

  it('renders empty state when list is empty', () => {
    const page = new AdminUserTablePage([]).render()
    expect(page.emptyState()).toBeInTheDocument()
  })

  it('forwards onEdit to rows', () => {
    const page = new AdminUserTablePage(users).render().clickEdit(1)
    expect(page.onEdit).toHaveBeenCalledWith('u-2')
  })

  it('forwards onDelete to rows', () => {
    const page = new AdminUserTablePage(users).render().clickDelete(2)
    expect(page.onDelete).toHaveBeenCalledWith(users[2])
  })

  it('forwards onActivate to rows', () => {
    const page = new AdminUserTablePage(users).render().clickActivate(0)
    expect(page.onActivate).toHaveBeenCalledWith('u-2')
  })

  it('forwards onUnblock to rows', () => {
    const page = new AdminUserTablePage(users).render().clickUnblock(0)
    expect(page.onUnblock).toHaveBeenCalledWith('u-3')
  })
})
