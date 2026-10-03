import type { IUserRepository } from '../ports/IUserRepository.js'
import type { IImageStorage } from '../../image/ports/IImageStorage.js'
import type { UpdateMyProfileInput, UserProfile } from '../domain/User.js'
import { MAX_AVATAR_BASE64_LENGTH, MAX_AVATAR_BYTES, type UploadAvatarInput } from '../domain/Avatar.js'
import { InvalidAvatarError, UserNotFoundError } from '../domain/UserErrors.js'
import { IMAGE_CONTENT_TYPES } from '../../image/domain/Image.js'
import { matchesImageSignature } from '../../image/domain/imageSignature.js'

// Standard padded base64 only. `Buffer.from(_, 'base64')` silently skips what it does not understand,
// so the text is checked before it is decoded.
const BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

/** What an authenticated user may do to their own account, whatever their role (spec: page compte). */
export class ProfileUseCases {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly imageStorage: IImageStorage
  ) {}

  async updateProfile(userId: string, input: UpdateMyProfileInput): Promise<UserProfile> {
    await this.requireUser(userId)
    // Explicit whitelist: whatever else the caller sends (isAdmin, email, avatar…) never reaches the repository.
    return this.userRepo.update(userId, {
      ...(input.firstName !== undefined && { firstName: input.firstName }),
      ...(input.lastName !== undefined && { lastName: input.lastName }),
    })
  }

  async updateAvatar(userId: string, input: UploadAvatarInput): Promise<UserProfile> {
    const data = this.decodeAvatar(input)
    await this.requireUser(userId)

    // New image first, pointer second, cleanup last: a failure at any step leaves a profile whose
    // avatar still resolves.
    const saved = await this.imageStorage.save({ data, contentType: input.contentType, ownerId: userId })
    const updated = await this.userRepo.update(userId, { avatar: saved.url })
    await this.imageStorage.deleteByOwner(userId, { exceptId: saved.id })
    return updated
  }

  /** Idempotent: succeeds when there is no avatar. */
  async removeAvatar(userId: string): Promise<UserProfile> {
    await this.requireUser(userId)
    const updated = await this.userRepo.update(userId, { avatar: null })
    await this.imageStorage.deleteByOwner(userId)
    return updated
  }

  private async requireUser(userId: string): Promise<void> {
    if (!(await this.userRepo.findById(userId))) {
      throw new UserNotFoundError()
    }
  }

  private decodeAvatar({ contentType, data }: UploadAvatarInput): Buffer {
    if (!IMAGE_CONTENT_TYPES.includes(contentType)) {
      throw new InvalidAvatarError('UNSUPPORTED_TYPE')
    }
    if (typeof data !== 'string' || data.length === 0) {
      throw new InvalidAvatarError('EMPTY')
    }
    // Checked on the text, before decoding or running the regex on it.
    if (data.length > MAX_AVATAR_BASE64_LENGTH) {
      throw new InvalidAvatarError('TOO_LARGE')
    }
    if (!BASE64.test(data)) {
      throw new InvalidAvatarError('INVALID_ENCODING')
    }
    const bytes = Buffer.from(data, 'base64')
    if (bytes.length === 0) {
      throw new InvalidAvatarError('EMPTY')
    }
    if (bytes.length > MAX_AVATAR_BYTES) {
      throw new InvalidAvatarError('TOO_LARGE')
    }
    if (!matchesImageSignature(bytes, contentType)) {
      throw new InvalidAvatarError('CONTENT_MISMATCH')
    }
    return bytes
  }
}
