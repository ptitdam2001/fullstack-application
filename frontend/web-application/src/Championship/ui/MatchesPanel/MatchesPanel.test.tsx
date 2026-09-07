import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Match } from '../../domain/Match'
import { MatchesPanel } from './MatchesPanel'

const matches: Match[] = [
  {
    id: 'm1',
    groupId: 'g1',
    area: null,
    scheduledAt: '2026-09-06T10:00:00.000Z',
    status: 'PLAYED',
    homeTeamId: 't1',
    awayTeamId: 't2',
    homeGoals: 24,
    awayGoals: 19,
    homeTeam: { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a' },
    awayTeam: { id: 't2', name: 'Lyon HB Club', color: '#2f6fed' },
  },
  {
    id: 'm2',
    groupId: 'g1',
    area: null,
    scheduledAt: '2026-09-27T10:00:00.000Z',
    status: 'SCHEDULED',
    homeTeamId: 't1',
    awayTeamId: 't3',
    homeTeam: { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a' },
    awayTeam: { id: 't3', name: 'Bron Handball', color: '#1a1a1a' },
  },
]

describe('MatchesPanel', () => {
  it('renders a row per match with team names', () => {
    render(<MatchesPanel matches={matches} filter="all" onFilterChange={vi.fn()} onViewAll={vi.fn()} />)
    expect(screen.getAllByText('HB Villeurbanne')).toHaveLength(2)
    expect(screen.getByText('Lyon HB Club')).toBeInTheDocument()
    expect(screen.getByText('Bron Handball')).toBeInTheDocument()
  })

  it('renders scores for played matches', () => {
    render(<MatchesPanel matches={matches} filter="all" onFilterChange={vi.fn()} onViewAll={vi.fn()} />)
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('19')).toBeInTheDocument()
  })

  it('renders the status badge i18n key', () => {
    render(<MatchesPanel matches={matches} filter="all" onFilterChange={vi.fn()} onViewAll={vi.fn()} />)
    expect(screen.getByText('championshipDetail.matches.status.played')).toBeInTheDocument()
    expect(screen.getByText('championshipDetail.matches.status.scheduled')).toBeInTheDocument()
  })

  it('calls onFilterChange when a filter button is clicked', () => {
    const onFilterChange = vi.fn()
    render(<MatchesPanel matches={matches} filter="all" onFilterChange={onFilterChange} onViewAll={vi.fn()} />)
    fireEvent.click(screen.getByText('championshipDetail.matches.filter.scheduled'))
    expect(onFilterChange).toHaveBeenCalledWith('SCHEDULED')
  })

  it('calls onViewAll when the view-all link is clicked', () => {
    const onViewAll = vi.fn()
    render(<MatchesPanel matches={matches} filter="all" onFilterChange={vi.fn()} onViewAll={onViewAll} />)
    fireEvent.click(screen.getByText('championshipDetail.matches.viewAll'))
    expect(onViewAll).toHaveBeenCalled()
  })

  it('renders empty state when there are no matches', () => {
    render(<MatchesPanel matches={[]} filter="all" onFilterChange={vi.fn()} onViewAll={vi.fn()} />)
    expect(screen.getByText('championshipDetail.matches.empty')).toBeInTheDocument()
  })
})
