import type { AuthState, UserProfile, UpdateUserInput } from '../domain/User.js'

export type UserFilterOptions = { isActive?: boolean }
/** Zero-based page. Pagination is opt-in: omitted → every matching user is returned. */
export type UserPagination = { page: number; limit: number }
export type UserListOptions = UserFilterOptions & { pagination?: UserPagination }

/** `user` is the profile read after the change; `previousAvatar` the value the change replaced. */
export type AvatarReplacement = { user: UserProfile; previousAvatar: string | null }

export interface IUserRepository {
  findById(id: string): Promise<UserProfile | null>
  findByEmailWithPassword(email: string): Promise<(UserProfile & { password: string; lockedUntil: Date | null }) | null>
  findByIdWithPassword(id: string): Promise<(UserProfile & { password: string }) | null>
  findAll(options?: UserListOptions): Promise<UserProfile[]>
  count(filters?: UserFilterOptions): Promise<number>
  update(id: string, input: UpdateUserInput): Promise<UserProfile>
  /**
   * Points the user at `avatar` (null: no avatar) and returns the value it replaced. Null when the user does
   * not exist.
   *
   * Atomic: among concurrent calls for the same user, a given value is handed back as `previousAvatar` to
   * exactly one of them. The caller therefore owns the cleanup of what it replaced, and nobody else does.
   */
  replaceAvatar(id: string, avatar: string | null): Promise<AvatarReplacement | null>
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
  /** Refuses every token issued before `at`: all the sessions of the user are signed out. */
  revokeTokens(userId: string, at: Date): Promise<void>
}
