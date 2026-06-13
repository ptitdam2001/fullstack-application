import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RegistrationUseCases } from './RegistrationUseCases.js'
import type { IRegistrationRepository } from '../ports/IRegistrationRepository.js'
import type { IEmailService } from '../ports/IEmailService.js'
import type { IAuthService } from '../../auth/ports/IAuthService.js'
import { EmailAlreadyUsedError, InvalidTokenError } from '../domain/RegistrationErrors.js'
import { UserNotFoundError } from '../../user/domain/UserErrors.js'

const now = new Date()
const future = new Date(now.getTime() + 3_600_000)
const past = new Date(now.getTime() - 3_600_000)

const mockUser = {
  id: 'user-1',
  firstName: 'Alice',
  lastName: 'Dupont',
  email: 'alice@example.com',
  isAdmin: false,
  isActive: false,
  isBlocked: false,
  isReferee: false,
  avatar: null,
  createdAt: now,
  activationTokenExpiry: future,
  resetTokenExpiry: future,
}

const makeRepo = (overrides: Partial<IRegistrationRepository> = {}): IRegistrationRepository => ({
  existsByEmail: vi.fn().mockResolvedValue(false),
  findById: vi.fn().mockResolvedValue(mockUser),
  findByEmail: vi.fn().mockResolvedValue(mockUser),
  findByActivationToken: vi.fn().mockResolvedValue(mockUser),
  findByResetToken: vi.fn().mockResolvedValue(mockUser),
  create: vi.fn().mockResolvedValue(mockUser),
  createWithJoinRequest: vi.fn().mockResolvedValue(mockUser),
  activateAccount: vi.fn().mockResolvedValue(undefined),
  setActivationToken: vi.fn().mockResolvedValue(undefined),
  setResetToken: vi.fn().mockResolvedValue(undefined),
  resetPassword: vi.fn().mockResolvedValue(undefined),
  declareReferee: vi.fn().mockResolvedValue(undefined),
  adminActivateUser: vi.fn().mockResolvedValue(undefined),
  adminUnblockUser: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const makeEmailService = (overrides: Partial<IEmailService> = {}): IEmailService => ({
  sendActivationEmail: vi.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const makeAuthService = (overrides: Partial<IAuthService> = {}): IAuthService => ({
  generateToken: vi.fn().mockReturnValue('jwt-token'),
  verifyToken: vi.fn(),
  hashPassword: vi.fn().mockResolvedValue('hashed'),
  comparePassword: vi.fn().mockResolvedValue(true),
  ...overrides,
})

const make = (
  repo?: Partial<IRegistrationRepository>,
  email?: Partial<IEmailService>,
  auth?: Partial<IAuthService>
) => new RegistrationUseCases(makeRepo(repo), makeEmailService(email), makeAuthService(auth))

describe('RegistrationUseCases.register', () => {
  it('creates user and sends activation email on success', async () => {
    const emailService = makeEmailService()
    const repo = makeRepo()
    const uc = new RegistrationUseCases(repo, emailService, makeAuthService())
    await uc.register({ firstName: 'Alice', email: 'alice@example.com', password: 'Password1' })
    expect(repo.create).toHaveBeenCalled()
    expect(emailService.sendActivationEmail).toHaveBeenCalled()
  })

  it('throws EmailAlreadyUsedError when email exists', async () => {
    await expect(
      make({ existsByEmail: vi.fn().mockResolvedValue(true) }).register({
        firstName: 'Alice',
        email: 'alice@example.com',
        password: 'Password1',
      })
    ).rejects.toThrow(EmailAlreadyUsedError)
  })

  it('uses createWithJoinRequest when teamId provided', async () => {
    const repo = makeRepo()
    const uc = new RegistrationUseCases(repo, makeEmailService(), makeAuthService())
    await uc.register({ firstName: 'Alice', email: 'alice@example.com', password: 'Password1', teamId: 'team-1' })
    expect(repo.createWithJoinRequest).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'alice@example.com' }),
      expect.any(String),
      expect.any(Date),
      'team-1'
    )
    expect(repo.create).not.toHaveBeenCalled()
  })

  it('hashes password before storing', async () => {
    const repo = makeRepo()
    const authService = makeAuthService()
    await new RegistrationUseCases(repo, makeEmailService(), authService).register({
      firstName: 'Alice',
      email: 'alice@example.com',
      password: 'Password1',
    })
    expect(authService.hashPassword).toHaveBeenCalledWith('Password1')
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ password: 'hashed' }), expect.any(String), expect.any(Date))
  })
})

describe('RegistrationUseCases.activateAccount', () => {
  it('activates account when token is valid', async () => {
    const repo = makeRepo()
    await new RegistrationUseCases(repo, makeEmailService(), makeAuthService()).activateAccount('valid-token')
    expect(repo.activateAccount).toHaveBeenCalledWith('user-1')
  })

  it('throws InvalidTokenError when token not found', async () => {
    await expect(
      make({ findByActivationToken: vi.fn().mockResolvedValue(null) }).activateAccount('bad-token')
    ).rejects.toThrow(InvalidTokenError)
  })

  it('throws InvalidTokenError when token is expired', async () => {
    await expect(
      make({ findByActivationToken: vi.fn().mockResolvedValue({ ...mockUser, activationTokenExpiry: past }) }).activateAccount('expired-token')
    ).rejects.toThrow(InvalidTokenError)
  })

  it('does nothing when account already active (idempotent)', async () => {
    const repo = makeRepo({ findByActivationToken: vi.fn().mockResolvedValue({ ...mockUser, isActive: true }) })
    await new RegistrationUseCases(repo, makeEmailService(), makeAuthService()).activateAccount('token')
    expect(repo.activateAccount).not.toHaveBeenCalled()
  })
})

