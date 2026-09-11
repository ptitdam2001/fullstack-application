import { render, screen } from '@testing-library/react'
import { KnockoutBracket } from './KnockoutBracket'
import type { Match } from '../../domain/Match'
import { MatchStatus } from '../../domain/Match'

const buildMatch = (overrides: Partial<Match>): Match => ({
  id: overrides.id ?? 'm',
  area: null,
  homeTeamId: null,
  awayTeamId: null,
  status: MatchStatus.SCHEDULED,
  bracketId: 'b1',
  ...overrides,
})

const defaultMatches: Match[] = [
  buildMatch({
    id: 'final',
    round: 1,
    bracketPosition: 1,
    homeTeam: { id: 't1', name: 'A', color: null },
    awayTeam: { id: 't2', name: 'B', color: null },
  }),
]

export class KnockoutBracketPage {
  private matches: Match[]

  constructor(matches: Match[] = defaultMatches) {
    this.matches = matches
  }

  render() {
    render(<KnockoutBracket matches={this.matches} />)
    return this
  }

  title() {
    return screen.getByText('championshipDetail.knockout.title')
  }

  emptyMessage() {
    return screen.queryByText('championshipDetail.knockout.empty')
  }

  teamName(name: string) {
    return screen.queryByText(name)
  }
}
