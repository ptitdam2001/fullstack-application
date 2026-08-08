import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StepName } from './StepName'

describe('StepName', () => {
  it('renders the step title and hint', () => {
    render(<StepName name="" onChange={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'championshipWizard.step.name' })).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.name.hint')).toBeInTheDocument()
  })

  it('renders the current name value', () => {
    render(<StepName name="Championnat U13" onChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveValue('Championnat U13')
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    render(<StepName name="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nouveau nom' } })
    expect(onChange).toHaveBeenCalledWith('Nouveau nom')
  })

  it('uses the default placeholder when no category/season context is provided', () => {
    render(<StepName name="" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('championshipWizard.step.name.placeholderDefault')).toBeInTheDocument()
  })

  it('uses the contextual placeholder when category and season are provided', () => {
    render(<StepName name="" onChange={vi.fn()} categoryLabel="U13" categoryGenreLabel="Féminin" seasonYear="2026" />)
    expect(screen.getByPlaceholderText('championshipWizard.step.name.placeholder')).toBeInTheDocument()
  })
})
