import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import type { Season } from '../../domain/Season'
import { AdminSeasonTable } from './AdminSeasonTable'

export class AdminSeasonTablePage {
  onEdit = vi.fn()
  onDelete = vi.fn()

  constructor(private seasons: Season[]) {}

  render() {
    render(<AdminSeasonTable seasons={this.seasons} onEdit={this.onEdit} onDelete={this.onDelete} />)
    return this
  }

  headerLabel() {
    return screen.getByText('adminSeasons.table.label')
  }

  headerStartDate() {
    return screen.getByText('adminSeasons.table.startDate')
  }

  headerEndDate() {
    return screen.getByText('adminSeasons.table.endDate')
  }

  headerActions() {
    return screen.getByText('adminSeasons.table.actions')
  }

  emptyState() {
    return screen.getByText('adminSeasons.table.empty')
  }

  rowLabel(label: string) {
    return screen.getByText(label)
  }

  editButtons() {
    return screen.getAllByLabelText('adminSeasons.action.edit')
  }

  deleteButtons() {
    return screen.getAllByLabelText('adminSeasons.action.delete')
  }

  clickEdit(index: number) {
    fireEvent.click(this.editButtons()[index])
    return this
  }

  clickDelete(index: number) {
    fireEvent.click(this.deleteButtons()[index])
    return this
  }
}
