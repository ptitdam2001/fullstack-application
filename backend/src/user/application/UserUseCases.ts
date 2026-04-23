import type { IUserRepository } from '../ports/IUserRepository.js'
import type { UserProfile, CreateUserInput, UpdateUserInput } from '../domain/User.js'
import { UserNotFoundError } from '../domain/UserErrors.js'

export class UserUseCases {
  constructor(private readonly userRepo: IUserRepository) {}

  async getAll(): Promise<UserProfile[]> {
    return this.userRepo.findAll()
  }

  async getById(id: string): Promise<UserProfile> {
    const user = await this.userRepo.findById(id)
    if (!user) throw new UserNotFoundError()
    return user
  }

  async create(input: CreateUserInput, hashPassword: (p: string) => Promise<string>): Promise<UserProfile> {
    const hashed = await hashPassword(input.password)
    return this.userRepo.create({ ...input, password: hashed })
  }

  async update(id: string, input: UpdateUserInput): Promise<UserProfile> {
    const existing = await this.userRepo.findById(id)
    if (!existing) throw new UserNotFoundError()
    return this.userRepo.update(id, input)
  }

  async delete(id: string): Promise<void> {
    const existing = await this.userRepo.findById(id)
    if (!existing) throw new UserNotFoundError()
    return this.userRepo.delete(id)
  }
}
