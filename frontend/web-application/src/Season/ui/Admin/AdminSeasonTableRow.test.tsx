import { describe, expect, it } from 'vitest'
import type { Season } from '../../domain/Season'
import { AdminSeasonTableRowPage } from './AdminSeasonTableRow.page'

const season: Season = {
  id: '1',
  label: '2024-2025',
  startDate: '2024-08-01T00:00:00Z',
  endDate: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('AdminSeasonTableRow', () => {
  it('renders the label', () => {
    const page = new AdminSeasonTableRowPage(season).render()
    expect(page.label()).toBeInTheDocument()
  })

  it('renders a placeholder for missing dates', () => {
    const page = new AdminSeasonTableRowPage(season).render()
    expect(page.datePlaceholder()).toBeInTheDocument()
  })

  it('renders edit and delete action buttons', () => {
    const page = new AdminSeasonTableRowPage(season).render()
    expect(page.editButton()).toBeInTheDocument()
    expect(page.deleteButton()).toBeInTheDocument()
  })

  it('calls onEdit with id when edit button is clicked', () => {
    const page = new AdminSeasonTableRowPage(season).render()
    page.clickEdit()
    expect(page.onEdit).toHaveBeenCalledWith('1')
  })

  it('calls onDelete with season when delete button is clicked', () => {
    const page = new AdminSeasonTableRowPage(season).render()
    page.clickDelete()
    expect(page.onDelete).toHaveBeenCalledWith(season)
  })
})
