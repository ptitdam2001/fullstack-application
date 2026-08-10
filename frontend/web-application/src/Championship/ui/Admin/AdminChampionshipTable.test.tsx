import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AdminChampionshipTable, type ChampionshipRow } from './AdminChampionshipTable'

const championships: ChampionshipRow[] = [
  { id: 'champ-1', name: 'Championnat U13 2026', seasonLabel: '2025-2026', categoryLabel: 'U13', isDraft: false },
  { id: 'champ-2', name: 'Championnat U15 2026', seasonLabel: '2025-2026', categoryLabel: 'U15', isDraft: true },
]

describe('AdminChampionshipTable', () => {
  it('renders table headers', () => {
    render(<AdminChampionshipTable championships={championships} onResume={vi.fn()} />)
    expect(screen.getByText('adminChampionships.table.name')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.table.season')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.table.category')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.table.actions')).toBeInTheDocument()
  })

  it('renders a row per championship', () => {
    render(<AdminChampionshipTable championships={championships} onResume={vi.fn()} />)
    expect(screen.getByText('Championnat U13 2026')).toBeInTheDocument()
    expect(screen.getByText('Championnat U15 2026')).toBeInTheDocument()
  })

  it('renders an empty state when there are no championships', () => {
    render(<AdminChampionshipTable championships={[]} onResume={vi.fn()} />)
    expect(screen.getByText('adminChampionships.table.empty')).toBeInTheDocument()
  })

  it('only shows the resume action for draft championships', () => {
    render(<AdminChampionshipTable championships={championships} onResume={vi.fn()} />)
    expect(screen.getAllByRole('button', { name: 'adminChampionships.action.resume' })).toHaveLength(1)
  })
})
