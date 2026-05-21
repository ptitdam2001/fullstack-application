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
  roles: UserRole[]
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
}
