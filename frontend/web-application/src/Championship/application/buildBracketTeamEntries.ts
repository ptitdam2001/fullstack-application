import type { BracketTeamEntry } from '../domain/Bracket'

type Slot = { teamId: string; seed: number } | null

// Same pairing as buildBracket.ts (sequential pairing, trailing odd entrant byes forward,
// chained across rounds if needed) but records, for each team, the round where it plays its
// first real match — that's the `round` backend/buildBracketMatches.ts expects per entry: a
// team byeing through rounds 1..k only gets a bracketTeams entry at round k+1, not at 1..k.
export const buildBracketTeamEntries = (teamIds: string[]): BracketTeamEntry[] => {
  let slots: Slot[] = teamIds.map((teamId, i) => ({ teamId, seed: i + 1 }))
  const entries: BracketTeamEntry[] = []
  let round = 1

  while (slots.length > 1) {
    const next: Slot[] = []
    for (let i = 0; i < slots.length; i += 2) {
      const a = slots[i]
      const hasPair = i + 1 < slots.length
      if (!hasPair) {
        next.push(a)
        continue
      }
      const b = slots[i + 1]
      if (a) {
        entries.push({ teamId: a.teamId, round, seed: a.seed })
      }
      if (b) {
        entries.push({ teamId: b.teamId, round, seed: b.seed })
      }
      next.push(null)
    }
    slots = next
    round++
  }

  return entries
}
