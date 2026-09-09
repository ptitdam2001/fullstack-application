import { render, screen } from '@testing-library/react'
import { MatchRow } from './MatchRow'
import type { Match } from '../../../domain/Match'
import { MatchStatus } from '../../../domain/Match'

const defaultMatch: Match = {
  id: 'm1',
  groupId: 'g1',
  area: null,
  scheduledAt: '2026-09-06T10:00:00.000Z',
  status: MatchStatus.PLAYED,
  homeTeamId: 't1',
  awayTeamId: 't2',
  homeGoals: 24,
  awayGoals: 19,
  homeTeam: { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a' },
  awayTeam: { id: 't2', name: 'Lyon HB Club', color: '#2f6fed' },
}

export class MatchRowPage {
  private match: Match

  constructor(matchOverrides: Partial<Match> = {}) {
    this.match = { ...defaultMatch, ...matchOverrides }
  }

  render() {
    render(<MatchRow match={this.match} />)
    return this
  }

  teamName(name: string) {
    return screen.getByText(name)
  }

  scores(value: number | string) {
    return screen.getAllByText(String(value))
  }

  statusBadge(messageId: string) {
    return screen.getByText(messageId)
  }
}
