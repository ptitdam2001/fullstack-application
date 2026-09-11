import { render, screen } from '@testing-library/react'
import { BracketGrid } from './BracketGrid'
import type { Match } from '../../../domain/Match'
import { MatchStatus } from '../../../domain/Match'
import type { BracketConnector } from '../../../application/buildBracket'

export const buildMatch = (overrides: Partial<Match>): Match => ({
  id: overrides.id ?? 'm',
  area: null,
  homeTeamId: null,
  awayTeamId: null,
  status: MatchStatus.SCHEDULED,
  ...overrides,
})

export const defaultRounds: Match[][] = [
  [
    buildMatch({
      id: 'sf1',
      round: 1,
      bracketPosition: 1,
      homeTeam: { id: 't1', name: 'A', color: null },
      awayTeam: { id: 't2', name: 'B', color: null },
    }),
    buildMatch({
      id: 'sf2',
      round: 1,
      bracketPosition: 2,
      homeTeam: { id: 't3', name: 'C', color: null },
      awayTeam: { id: 't4', name: 'D', color: null },
    }),
  ],
  [buildMatch({ id: 'final', round: 2, bracketPosition: 1 })],
]

export const defaultConnectors: BracketConnector[] = [
  { fromRound: 0, fromMatch: 0, toRound: 1, toMatch: 0 },
  { fromRound: 0, fromMatch: 1, toRound: 1, toMatch: 0 },
]

export class BracketGridPage {
  private rounds: Match[][]
  private connectors: BracketConnector[]

  constructor(rounds: Match[][] = defaultRounds, connectors: BracketConnector[] = defaultConnectors) {
    this.rounds = rounds
    this.connectors = connectors
  }

  render() {
    render(<BracketGrid rounds={this.rounds} connectors={this.connectors} />)
    return this
  }

  roundLabel(messageId: string) {
    return screen.getByText(messageId)
  }

  teamName(name: string) {
    return screen.getByText(name)
  }

  connectorPaths() {
    return document.querySelectorAll('path')
  }
}
