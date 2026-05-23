import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Match } from '@Sdk/model/match'
import { CoachWDLBadges } from './CoachWDLBadges'

const makeMatch = (overrides: Partial<Match> & { id: string }): Match => ({
  id: overrides.id,
  area: { name: 'Terrain A' },
  homeTeamId: 'home-1',
  awayTeamId: 'away-1',
  status: 'PLAYED',
  homeGoals: 1,
  awayGoals: 0,
  ...overrides,
})

const TEAM = 'team-1'

describe('CoachWDLBadges', () => {
  it('shows 0V 0N 0D when no matches', () => {
    render(<CoachWDLBadges teamId={TEAM} matches={[]} />)
    expect(screen.getByText('0V')).toBeInTheDocument()
    expect(screen.getByText('0N')).toBeInTheDocument()
    expect(screen.getByText('0D')).toBeInTheDocument()
  })

  it('counts a win when team scores more as home', () => {
    const m = makeMatch({ id: 'm1', homeTeamId: TEAM, homeGoals: 3, awayGoals: 1 })
    render(<CoachWDLBadges teamId={TEAM} matches={[m]} />)
    expect(screen.getByText('1V')).toBeInTheDocument()
  })

  it('counts a win when team scores more as away', () => {
    const m = makeMatch({ id: 'm1', awayTeamId: TEAM, homeGoals: 0, awayGoals: 2 })
    render(<CoachWDLBadges teamId={TEAM} matches={[m]} />)
    expect(screen.getByText('1V')).toBeInTheDocument()
  })

  it('counts a draw', () => {
    const m = makeMatch({ id: 'm1', homeTeamId: TEAM, homeGoals: 1, awayGoals: 1 })
    render(<CoachWDLBadges teamId={TEAM} matches={[m]} />)
    expect(screen.getByText('1N')).toBeInTheDocument()
  })

  it('counts a loss', () => {
    const m = makeMatch({ id: 'm1', homeTeamId: TEAM, homeGoals: 0, awayGoals: 3 })
    render(<CoachWDLBadges teamId={TEAM} matches={[m]} />)
    expect(screen.getByText('1D')).toBeInTheDocument()
  })

  it('ignores non-PLAYED matches', () => {
    const m = makeMatch({ id: 'm1', homeTeamId: TEAM, status: 'SCHEDULED', homeGoals: 0, awayGoals: 0 })
    render(<CoachWDLBadges teamId={TEAM} matches={[m]} />)
    expect(screen.getByText('0V')).toBeInTheDocument()
  })
})