export class UserMatchNotFoundError extends Error {
  constructor(userId: string, matchId: string) {
    super(`UserMatch not found: userId=${userId}, matchId=${matchId}`)
    this.name = 'UserMatchNotFoundError'
  }
}

export class UserMatchAlreadyExistsError extends Error {
  constructor(userId: string, matchId: string) {
    super(`User ${userId} is already referee for match ${matchId}`)
    this.name = 'UserMatchAlreadyExistsError'
  }
}
