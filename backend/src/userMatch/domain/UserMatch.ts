export type UserMatch = {
  id: string
  userId: string
  matchId: string
}

export type CreateUserMatchInput = Omit<UserMatch, 'id'>
