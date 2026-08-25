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

  score() {
    return screen.queryByText(`${this.match.homeGoals} - ${this.match.awayGoals}`)
  }

  scorePlaceholder() {
    return screen.queryByText('–')
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
