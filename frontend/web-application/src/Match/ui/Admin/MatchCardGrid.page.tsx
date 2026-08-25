import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MatchCardGrid } from './MatchCardGrid'
import type { Match } from '../../domain/Match'
import { MatchStatus } from '../../domain/Match'

const defaultArea = {
  id: 'area-1',
  name: 'Salle A',
  address: '1 rue du Stade',
  city: 'Lyon',
  longitude: 4.83,
  latitude: 45.75,
}

const buildMatch = (id: string): Match => ({
  id,
  area: defaultArea,
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  status: MatchStatus.SCHEDULED,
  scheduledAt: '2026-09-01T18:00:00.000Z',
  championshipName: 'Championnat U13',
  stageName: 'Poule A',
  homeTeam: { id: 'team-1', name: 'Les Aigles', color: '#ef4444' },
  awayTeam: { id: 'team-2', name: 'Les Loups', color: '#3b82f6' },
})

type Props = { matches: Match[] }

export class MatchCardGridPage {
  onScoreClick = vi.fn()
  onDeleteClick = vi.fn()
  private matches: Match[]

  constructor(props: Partial<Props> = {}) {
    this.matches = props.matches ?? [buildMatch('match-1'), buildMatch('match-2')]
  }

  render() {
    render(<MatchCardGrid matches={this.matches} onScoreClick={this.onScoreClick} onDeleteClick={this.onDeleteClick} />)
    return this
  }

  championshipNames() {
    return screen.getAllByText('Championnat U13')
  }

  emptyState() {
    return screen.queryByText('adminMatches.card.empty')
  }
}
