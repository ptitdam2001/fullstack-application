export type TokenPayload = {
  userId: string
  isAdmin: boolean
  isCoach: boolean
  /** `User.tokenVersion` when the token was signed. Absent from tokens issued before versions existed. */
  ver?: number
  iat?: number
  exp?: number
}

export type LoginResult = {
  userId: string
  email: string
  isAdmin: boolean
  token: string
}
