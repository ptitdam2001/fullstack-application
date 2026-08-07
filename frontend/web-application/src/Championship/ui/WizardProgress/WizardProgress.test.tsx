import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WIZARD_STEPS } from '../../application/useChampionshipWizard'
import { WizardProgress } from './WizardProgress'

describe('WizardProgress', () => {
  it('renders a segment label for every wizard step', () => {
    render(<WizardProgress currentStep={0} canGoNext={false} onStepClick={vi.fn()} />)
    WIZARD_STEPS.forEach(s => {
      expect(screen.getByText(s.labelId)).toBeInTheDocument()
    })
  })

  it('calls onStepClick with the index of a completed step', () => {
    const onStepClick = vi.fn()
    render(<WizardProgress currentStep={2} canGoNext={false} onStepClick={onStepClick} />)
    fireEvent.click(screen.getByText(WIZARD_STEPS[0].labelId))
    expect(onStepClick).toHaveBeenCalledWith(0)
  })

  it('calls onStepClick with the current step index', () => {
    const onStepClick = vi.fn()
    render(<WizardProgress currentStep={1} canGoNext={false} onStepClick={onStepClick} />)
    fireEvent.click(screen.getByText(WIZARD_STEPS[1].labelId))
    expect(onStepClick).toHaveBeenCalledWith(1)
  })

  it('calls onStepClick for the next step when canGoNext is true', () => {
    const onStepClick = vi.fn()
    render(<WizardProgress currentStep={0} canGoNext onStepClick={onStepClick} />)
    fireEvent.click(screen.getByText(WIZARD_STEPS[1].labelId))
    expect(onStepClick).toHaveBeenCalledWith(1)
  })
})
