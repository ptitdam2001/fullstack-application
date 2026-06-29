import { render, screen, fireEvent } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { AgeCategory } from '../../domain/AgeCategory'
import { AdminAgeCategoryTableRow } from './AdminAgeCategoryTableRow'

const wrapper = ({ children }: { children: ReactNode }) => (
  <table>
    <tbody>{children}</tbody>
  </table>
)

const ageCategory: AgeCategory = {
  id: '1',
  label: 'U13',
  genre: 'MALE',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('AdminAgeCategoryTableRow', () => {
  it('renders the label', () => {
    render(<AdminAgeCategoryTableRow ageCategory={ageCategory} onEdit={vi.fn()} onDelete={vi.fn()} />, { wrapper })
    expect(screen.getByText('U13')).toBeInTheDocument()
  })

  it('renders the genre i18n key', () => {
    render(<AdminAgeCategoryTableRow ageCategory={ageCategory} onEdit={vi.fn()} onDelete={vi.fn()} />, { wrapper })
    expect(screen.getByText('adminAgeCategories.genre.MALE')).toBeInTheDocument()
  })

  it('renders edit and delete action buttons', () => {
    render(<AdminAgeCategoryTableRow ageCategory={ageCategory} onEdit={vi.fn()} onDelete={vi.fn()} />, { wrapper })
    expect(screen.getByLabelText('adminAgeCategories.action.edit')).toBeInTheDocument()
    expect(screen.getByLabelText('adminAgeCategories.action.delete')).toBeInTheDocument()
  })

  it('calls onEdit with id when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(<AdminAgeCategoryTableRow ageCategory={ageCategory} onEdit={onEdit} onDelete={vi.fn()} />, { wrapper })
    fireEvent.click(screen.getByLabelText('adminAgeCategories.action.edit'))
    expect(onEdit).toHaveBeenCalledWith('1')
  })

  it('calls onDelete with ageCategory when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(<AdminAgeCategoryTableRow ageCategory={ageCategory} onEdit={vi.fn()} onDelete={onDelete} />, { wrapper })
    fireEvent.click(screen.getByLabelText('adminAgeCategories.action.delete'))
    expect(onDelete).toHaveBeenCalledWith(ageCategory)
  })
})
