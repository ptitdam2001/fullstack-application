export type BracketTeamEntry = {
  teamId: string
  round: number
  seed: number
}

export type Bracket = {
  id: string
  phaseId: string
  name: string
  bracketTeams: BracketTeamEntry[]
  updatedAt: Date
}

export type CreateBracketInput = Omit<Bracket, 'id' | 'updatedAt'>
