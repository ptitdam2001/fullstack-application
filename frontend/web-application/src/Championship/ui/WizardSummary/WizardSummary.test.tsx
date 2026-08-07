import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WizardSummary } from './WizardSummary'

const lines = [
  { key: 'season', labelId: 'championshipWizard.summary.season', value: '2025–2026' },
  { key: 'category', labelId: 'championshipWizard.summary.category', value: null },
]

describe('WizardSummary', () => {
  it('renders the summary title', () => {
    render(<WizardSummary lines={lines} onJump={vi.fn()} />)
    expect(screen.getByText('championshipWizard.summary.title')).toBeInTheDocument()
  })

  it('renders a line label and value for each entry', () => {
    render(<WizardSummary lines={lines} onJump={vi.fn()} />)
    expect(screen.getByText('championshipWizard.summary.season')).toBeInTheDocument()
    expect(screen.getByText('2025–2026')).toBeInTheDocument()
  })

  it('renders a placeholder for a null value', () => {
    render(<WizardSummary lines={lines} onJump={vi.fn()} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('calls onJump with the line index when a line is clicked', () => {
    const onJump = vi.fn()
    render(<WizardSummary lines={lines} onJump={onJump} />)
    fireEvent.click(screen.getByText('championshipWizard.summary.category'))
    expect(onJump).toHaveBeenCalledWith(1)
  })
})
