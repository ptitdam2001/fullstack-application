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
  bracketId: string | null
  round: number | null
  bracketPosition: number | null
  status: MatchStatus
  scheduledAt: Date | null
  area: MatchArea | null
  homeTeamId: string | null
  awayTeamId: string | null
  homeGoals: number | null
  awayGoals: number | null
  forfeitedBy: string | null
  updatedAt: Date
}

export type CreateMatchInput = Omit<Match, 'id' | 'status' | 'updatedAt'> & { status?: MatchStatus }
export type UpdateMatchInput = Partial<CreateMatchInput>

export type MatchTeamSummary = {
  id: string
  name: string
  color: string | null
}

export type MatchWithDisplayData = Match & {
  championshipName: string | null
  stageName: string | null
  homeTeam: MatchTeamSummary | null
  awayTeam: MatchTeamSummary | null
}
