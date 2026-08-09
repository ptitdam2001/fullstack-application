import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PhaseType } from '../../domain/Phase'
import { StepPhase } from './StepPhase'

describe('StepPhase', () => {
  it('renders the step title and hint', () => {
    render(<StepPhase phaseType={null} onSelect={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'championshipWizard.step.phase' })).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.phase.hint')).toBeInTheDocument()
  })

  it('renders one card per phase type with label and description', () => {
    render(<StepPhase phaseType={null} onSelect={vi.fn()} />)
    expect(screen.getByText('championshipWizard.phaseType.GROUP')).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.phase.groupDesc')).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.phaseType.KNOCKOUT')).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.phase.knockoutDesc')).toBeInTheDocument()
  })

  it('marks the selected card as pressed', () => {
    render(<StepPhase phaseType={PhaseType.KNOCKOUT} onSelect={vi.fn()} />)
    expect(screen.getByRole('button', { name: /championshipWizard\.phaseType\.GROUP/ })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
    expect(screen.getByRole('button', { name: /championshipWizard\.phaseType\.KNOCKOUT/ })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('calls onSelect with the phase type when a card is clicked', () => {
    const onSelect = vi.fn()
    render(<StepPhase phaseType={null} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /championshipWizard\.phaseType\.GROUP/ }))
    expect(onSelect).toHaveBeenCalledWith(PhaseType.GROUP)
  })
})
