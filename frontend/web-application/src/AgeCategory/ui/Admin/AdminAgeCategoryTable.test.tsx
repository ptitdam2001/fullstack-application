import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { AgeCategory } from '../../domain/AgeCategory'
import { AdminAgeCategoryTable } from './AdminAgeCategoryTable'

const ageCategories: AgeCategory[] = [
  { id: '1', label: 'U13', genre: 'MALE', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '2', label: 'U15', genre: 'FEMALE', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '3', label: 'U18', genre: 'MIXED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
]

describe('AdminAgeCategoryTable', () => {
  it('renders table headers', () => {
    render(<AdminAgeCategoryTable ageCategories={ageCategories} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('adminAgeCategories.table.label')).toBeInTheDocument()
    expect(screen.getByText('adminAgeCategories.table.genre')).toBeInTheDocument()
    expect(screen.getByText('adminAgeCategories.table.actions')).toBeInTheDocument()
  })

  it('renders a row for each age category', () => {
    render(<AdminAgeCategoryTable ageCategories={ageCategories} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('U13')).toBeInTheDocument()
    expect(screen.getByText('U15')).toBeInTheDocument()
    expect(screen.getByText('U18')).toBeInTheDocument()
  })

  it('renders empty state when list is empty', () => {
    render(<AdminAgeCategoryTable ageCategories={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('adminAgeCategories.table.empty')).toBeInTheDocument()
  })

  it('forwards onEdit to rows', () => {
    const onEdit = vi.fn()
    render(<AdminAgeCategoryTable ageCategories={ageCategories} onEdit={onEdit} onDelete={vi.fn()} />)
    const editButtons = screen.getAllByLabelText('adminAgeCategories.action.edit')
    fireEvent.click(editButtons[0])
    expect(onEdit).toHaveBeenCalledWith('1')
  })

  it('forwards onDelete to rows', () => {
    const onDelete = vi.fn()
    render(<AdminAgeCategoryTable ageCategories={ageCategories} onEdit={vi.fn()} onDelete={onDelete} />)
    const deleteButtons = screen.getAllByLabelText('adminAgeCategories.action.delete')
    fireEvent.click(deleteButtons[1])
    expect(onDelete).toHaveBeenCalledWith(ageCategories[1])
  })
})
