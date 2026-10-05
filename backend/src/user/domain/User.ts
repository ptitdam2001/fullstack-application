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

/**
 * Fields an admin may change on a user (PATCH /user/{id}). No `avatar`: a photo is set by its owner and
 * goes through `IUserRepository.replaceAvatar`.
 */
export type UpdateUserInput = {
  firstName?: string
  /** Null clears it. */
  lastName?: string | null
  email?: string
  isAdmin?: boolean
}

/** The only fields a user may change on their own profile (PATCH /me). */
export type UpdateMyProfileInput = {
  firstName?: string
  /** Null clears it. */
  lastName?: string | null
}
