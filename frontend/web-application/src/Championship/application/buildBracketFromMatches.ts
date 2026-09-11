import type { BracketConnector } from './buildBracket'
import type { Match } from '../domain/Match'

export type BracketFromMatches = { rounds: Match[][]; connectors: BracketConnector[] }

export const buildBracketFromMatches = (matches: Match[]): BracketFromMatches => {
  const bracketMatches = matches.filter(match => match.bracketId != null)

  if (bracketMatches.length === 0) {
    return { rounds: [], connectors: [] }
  }

  const maxRound = Math.max(...bracketMatches.map(match => match.round ?? 1))
  const rounds: Match[][] = []
  for (let round = 1; round <= maxRound; round++) {
    rounds.push(
      bracketMatches
        .filter(match => match.round === round)
        .sort((a, b) => (a.bracketPosition ?? 0) - (b.bracketPosition ?? 0))
    )
  }

  const connectors: BracketConnector[] = []
  for (let roundIndex = 0; roundIndex < rounds.length - 1; roundIndex++) {
    rounds[roundIndex].forEach((_, matchIndex) => {
      connectors.push({
        fromRound: roundIndex,
        fromMatch: matchIndex,
        toRound: roundIndex + 1,
        toMatch: Math.floor(matchIndex / 2),
      })
    })
  }

  return { rounds, connectors }
}
