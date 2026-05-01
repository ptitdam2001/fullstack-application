import type { UserWithoutPassword } from '@Sdk/model'

export type AuthData = {
  user?: UserWithoutPassword
  token?: string
}

export const DEFAULT_AUTH_DATA: AuthData = {
  user: undefined,
  token: undefined,
}

export const LOGIN_PAGE = '/auth/signin'
export const CONNECTED_HOME = '/app'
export const LOGOUT_PAGE = '/auth/logout'
