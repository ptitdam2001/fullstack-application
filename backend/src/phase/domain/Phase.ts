export enum PhaseType {
  GROUP = 'GROUP',
  KNOCKOUT = 'KNOCKOUT',
}

export type PhaseQualification = {
  maxRank: number
}

export type Phase = {
  id: string
  championshipId: string
  type: PhaseType
  order: number
  name: string | null
  qualification: PhaseQualification | null
  updatedAt: Date
}

export type CreatePhaseInput = Omit<Phase, 'id' | 'updatedAt'>
export type UpdatePhaseInput = Partial<CreatePhaseInput>

export type QualifiedTeam = {
  teamId: string
  groupId: string
  rank: number
}
