import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Season } from '@Season/domain/Season'
import { StepSeason } from './StepSeason'

const seasons: Season[] = [
  { id: 's1', label: '2025-2026', startDate: '2025-09-01', endDate: '2026-06-30', createdAt: '', updatedAt: '' },
  { id: 's2', label: '2026-2027', startDate: null, endDate: null, createdAt: '', updatedAt: '' },
]

describe('StepSeason', () => {
  it('renders the step title and hint', () => {
    render(<StepSeason seasons={seasons} selectedId={null} onSelect={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'championshipWizard.step.season' })).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.season.hint')).toBeInTheDocument()
  })

  it('renders one radio entry per season with its label', () => {
    render(<StepSeason seasons={seasons} selectedId={null} onSelect={vi.fn()} />)
    expect(screen.getByText('2025-2026')).toBeInTheDocument()
    expect(screen.getByText('2026-2027')).toBeInTheDocument()
  })

  it('shows the date range for a season that has dates', () => {
    render(<StepSeason seasons={seasons} selectedId={null} onSelect={vi.fn()} />)
    expect(screen.getByText('championshipWizard.step.season.dateRange')).toBeInTheDocument()
  })

  it('shows an unknown-dates message for a season without dates', () => {
    render(<StepSeason seasons={seasons} selectedId={null} onSelect={vi.fn()} />)
    expect(screen.getByText('championshipWizard.step.season.dateRangeUnknown')).toBeInTheDocument()
  })

  it('marks the selected season as checked', () => {
    render(<StepSeason seasons={seasons} selectedId="s2" onSelect={vi.fn()} />)
    expect(screen.getByRole('radio', { name: /2026-2027/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: /2025-2026/ })).not.toBeChecked()
  })

  it('calls onSelect with the season id when clicked', () => {
    const onSelect = vi.fn()
    render(<StepSeason seasons={seasons} selectedId={null} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('radio', { name: /2026-2027/ }))
    expect(onSelect).toHaveBeenCalledWith('s2')
  })

  it('renders an empty state when there are no seasons', () => {
    render(<StepSeason seasons={[]} selectedId={null} onSelect={vi.fn()} />)
    expect(screen.getByText('championshipWizard.step.season.empty')).toBeInTheDocument()
  })
})
