import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MatchCard } from './MatchCard'
import type { Match } from '../../domain/Match'
import { MatchStatus } from '../../domain/Match'

const defaultMatch: Match = {
  id: 'match-1',
  area: { id: 'area-1', name: 'Salle A', address: '1 rue du Stade', city: 'Lyon', longitude: 4.83, latitude: 45.75 },
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  status: MatchStatus.SCHEDULED,
  scheduledAt: '2026-09-01T18:00:00.000Z',
  championshipName: 'Championnat U13',
  stageName: 'Poule A',
  homeTeam: { id: 'team-1', name: 'Les Aigles', color: '#ff0000' },
  awayTeam: { id: 'team-2', name: 'Les Loups', color: '#0000ff' },
}

export class MatchCardPage {
  onScoreClick = vi.fn()
  onDeleteClick = vi.fn()
  private match: Match

  constructor(matchOverrides: Partial<Match> = {}) {
    this.match = { ...defaultMatch, ...matchOverrides }
  }

  render() {
    render(<MatchCard match={this.match} onScoreClick={this.onScoreClick} onDeleteClick={this.onDeleteClick} />)
    return this
  }

  championshipName() {
    return screen.getByText(this.match.championshipName!)
  }

  stageName() {
    return screen.getByText(this.match.stageName!)
  }

  teamName(name: string) {
    return screen.getByText(name)
  }

  teamTbd() {
    return screen.queryByText('adminMatches.card.teamTbd')
  }

  statusBadge(messageId: string) {
    return screen.getByText(messageId)
  }

  private scoreMatches(expected: { home: string; away: string }) {
    const home = screen.queryByTestId('home-score')
    const away = screen.queryByTestId('away-score')
    return home?.textContent === expected.home && away?.textContent === expected.away ? home : null
  }

  score() {
    return this.scoreMatches({ home: String(this.match.homeGoals), away: String(this.match.awayGoals) })
  }

  scorePlaceholder() {
    return this.scoreMatches({ home: '-', away: '-' })
  }

  enterScoreButton() {
    return screen.queryByRole('button', { name: 'adminMatches.card.enterScore' })
  }

  clickEnterScoreButton() {
    fireEvent.click(this.enterScoreButton()!)
    return this
  }

  menuButton() {
    return screen.getByRole('button', { name: 'adminMatches.card.menu' })
  }
}
