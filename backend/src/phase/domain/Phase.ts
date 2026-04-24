export enum PhaseType {
  GROUP = 'GROUP',
  KNOCKOUT = 'KNOCKOUT',
}

export type Phase = {
  id: string
  championshipId: string
  type: PhaseType
  order: number
  name: string | null
}

export type CreatePhaseInput = Omit<Phase, 'id'>
export type UpdatePhaseInput = Partial<CreatePhaseInput>
