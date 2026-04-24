export type UserProfile = {
  id: string
  firstName: string
  lastName: string | null
  email: string
  isAdmin: boolean
  avatar: string | null
  createdAt: Date
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
