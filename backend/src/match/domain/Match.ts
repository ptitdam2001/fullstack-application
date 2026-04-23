export type MatchTeam = { teamId: string; score: number }

export type MatchArea = {
  id: string
  name: string | null
  address: string
  city: string
  longitude: number
  latitude: number
}

export type Match = {
  id: string
  date: Date | null
  area: MatchArea
  teams: MatchTeam[]
}

export type CreateMatchInput = Omit<Match, 'id'>
export type UpdateMatchInput = Partial<CreateMatchInput>
