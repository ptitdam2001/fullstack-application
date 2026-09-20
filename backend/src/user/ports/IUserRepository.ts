import type { AuthState, UserProfile, CreateUserInput, UpdateUserInput } from '../domain/User.js'

export type UserFilterOptions = { isActive?: boolean }

export interface IUserRepository {
  findById(id: string): Promise<UserProfile | null>
  findByEmailWithPassword(email: string): Promise<(UserProfile & { password: string; lockedUntil: Date | null }) | null>
  findAll(filters?: UserFilterOptions): Promise<UserProfile[]>
  create(input: CreateUserInput): Promise<UserProfile>
  update(id: string, input: UpdateUserInput): Promise<UserProfile>
  delete(id: string): Promise<void>
  incrementLoginAttempts(userId: string): Promise<number>
  lockUntil(userId: string, until: Date): Promise<void>
  resetLoginAttempts(userId: string): Promise<void>
  findAuthState(userId: string): Promise<AuthState | null>
}
