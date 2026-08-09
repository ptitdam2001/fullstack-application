export type BracketEntrant = {
  teamId: string | null
  origin: { fromRound: number; fromMatch: number } | null
}

export type BracketMatchSlot = { a: BracketEntrant; b: BracketEntrant | null }

export type BracketConnector = { fromRound: number; fromMatch: number; toRound: number; toMatch: number }

export type BracketPreview = { rounds: BracketMatchSlot[][]; connectors: BracketConnector[] }

// Round 1 is fully populated with the selected teams in seed (selection) order.
// A lone team at the end of an odd-sized round gets a bye slot (b: null) and
// carries its own id straight into the next round — direct qualification.
export const buildBracket = (teamIds: string[]): BracketPreview => {
  let entrants: BracketEntrant[] = teamIds.map(teamId => ({ teamId, origin: null }))
  const rounds: BracketMatchSlot[][] = []
  const connectors: BracketConnector[] = []
  let round = 0

  while (entrants.length > 1) {
    const matches: BracketMatchSlot[] = []
    const nextEntrants: BracketEntrant[] = []

    for (let i = 0; i < entrants.length; i += 2) {
      const a = entrants[i]
      const b = entrants[i + 1] ?? null
      const matchIndex = matches.length
      matches.push({ a, b })

      if (a.origin) {
        connectors.push({ fromRound: a.origin.fromRound, fromMatch: a.origin.fromMatch, toRound: round, toMatch: matchIndex })
      }
      if (b?.origin) {
        connectors.push({ fromRound: b.origin.fromRound, fromMatch: b.origin.fromMatch, toRound: round, toMatch: matchIndex })
      }

      nextEntrants.push(
        b === null
          ? { teamId: a.teamId, origin: { fromRound: round, fromMatch: matchIndex } }
          : { teamId: null, origin: { fromRound: round, fromMatch: matchIndex } }
      )
    }

    rounds.push(matches)
    entrants = nextEntrants
    round++
  }

  return { rounds, connectors }
}
