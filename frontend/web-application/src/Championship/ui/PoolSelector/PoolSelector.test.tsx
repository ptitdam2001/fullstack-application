import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Group } from '../../domain/Group'
import { PoolSelector } from './PoolSelector'

const pools: Group[] = [
  { id: 'g1', phaseId: 'p1', name: 'Poule A', matchMode: 'HOME_AND_AWAY', teamIds: ['t1', 't2'] },
  { id: 'g2', phaseId: 'p1', name: 'Poule B', matchMode: 'SINGLE', teamIds: ['t3', 't4'] },
]

describe('PoolSelector', () => {
  it('renders a tab per pool', () => {
    render(<PoolSelector pools={pools} value="g1" onValueChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Poule A' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Poule B' })).toBeInTheDocument()
  })

  it('marks the selected pool tab', () => {
    render(<PoolSelector pools={pools} value="g2" onValueChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Poule B' })).toHaveAttribute('aria-selected', 'true')
  })

  it('calls onValueChange with the pool id when a tab is clicked', () => {
    const onValueChange = vi.fn()
    render(<PoolSelector pools={pools} value="g1" onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Poule B' }))
    expect(onValueChange).toHaveBeenCalledWith('g2')
  })

  it('renders nothing when there is only one pool', () => {
    const { container } = render(<PoolSelector pools={[pools[0]]} value="g1" onValueChange={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })
})
