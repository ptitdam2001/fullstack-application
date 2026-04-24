export enum TeamRole {
  COACH = 'COACH',
  PLAYER = 'PLAYER',
}

export type UserTeam = {
  id: string
  userId: string
  teamId: string
  role: TeamRole
}

export type CreateUserTeamInput = Omit<UserTeam, 'id'>
