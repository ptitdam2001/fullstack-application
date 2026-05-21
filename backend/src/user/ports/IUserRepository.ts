import type { UserProfile, CreateUserInput, UpdateUserInput } from '../domain/User.js'

export type UserFilterOptions = { isActive?: boolean }

export interface IUserRepository {
  findById(id: string): Promise<UserProfile | null>
  findByEmailWithPassword(email: string): Promise<(UserProfile & { password: string }) | null>
  findAll(filters?: UserFilterOptions): Promise<UserProfile[]>
  create(input: CreateUserInput): Promise<UserProfile>
  update(id: string, input: UpdateUserInput): Promise<UserProfile>
  delete(id: string): Promise<void>
  incrementLoginAttempts(userId: string): Promise<number>
  blockUser(userId: string): Promise<void>
}
