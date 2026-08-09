import { MatchMode } from '../domain/Group'

export type MatchPair = { homeTeamId: string; awayTeamId: string }

// Fictional opponent for odd team counts — pairs involving it produce no match.
const BYE: unique symbol = Symbol('bye')

// Circle method: team 0 stays fixed, the rest rotate one position each round.
// After n-1 rounds every team has played every other team exactly once.
// Mirror of backend/src/group/application/roundRobin.ts — keep both in sync.
export const roundRobin = (teamIds: string[], matchMode: MatchMode): MatchPair[] => {
  const ids: (string | typeof BYE)[] = [...teamIds]
  if (ids.length % 2 !== 0) {
    ids.push(BYE)
  }
  if (ids.length < 2) {
    return []
  }

  const fixed = ids[0]
  let rotating = ids.slice(1)
  const pairs: MatchPair[] = []

  for (let round = 0; round < ids.length - 1; round++) {
    const current = [fixed, ...rotating]
    for (let i = 0; i < current.length / 2; i++) {
      const home = current[i]
      const away = current[current.length - 1 - i]
      if (typeof home === 'string' && typeof away === 'string') {
        pairs.push({ homeTeamId: home, awayTeamId: away })
        if (matchMode === MatchMode.HOME_AND_AWAY) {
          pairs.push({ homeTeamId: away, awayTeamId: home })
        }
      }
    }
    rotating = [rotating[rotating.length - 1], ...rotating.slice(0, rotating.length - 1)]
  }

  return pairs
}
