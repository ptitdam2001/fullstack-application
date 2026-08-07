import { describe, expect, it } from 'vitest'
import type { Season } from '../../domain/Season'
import { AdminSeasonTablePage } from './AdminSeasonTable.page'

const seasons: Season[] = [
  {
    id: '1',
    label: '2023-2024',
    startDate: null,
    endDate: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    label: '2024-2025',
    startDate: null,
    endDate: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    label: '2025-2026',
    startDate: null,
    endDate: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

describe('AdminSeasonTable', () => {
  it('renders table headers', () => {
    const page = new AdminSeasonTablePage(seasons).render()
    expect(page.headerLabel()).toBeInTheDocument()
    expect(page.headerStartDate()).toBeInTheDocument()
    expect(page.headerEndDate()).toBeInTheDocument()
    expect(page.headerActions()).toBeInTheDocument()
  })

  it('renders a row for each season', () => {
    const page = new AdminSeasonTablePage(seasons).render()
    expect(page.rowLabel('2023-2024')).toBeInTheDocument()
    expect(page.rowLabel('2024-2025')).toBeInTheDocument()
    expect(page.rowLabel('2025-2026')).toBeInTheDocument()
  })

  it('renders empty state when list is empty', () => {
    const page = new AdminSeasonTablePage([]).render()
    expect(page.emptyState()).toBeInTheDocument()
  })

  it('forwards onEdit to rows', () => {
    const page = new AdminSeasonTablePage(seasons).render()
    page.clickEdit(0)
    expect(page.onEdit).toHaveBeenCalledWith('1')
  })

  it('forwards onDelete to rows', () => {
    const page = new AdminSeasonTablePage(seasons).render()
    page.clickDelete(1)
    expect(page.onDelete).toHaveBeenCalledWith(seasons[1])
  })
})
