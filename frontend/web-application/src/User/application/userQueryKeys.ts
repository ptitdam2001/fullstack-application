import { getGetUsersQueryKey, getCountUsersQueryKey } from '../infrastructure/useUserApi'

// Param-less keys are prefixes: they also invalidate filtered/paginated variants and the admin dashboard queries.
export const userListInvalidates = [getGetUsersQueryKey(), getCountUsersQueryKey()]
