import type { AuthState, UserProfile, CreateUserInput, UpdateUserInput } from '../domain/User.js'

export type UserFilterOptions = { isActive?: boolean }
/** Zero-based page. Pagination is opt-in: omitted → every matching user is returned. */
export type UserPagination = { page: number; limit: number }
export type UserListOptions = UserFilterOptions & { pagination?: UserPagination }

export interface IUserRepository {
  findById(id: string): Promise<UserProfile | null>
  findByEmailWithPassword(email: string): Promise<(UserProfile & { password: string; lockedUntil: Date | null }) | null>
  findAll(options?: UserListOptions): Promise<UserProfile[]>
  count(filters?: UserFilterOptions): Promise<number>
  create(input: CreateUserInput): Promise<UserProfile>
  update(id: string, input: UpdateUserInput): Promise<UserProfile>
  delete(id: string): Promise<void>
  incrementLoginAttempts(userId: string): Promise<number>
  lockUntil(userId: string, until: Date): Promise<void>
  resetLoginAttempts(userId: string): Promise<void>
  findAuthState(userId: string): Promise<AuthState | null>
}
