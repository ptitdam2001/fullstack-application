import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { AgeCategory } from '@AgeCategory/domain/AgeCategory'
import { StepCategory } from './StepCategory'

const categories: AgeCategory[] = [
  { id: 'c1', label: 'U13', genre: 'FEMALE' as const, createdAt: '', updatedAt: '' },
  { id: 'c2', label: 'U15', genre: 'MALE' as const, createdAt: '', updatedAt: '' },
]

describe('StepCategory', () => {
  it('renders the step title and hint', () => {
    render(<StepCategory categories={categories} selectedId={null} onSelect={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'championshipWizard.step.category' })).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.category.hint')).toBeInTheDocument()
  })

  it('renders one chip per category with its label and genre', () => {
    render(<StepCategory categories={categories} selectedId={null} onSelect={vi.fn()} />)
    expect(screen.getByText('U13')).toBeInTheDocument()
    expect(screen.getByText('U15')).toBeInTheDocument()
    expect(screen.getByText('adminAgeCategories.genre.FEMALE')).toBeInTheDocument()
    expect(screen.getByText('adminAgeCategories.genre.MALE')).toBeInTheDocument()
  })

  it('marks the selected chip as pressed', () => {
    render(<StepCategory categories={categories} selectedId="c2" onSelect={vi.fn()} />)
    expect(screen.getByRole('button', { name: /U15/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /U13/ })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onSelect with the category id when clicked', () => {
    const onSelect = vi.fn()
    render(<StepCategory categories={categories} selectedId={null} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /U15/ }))
    expect(onSelect).toHaveBeenCalledWith('c2')
  })

  it('renders an empty state when there are no categories', () => {
    render(<StepCategory categories={[]} selectedId={null} onSelect={vi.fn()} />)
    expect(screen.getByText('championshipWizard.step.category.empty')).toBeInTheDocument()
  })
})
