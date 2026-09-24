import type { IUserRepository, UserFilterOptions, UserListOptions } from '../ports/IUserRepository.js'
import type { UserProfile, CreateUserInput, UpdateUserInput } from '../domain/User.js'
import { CannotSelfDeleteError, CannotSelfDemoteError, UserNotFoundError } from '../domain/UserErrors.js'

export class UserUseCases {
  constructor(private readonly userRepo: IUserRepository) {}

  async getAll(options?: UserListOptions): Promise<UserProfile[]> {
    return this.userRepo.findAll(options)
  }

  async count(filters?: UserFilterOptions): Promise<number> {
    return this.userRepo.count(filters)
  }

  async getById(id: string): Promise<UserProfile> {
    const user = await this.userRepo.findById(id)
    if (!user) {
      throw new UserNotFoundError()
    }
    return user
  }

  async create(input: CreateUserInput, hashPassword: (p: string) => Promise<string>): Promise<UserProfile> {
    const hashed = await hashPassword(input.password)
    return this.userRepo.create({ ...input, password: hashed })
  }

  /** @param actorId the authenticated admin performing the update */
  async update(id: string, input: UpdateUserInput, actorId: string): Promise<UserProfile> {
    const existing = await this.userRepo.findById(id)
    if (!existing) {
      throw new UserNotFoundError()
    }
    // Strict `=== false`: an update without isAdmin (undefined) must not count as a revoke
    if (id === actorId && input.isAdmin === false) {
      throw new CannotSelfDemoteError()
    }
    return this.userRepo.update(id, input)
  }

  /** @param actorId the authenticated admin performing the deletion */
  async delete(id: string, actorId: string): Promise<void> {
    const existing = await this.userRepo.findById(id)
    if (!existing) {
      throw new UserNotFoundError()
    }
    if (id === actorId) {
      throw new CannotSelfDeleteError()
    }
    return this.userRepo.delete(id)
  }
}
