import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import type { ReactNode } from 'react'
import { Table, TableHeader, TableHead, TableBody } from '@repo/design-system'
import type { User } from '../../domain/User'
import { AdminUserTableRow } from './AdminUserTableRow'

const wrapper = ({ children }: { children: ReactNode }) => (
  <Table>
    <TableHeader>
      <TableHead />
      <TableHead />
      <TableHead />
      <TableHead />
      <TableHead />
    </TableHeader>
    <TableBody>{children}</TableBody>
  </Table>
)

export class AdminUserTableRowPage {
  onEdit = vi.fn()
  onDelete = vi.fn()
  onActivate = vi.fn()
  onUnblock = vi.fn()

  constructor(
    private user: User,
    private isSelf = false
  ) {}

  render() {
    render(
      <AdminUserTableRow
        user={this.user}
        isSelf={this.isSelf}
        onEdit={this.onEdit}
        onDelete={this.onDelete}
        onActivate={this.onActivate}
        onUnblock={this.onUnblock}
      />,
      { wrapper }
    )
    return this
  }

  cells() {
    return screen.getAllByRole('gridcell')
  }

  fullName(name: string) {
    return screen.getByText(name)
  }

  email() {
    return screen.getByText(this.user.email)
  }

  roleBadge(role: string) {
    return screen.getByText(`adminUsers.role.${role}`)
  }

  statusBadge() {
    return screen.getByTestId('user-status')
  }

  editButton() {
    return screen.getByLabelText('adminUsers.action.edit')
  }

  deleteButton() {
    return screen.getByLabelText('adminUsers.action.delete')
  }

  queryDeleteButton() {
    return screen.queryByLabelText('adminUsers.action.delete')
  }

  activateButton() {
    return screen.queryByLabelText('adminUsers.action.activate')
  }

  unblockButton() {
    return screen.queryByLabelText('adminUsers.action.unblock')
  }

  clickEdit() {
    fireEvent.click(this.editButton())
    return this
  }

  clickDelete() {
    fireEvent.click(this.deleteButton())
    return this
  }

  clickActivate() {
    fireEvent.click(this.activateButton()!)
    return this
  }

  clickUnblock() {
    fireEvent.click(this.unblockButton()!)
    return this
  }
}
