export type StandingRow = {
  rank: number
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  forfeited: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export type GroupStandings = {
  groupId: string
  rows: StandingRow[]
}
