import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AdminChampionshipTable, type ChampionshipRow } from './AdminChampionshipTable'
import { PhaseType } from '@Championship/domain/Phase'

const championships: ChampionshipRow[] = [
  {
    id: 'champ-1',
    name: 'Championnat U13 2026',
    seasonLabel: '2025-2026',
    categoryLabel: 'U13',
    isDraft: false,
    isFinished: false,
    startDate: null,
    endDate: null,
    currentPhaseType: PhaseType.GROUP,
    teamsCount: 8,
    matchesPlayed: 3,
    matchesTotal: 12,
  },
  {
    id: 'champ-2',
    name: 'Championnat U15 2026',
    seasonLabel: '2025-2026',
    categoryLabel: 'U15',
    isDraft: true,
    isFinished: false,
    startDate: null,
    endDate: null,
    currentPhaseType: null,
    teamsCount: 0,
    matchesPlayed: 0,
    matchesTotal: 0,
  },
]

describe('AdminChampionshipTable', () => {
  it('renders table headers', () => {
    render(<AdminChampionshipTable championships={championships} onResume={vi.fn()} />)
    expect(screen.getByText('adminChampionships.table.name')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.table.season')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.table.category')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.table.status')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.table.dates')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.table.phase')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.table.teams')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.table.progress')).toBeInTheDocument()
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
