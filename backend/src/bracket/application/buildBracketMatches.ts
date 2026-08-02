import type { BracketTeamEntry } from '../domain/Bracket.js'
import { BracketInvalidShapeError } from '../domain/BracketErrors.js'

export type BracketMatchPlan = {
  round: number
  bracketPosition: number
  homeTeamId: string | null
  awayTeamId: string | null
}

function sortBySeed(entries: BracketTeamEntry[]): BracketTeamEntry[] {
  return [...entries].sort((a, b) => a.seed - b.seed)
}

/**
 * Round r's slots = winners of round r-1 matches (in bracketPosition order, unresolved as null)
 * followed by round r's bye entrants (sorted by seed). This keeps advanceWinner's
 * ceil(bracketPosition / 2) mapping valid at every round, since a round r match's winner
 * always lands on slot bracketPosition of round r+1.
 */
export function buildBracketMatches(bracketTeams: BracketTeamEntry[]): BracketMatchPlan[] {
  const entriesByRound = new Map<number, BracketTeamEntry[]>()
  for (const entry of bracketTeams) {
    const list = entriesByRound.get(entry.round) ?? []
    list.push(entry)
    entriesByRound.set(entry.round, list)
  }

  const round1 = sortBySeed(entriesByRound.get(1) ?? [])
  if (round1.length === 0 || round1.length % 2 !== 0) {
    throw new BracketInvalidShapeError('round 1 must have a non-zero, even number of teams')
  }

  const matches: BracketMatchPlan[] = []
  let slots: (string | null)[] = round1.map((entry) => entry.teamId)
  let round = 1

  while (slots.length > 1) {
    if (slots.length % 2 !== 0) {
      throw new BracketInvalidShapeError(`round ${round} has an odd number of slots`)
    }
    const matchCount = slots.length / 2
    for (let i = 0; i < matchCount; i++) {
      matches.push({ round, bracketPosition: i + 1, homeTeamId: slots[2 * i], awayTeamId: slots[2 * i + 1] })
    }
    round += 1
    const byeEntrants = sortBySeed(entriesByRound.get(round) ?? [])
    const winnerSlots: (string | null)[] = new Array<null>(matchCount).fill(null)
    slots = [...winnerSlots, ...byeEntrants.map((entry) => entry.teamId)]
  }

  return matches
}
