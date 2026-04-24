export type TokenPayload = {
  userId: string
  isAdmin: boolean
  iat?: number
  exp?: number
}

export type LoginResult = {
  userId: string
  email: string
  isAdmin: boolean
  token: string
}
