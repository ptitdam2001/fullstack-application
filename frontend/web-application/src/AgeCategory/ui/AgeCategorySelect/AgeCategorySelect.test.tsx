import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AgeCategorySelect } from './AgeCategorySelect'

vi.mock('../../infrastructure/useAgeCategoryApi', () => ({
  useGetAgeCategories: vi.fn().mockReturnValue({
    data: [
      { id: 'age-cat-1', label: 'U13', genre: 'MALE', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
      { id: 'age-cat-2', label: 'U15', genre: 'FEMALE', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    ],
  }),
}))

describe('AgeCategorySelect', () => {
  it('renders the label', () => {
    render(<AgeCategorySelect value={null} onChange={vi.fn()} />)
    expect(screen.getByText('adminTeams.form.ageCategoryId')).toBeInTheDocument()
  })

  it('renders a trigger button', () => {
    render(<AgeCategorySelect value={null} onChange={vi.fn()} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('uses custom label when provided', () => {
    render(<AgeCategorySelect value={null} onChange={vi.fn()} label="Choisir" />)
    expect(screen.getByText('Choisir')).toBeInTheDocument()
  })

  it('opens listbox with "Aucune" option and age category options on click', () => {
    render(<AgeCategorySelect value={null} onChange={vi.fn()} />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('option', { name: /adminTeams.form.ageCategoryId.none/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /U13/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /U15/i })).toBeInTheDocument()
  })

  it('calls onChange(null) when "Aucune" option is selected', () => {
    const onChange = vi.fn()
    render(<AgeCategorySelect value="age-cat-1" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('option', { name: /adminTeams.form.ageCategoryId.none/i }))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('calls onChange with id when an age category is selected', () => {
    const onChange = vi.fn()
    render(<AgeCategorySelect value={null} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('option', { name: /U13/i }))
    expect(onChange).toHaveBeenCalledWith('age-cat-1')
  })
})
