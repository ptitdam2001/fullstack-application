export enum Role {
  ADMIN = 'ADMIN',
  COACH = 'COACH',
  REFEREE = 'REFEREE',
  PLAYER = 'PLAYER',
}

export type UserProfile = {
  id: string
  firstName: string
  lastName: string | null
  email: string
  role: Role
  avatar: string | null
  createdAt: Date
}

export type CreateUserInput = {
  firstName: string
  lastName?: string
  email: string
  password: string
  role?: Role
  avatar?: string
}

export type UpdateUserInput = Partial<Omit<CreateUserInput, 'password'>>
