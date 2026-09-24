import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import type { User } from '../../domain/User'
import { AdminUserTable } from './AdminUserTable'

export class AdminUserTablePage {
  onEdit = vi.fn()
  onDelete = vi.fn()
  onActivate = vi.fn()
  onUnblock = vi.fn()

  constructor(private users: User[]) {}

  render() {
    render(
      <AdminUserTable
        users={this.users}
        onEdit={this.onEdit}
        onDelete={this.onDelete}
        onActivate={this.onActivate}
        onUnblock={this.onUnblock}
      />
    )
    return this
  }

  header(column: 'name' | 'email' | 'roles' | 'status' | 'actions') {
    return screen.getByText(`adminUsers.table.${column}`)
  }

  emptyState() {
    return screen.getByText('adminUsers.table.empty')
  }

  rowEmail(email: string) {
    return screen.getByText(email)
  }

  clickEdit(index: number) {
    fireEvent.click(screen.getAllByLabelText('adminUsers.action.edit')[index])
    return this
  }

  clickDelete(index: number) {
    fireEvent.click(screen.getAllByLabelText('adminUsers.action.delete')[index])
    return this
  }

  clickActivate(index: number) {
    fireEvent.click(screen.getAllByLabelText('adminUsers.action.activate')[index])
    return this
  }

  clickUnblock(index: number) {
    fireEvent.click(screen.getAllByLabelText('adminUsers.action.unblock')[index])
    return this
  }
}