describe('RegistrationUseCases.resendActivation', () => {
  it('sends new activation email when user is inactive', async () => {
    const repo = makeRepo()
    const emailService = makeEmailService()
    await new RegistrationUseCases(repo, emailService, makeAuthService()).resendActivation('alice@example.com')
    expect(repo.setActivationToken).toHaveBeenCalled()
    expect(emailService.sendActivationEmail).toHaveBeenCalled()
  })

  it('does nothing and does not throw when user not found', async () => {
    const repo = makeRepo({ findByEmail: vi.fn().mockResolvedValue(null) })
    const emailService = makeEmailService()
    await expect(new RegistrationUseCases(repo, emailService, makeAuthService()).resendActivation('unknown@example.com')).resolves.toBeUndefined()
    expect(emailService.sendActivationEmail).not.toHaveBeenCalled()
  })

  it('does nothing when user is already active', async () => {
    const repo = makeRepo({ findByEmail: vi.fn().mockResolvedValue({ ...mockUser, isActive: true }) })
    const emailService = makeEmailService()
    await new RegistrationUseCases(repo, emailService, makeAuthService()).resendActivation('alice@example.com')
    expect(emailService.sendActivationEmail).not.toHaveBeenCalled()
  })
})

describe('RegistrationUseCases.forgotPassword', () => {
  it('sets reset token and sends email when user found', async () => {
    const repo = makeRepo()
    const emailService = makeEmailService()
    await new RegistrationUseCases(repo, emailService, makeAuthService()).forgotPassword('alice@example.com')
    expect(repo.setResetToken).toHaveBeenCalled()
    expect(emailService.sendPasswordResetEmail).toHaveBeenCalled()
  })

  it('does nothing and does not throw when user not found', async () => {
    const repo = makeRepo({ findByEmail: vi.fn().mockResolvedValue(null) })
    const emailService = makeEmailService()
    await expect(new RegistrationUseCases(repo, emailService, makeAuthService()).forgotPassword('unknown@example.com')).resolves.toBeUndefined()
    expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled()
  })
})

describe('RegistrationUseCases.resetPassword', () => {
  it('resets password when token is valid', async () => {
    const repo = makeRepo()
    await make(repo).resetPassword('valid-token', 'NewPassword1')
    expect(repo.resetPassword).toHaveBeenCalledWith('user-1', 'hashed')
  })

  it('throws InvalidTokenError when token not found', async () => {
    await expect(
      make({ findByResetToken: vi.fn().mockResolvedValue(null) }).resetPassword('bad-token', 'NewPassword1')
    ).rejects.toThrow(InvalidTokenError)
  })

  it('throws InvalidTokenError when token is expired', async () => {
    await expect(
      make({ findByResetToken: vi.fn().mockResolvedValue({ ...mockUser, resetTokenExpiry: past }) }).resetPassword(
        'expired-token',
        'NewPassword1'
      )
    ).rejects.toThrow(InvalidTokenError)
  })
})

describe('RegistrationUseCases.declareReferee', () => {
  it('calls repo.declareReferee with userId', async () => {
    const repo = makeRepo()
    await new RegistrationUseCases(repo, makeEmailService(), makeAuthService()).declareReferee('user-1')
    expect(repo.declareReferee).toHaveBeenCalledWith('user-1')
  })
})

describe('RegistrationUseCases.adminActivateUser', () => {
  it('calls repo.adminActivateUser with userId', async () => {
    const repo = makeRepo()
    await new RegistrationUseCases(repo, makeEmailService(), makeAuthService()).adminActivateUser('user-1')
    expect(repo.adminActivateUser).toHaveBeenCalledWith('user-1')
  })

  it('throws UserNotFoundError when userId does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(
      new RegistrationUseCases(repo, makeEmailService(), makeAuthService()).adminActivateUser('unknown')
    ).rejects.toThrow(UserNotFoundError)
    expect(repo.adminActivateUser).not.toHaveBeenCalled()
  })
})

describe('RegistrationUseCases.adminUnblockUser', () => {
  it('calls repo.adminUnblockUser with userId', async () => {
    const repo = makeRepo()
    await new RegistrationUseCases(repo, makeEmailService(), makeAuthService()).adminUnblockUser('user-1')
    expect(repo.adminUnblockUser).toHaveBeenCalledWith('user-1')
  })

  it('throws UserNotFoundError when userId does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(
      new RegistrationUseCases(repo, makeEmailService(), makeAuthService()).adminUnblockUser('unknown')
    ).rejects.toThrow(UserNotFoundError)
    expect(repo.adminUnblockUser).not.toHaveBeenCalled()
  })
})