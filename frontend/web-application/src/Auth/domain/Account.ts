import type { UserWithoutPassword } from '@Sdk/model'

export type { UserWithoutPassword, UpdateMyProfileInput, UploadAvatarInput } from '@Sdk/model'
export { UpdateMyProfileBody, ChangeMyPasswordBody } from '@Sdk/authentication/authentication.zod'

/** MIME types the avatar endpoint accepts — also drives the file picker `accept` attribute. */
export const AVATAR_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

/** Side, in pixels, of the square the picture is resized to before upload. */
export const AVATAR_SIZE = 256

export const isAcceptedAvatarType = (type: string): boolean =>
  (AVATAR_ACCEPTED_TYPES as readonly string[]).includes(type)

export type AvatarErrorCode = 'invalidType' | 'unreadable' | 'rejected' | 'generic'

export const getUserInitials = (user?: Pick<UserWithoutPassword, 'firstName' | 'lastName'>): string =>
  [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map(name => name![0]?.toUpperCase())
    .join('')
