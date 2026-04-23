import type { Role } from '../../user/domain/User.js'

export type TokenPayload = {
  data: string
  role: Role
  iat?: number
  exp?: number
}

export type LoginResult = {
  userId: string
  email: string
  role: Role
  token: string
}
