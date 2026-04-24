export class UserTeamNotFoundError extends Error {
  constructor(userId: string, teamId: string, role: string) {
    super(`UserTeam not found: userId=${userId}, teamId=${teamId}, role=${role}`)
    this.name = 'UserTeamNotFoundError'
  }
}

export class UserTeamAlreadyExistsError extends Error {
  constructor(userId: string, teamId: string, role: string) {
    super(`User ${userId} already has role ${role} in team ${teamId}`)
    this.name = 'UserTeamAlreadyExistsError'
  }
}
