import type { User } from '../../domain/User'

/** "First Last", or the first name alone when lastName is null. */
export const userFullName = (user: Pick<User, 'firstName' | 'lastName'>) =>
  [user.firstName, user.lastName].filter(Boolean).join(' ')
