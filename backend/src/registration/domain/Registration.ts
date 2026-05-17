export type RegistrationUser = {
  id: string
  firstName: string
  lastName: string | null
  email: string
  isAdmin: boolean
  isActive: boolean
  isBlocked: boolean
  isReferee: boolean
  avatar: string | null
  createdAt: Date
  activationTokenExpiry: Date | null
  resetTokenExpiry: Date | null
}

export type CreateRegistrationInput = {
  firstName: string
  lastName?: string
  email: string
  password: string
}

export type RegisterInput = {
  firstName: string
  lastName?: string
  email: string
  password: string
  teamId?: string
}
