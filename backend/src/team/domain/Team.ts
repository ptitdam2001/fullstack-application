export type Team = {
  id: string
  name: string
  color: string | null
}

export type CreateTeamInput = Omit<Team, 'id'>
export type UpdateTeamInput = Partial<CreateTeamInput>
