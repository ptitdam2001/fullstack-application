import type { UserProfile, CreateUserInput, UpdateUserInput } from '../domain/User.js'

export interface IUserRepository {
  findById(id: string): Promise<UserProfile | null>
  findByEmailWithPassword(email: string): Promise<(UserProfile & { password: string }) | null>
  findAll(): Promise<UserProfile[]>
  create(input: CreateUserInput): Promise<UserProfile>
  update(id: string, input: UpdateUserInput): Promise<UserProfile>
  delete(id: string): Promise<void>
}
