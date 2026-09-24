export type UserRole = 'ADMIN' | 'COACH' | 'PLAYER' | 'REFEREE'

export type UserProfile = {
  id: string
  firstName: string
  lastName: string | null
  email: string
  isAdmin: boolean
  isActive: boolean
  isBlocked: boolean
  isReferee: boolean
  loginAttempts: number
  avatar: string | null
  createdAt: Date
  updatedAt: Date
  roles: UserRole[]
}

/** What an authenticated request is allowed to do right now, read from the database (spec 10, Sécurité › Sessions). */
export type AuthState = {
  isAdmin: boolean
  isActive: boolean
  isBlocked: boolean
  isCoach: boolean
  /** JWTs issued before this date are refused (set by a password reset). */
  tokensValidAfter: Date | null
}

export type CreateUserInput = {
  firstName: string
  lastName?: string
  email: string
  password: string
  isAdmin?: boolean
  avatar?: string
}

export type UpdateUserInput = {
  firstName?: string
  lastName?: string
  email?: string
  avatar?: string
  isAdmin?: boolean
}
