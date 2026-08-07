import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import type { ReactNode } from 'react'
import { Table, TableHeader, TableHead, TableBody } from '@repo/design-system'
import type { Season } from '../../domain/Season'
import { AdminSeasonTableRow } from './AdminSeasonTableRow'

const wrapper = ({ children }: { children: ReactNode }) => (
  <Table>
    <TableHeader>
      <TableHead />
      <TableHead />
      <TableHead />
      <TableHead />
    </TableHeader>
    <TableBody>{children}</TableBody>
  </Table>
)

export class AdminSeasonTableRowPage {
  onEdit = vi.fn()
  onDelete = vi.fn()

  constructor(private season: Season) {}

  render() {
    render(<AdminSeasonTableRow season={this.season} onEdit={this.onEdit} onDelete={this.onDelete} />, { wrapper })
    return this
  }

  label() {
    return screen.getByText(this.season.label)
  }

  datePlaceholder() {
    return screen.getByText('—')
  }

  editButton() {
    return screen.getByLabelText('adminSeasons.action.edit')
  }

  deleteButton() {
    return screen.getByLabelText('adminSeasons.action.delete')
  }

  clickEdit() {
    fireEvent.click(this.editButton())
    return this
  }

  clickDelete() {
    fireEvent.click(this.deleteButton())
    return this
  }
}
