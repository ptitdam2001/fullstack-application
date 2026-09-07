import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Phase } from '../../domain/Phase'
import { PhaseTabs } from './PhaseTabs'

const phases: Phase[] = [
  { id: 'p1', championshipId: 'c1', type: 'GROUP', order: 1, name: 'Phase 1', qualification: { maxRank: 2 } },
  { id: 'p2', championshipId: 'c1', type: 'KNOCKOUT', order: 2, name: 'Phase 2' },
]

describe('PhaseTabs', () => {
  it('renders a tab per phase', () => {
    render(<PhaseTabs phases={phases} value="p1" onValueChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: /Phase 1/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Phase 2/ })).toBeInTheDocument()
  })

  it('renders the phase kind i18n key for each tab', () => {
    render(<PhaseTabs phases={phases} value="p1" onValueChange={vi.fn()} />)
    expect(screen.getByText('adminChampionships.phaseType.GROUP')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.phaseType.KNOCKOUT')).toBeInTheDocument()
  })

  it('marks the selected phase tab', () => {
    render(<PhaseTabs phases={phases} value="p2" onValueChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: /Phase 2/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /Phase 1/ })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onValueChange with the phase id when a tab is clicked', () => {
    const onValueChange = vi.fn()
    render(<PhaseTabs phases={phases} value="p1" onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('tab', { name: /Phase 2/ }))
    expect(onValueChange).toHaveBeenCalledWith('p2')
  })
})
