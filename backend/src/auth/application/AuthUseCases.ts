import type { IUserRepository } from '../../user/ports/IUserRepository.js'
import type { IAuthService } from '../ports/IAuthService.js'
import type { UserProfile } from '../../user/domain/User.js'
import type { LoginResult } from '../domain/User.js'
import { InvalidCredentialsError } from '../domain/AuthErrors.js'
import { UserNotFoundError } from '../../user/domain/UserErrors.js'

export class AuthUseCases {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly authService: IAuthService
  ) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepo.findByEmailWithPassword(email)
    if (!user) throw new UserNotFoundError()

    const isMatch = await this.authService.comparePassword(password, user.password)
    if (!isMatch) throw new InvalidCredentialsError()

    const token = this.authService.generateToken(user.id, user.role)
    return { userId: user.id, email: user.email, role: user.role, token }
  }

  async me(userId: string): Promise<UserProfile> {
    const user = await this.userRepo.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }
}
