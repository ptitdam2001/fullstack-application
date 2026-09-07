import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { StandingRow } from '../../domain/Standing'
import { StandingsTable } from './StandingsTable'

const teams = {
  t1: { name: 'HB Villeurbanne', color: '#e36b3a' },
  t2: { name: 'Lyon HB Club', color: '#2f6fed' },
}

const rows: StandingRow[] = [
  {
    rank: 1,
    teamId: 't1',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    forfeited: 0,
    goalsFor: 60,
    goalsAgainst: 40,
    goalDifference: 20,
    points: 9,
  },
  {
    rank: 2,
    teamId: 't2',
    played: 3,
    won: 1,
    drawn: 0,
    lost: 2,
    forfeited: 0,
    goalsFor: 40,
    goalsAgainst: 55,
    goalDifference: -15,
    points: 3,
  },
]

describe('StandingsTable', () => {
  it('renders table headers', () => {
    render(<StandingsTable rows={rows} teams={teams} qualifyRank={1} />)
    expect(screen.getByText('championshipDetail.standings.table.team')).toBeInTheDocument()
    expect(screen.getByText('championshipDetail.standings.table.points')).toBeInTheDocument()
  })

  it('renders a row per team with resolved name', () => {
    render(<StandingsTable rows={rows} teams={teams} qualifyRank={1} />)
    expect(screen.getByText('HB Villeurbanne')).toBeInTheDocument()
    expect(screen.getByText('Lyon HB Club')).toBeInTheDocument()
  })

  it('renders points and goal difference values', () => {
    render(<StandingsTable rows={rows} teams={teams} qualifyRank={1} />)
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('+20')).toBeInTheDocument()
    expect(screen.getByText('-15')).toBeInTheDocument()
  })

  it('highlights rows within the qualifying rank', () => {
    render(<StandingsTable rows={rows} teams={teams} qualifyRank={1} />)
    const qualifiedRow = screen.getByText('HB Villeurbanne').closest('tr')
    const nonQualifiedRow = screen.getByText('Lyon HB Club').closest('tr')
    expect(qualifiedRow).toHaveAttribute('data-qualified', 'true')
    expect(nonQualifiedRow).toHaveAttribute('data-qualified', 'false')
  })

  it('renders empty state when there are no rows', () => {
    render(<StandingsTable rows={[]} teams={{}} qualifyRank={1} />)
    expect(screen.getByText('championshipDetail.standings.empty')).toBeInTheDocument()
  })
})
