export type { User, UpdateUserInput } from '@Sdk/model'
export { UserRole } from '@Sdk/model'
export { UpdateUserBody } from '@Sdk/users/users.zod'

/** Filters shared by the user list and its count, so the pagination total always matches the rows. */
export type UserListFilters = {
  isActive?: boolean
}
