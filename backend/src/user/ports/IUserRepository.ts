import type { AuthState, UserProfile, UpdateUserInput } from '../domain/User.js'

export type UserFilterOptions = { isActive?: boolean }
/** Zero-based page. Pagination is opt-in: omitted → every matching user is returned. */
export type UserPagination = { page: number; limit: number }
export type UserListOptions = UserFilterOptions & { pagination?: UserPagination }

export interface IUserRepository {
  findById(id: string): Promise<UserProfile | null>
  findByEmailWithPassword(email: string): Promise<(UserProfile & { password: string; lockedUntil: Date | null }) | null>
  findByIdWithPassword(id: string): Promise<(UserProfile & { password: string }) | null>
  findAll(options?: UserListOptions): Promise<UserProfile[]>
  count(filters?: UserFilterOptions): Promise<number>
  update(id: string, input: UpdateUserInput): Promise<UserProfile>
  delete(id: string): Promise<void>
  incrementLoginAttempts(userId: string): Promise<number>
  lockUntil(userId: string, until: Date): Promise<void>
  resetLoginAttempts(userId: string): Promise<void>
  findAuthState(userId: string): Promise<AuthState | null>
  /**
   * Stores the new hash and revokes every token issued before `tokensValidAfter`. Also clears the failed
   * login counter, the temporary lock and any pending reset link.
   */
  changePassword(userId: string, hashedPassword: string, tokensValidAfter: Date): Promise<void>
}
