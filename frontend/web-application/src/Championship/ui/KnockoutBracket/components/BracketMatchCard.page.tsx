import { render, screen } from '@testing-library/react'
import { BracketMatchCard } from './BracketMatchCard'
import type { Match } from '../../../domain/Match'
import { MatchStatus } from '../../../domain/Match'

const defaultMatch: Match = {
  id: 'm1',
  bracketId: 'b1',
  round: 1,
  bracketPosition: 1,
  area: null,
  status: MatchStatus.PLAYED,
  homeTeamId: 't1',
  awayTeamId: 't2',
  homeGoals: 3,
  awayGoals: 1,
  homeTeam: { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a' },
  awayTeam: { id: 't2', name: 'Lyon HB Club', color: '#2f6fed' },
}

export class BracketMatchCardPage {
  private match: Match

  constructor(matchOverrides: Partial<Match> = {}) {
    this.match = { ...defaultMatch, ...matchOverrides }
  }

  render() {
    render(<BracketMatchCard match={this.match} style={{}} />)
    return this
  }

  teamName(name: string) {
    return screen.getByText(name)
  }

  score(value: number | string) {
    return screen.queryAllByText(String(value))
  }
}
