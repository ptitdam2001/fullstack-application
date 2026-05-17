import type { IRegistrationRepository } from '../ports/IRegistrationRepository.js'
import type { IEmailService } from '../ports/IEmailService.js'
import type { IAuthService } from '../../auth/ports/IAuthService.js'
import type { RegistrationUser, RegisterInput } from '../domain/Registration.js'
import { EmailAlreadyUsedError, InvalidTokenError } from '../domain/RegistrationErrors.js'
import { UserNotFoundError } from '../../user/domain/UserErrors.js'

const ACTIVATION_EXPIRY_HOURS = (): number => parseInt(process.env.ACTIVATION_TOKEN_EXPIRY_HOURS ?? '48')
const RESET_EXPIRY_MS = 7 * 24 * 3_600_000

export class RegistrationUseCases {
  constructor(
    private readonly repo: IRegistrationRepository,
    private readonly emailService: IEmailService,
    private readonly authService: IAuthService
  ) {}

  async register(input: RegisterInput): Promise<RegistrationUser> {
    const exists = await this.repo.existsByEmail(input.email)
    if (exists) throw new EmailAlreadyUsedError()

    const hashed = await this.authService.hashPassword(input.password)
    const token = crypto.randomUUID()
    const expiry = new Date(Date.now() + ACTIVATION_EXPIRY_HOURS() * 3_600_000)

    const user = input.teamId
      ? await this.repo.createWithJoinRequest(
          { firstName: input.firstName, lastName: input.lastName, email: input.email, password: hashed },
          token,
          expiry,
          input.teamId
        )
      : await this.repo.create(
          { firstName: input.firstName, lastName: input.lastName, email: input.email, password: hashed },
          token,
          expiry
        )

    await this.emailService.sendActivationEmail(input.email, token)
    return user
  }

  async activateAccount(token: string): Promise<void> {
    const user = await this.repo.findByActivationToken(token)
    if (!user) throw new InvalidTokenError()
    if (user.activationTokenExpiry && user.activationTokenExpiry < new Date()) throw new InvalidTokenError()
    if (user.isActive) return
    await this.repo.activateAccount(user.id)
  }

  async resendActivation(email: string): Promise<void> {
    const user = await this.repo.findByEmail(email)
    if (!user || user.isActive) return

    const token = crypto.randomUUID()
    const expiry = new Date(Date.now() + ACTIVATION_EXPIRY_HOURS() * 3_600_000)
    await this.repo.setActivationToken(user.id, token, expiry)
    await this.emailService.sendActivationEmail(email, token)
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.repo.findByEmail(email)
    if (!user) return

    const token = crypto.randomUUID()
    const expiry = new Date(Date.now() + RESET_EXPIRY_MS)
    await this.repo.setResetToken(user.id, token, expiry)
    await this.emailService.sendPasswordResetEmail(email, token)
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.repo.findByResetToken(token)
    if (!user) throw new InvalidTokenError()
    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) throw new InvalidTokenError()

    const hashed = await this.authService.hashPassword(newPassword)
    await this.repo.resetPassword(user.id, hashed)
  }

  async declareReferee(userId: string): Promise<void> {
    await this.repo.declareReferee(userId)
  }

  async adminActivateUser(userId: string): Promise<void> {
    await this.repo.adminActivateUser(userId)
  }

  async adminUnblockUser(userId: string): Promise<void> {
    await this.repo.adminUnblockUser(userId)
  }
}
