import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PlayerStandingsTable } from './PlayerStandingsTable'

const TEAM_ID = 'team-1'
const OTHER_TEAM_ID = 'team-2'

const mockStandings = {
  groupId: 'group-1',
  rows: [
    { teamId: OTHER_TEAM_ID, rank: 1, played: 5, won: 4, drawn: 1, lost: 0, forfeited: 0, goalsFor: 10, goalsAgainst: 3, goalDifference: 7, points: 13 },
    { teamId: TEAM_ID, rank: 2, played: 5, won: 3, drawn: 0, lost: 2, forfeited: 0, goalsFor: 7, goalsAgainst: 6, goalDifference: 1, points: 9 },
  ],
}

const mockCurrentGroup = { groupId: 'group-1', groupName: 'Poule A', phaseId: 'phase-1', championshipId: 'champ-1' }

const mockUseGetTeamCurrentGroup = vi.fn(() => ({ data: mockCurrentGroup as typeof mockCurrentGroup | undefined }))
const mockUseGetGroupStandings = vi.fn(() => ({ data: mockStandings }))
const mockUseGetTeams = vi.fn(() => ({
  data: [
    { id: TEAM_ID, name: 'Mon Équipe', areas: [] },
    { id: OTHER_TEAM_ID, name: 'Adversaire', areas: [] },
  ],
}))

vi.mock('@Sdk/teams/teams', () => ({
  useGetTeamCurrentGroup: () => mockUseGetTeamCurrentGroup(),
  useGetTeams: () => mockUseGetTeams(),
}))

vi.mock('@Sdk/standings/standings', () => ({
  useGetGroupStandings: () => mockUseGetGroupStandings(),
}))

describe('PlayerStandingsTable', () => {
  it('renders all rows', () => {
    render(<PlayerStandingsTable teamId={TEAM_ID} userId="user-1" />)
    expect(screen.getByText('Mon Équipe')).toBeInTheDocument()
    expect(screen.getByText('Adversaire')).toBeInTheDocument()
  })

  it('highlights the player team row', () => {
    const { container } = render(<PlayerStandingsTable teamId={TEAM_ID} userId="user-1" />)
    const rows = container.querySelectorAll('tbody tr')
    const playerRow = Array.from(rows).find((row) => row.textContent?.includes('Mon Équipe'))
    expect(playerRow?.className).toContain('bg-primary/10')
    expect(playerRow?.className).toContain('font-bold')
  })

  it('does not highlight other team rows', () => {
    const { container } = render(<PlayerStandingsTable teamId={TEAM_ID} userId="user-1" />)
    const rows = container.querySelectorAll('tbody tr')
    const otherRow = Array.from(rows).find((row) => row.textContent?.includes('Adversaire'))
    expect(otherRow?.className).not.toContain('bg-primary/10')
  })

  it('shows group name', () => {
    render(<PlayerStandingsTable teamId={TEAM_ID} userId="user-1" />)
    expect(screen.getByText('Poule A')).toBeInTheDocument()
  })

  it('shows not enrolled message when no current group', () => {
    mockUseGetTeamCurrentGroup.mockReturnValueOnce({ data: undefined })
    render(<PlayerStandingsTable teamId={TEAM_ID} userId="user-1" />)
    expect(screen.getByText('playerDashboard.notEnrolled')).toBeInTheDocument()
  })
})
