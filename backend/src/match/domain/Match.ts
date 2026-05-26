export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  PLAYED = 'PLAYED',
  FORFEITED = 'FORFEITED',
  CANCELLED = 'CANCELLED',
}

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
  groupId: string | null
  status: MatchStatus
  scheduledAt: Date | null
  area: MatchArea | null
  homeTeamId: string
  awayTeamId: string
  homeGoals: number | null
  awayGoals: number | null
  forfeitedBy: string | null
  updatedAt: Date
}

export type CreateMatchInput = Omit<Match, 'id' | 'status'> & { status?: MatchStatus }
export type UpdateMatchInput = Partial<CreateMatchInput>
