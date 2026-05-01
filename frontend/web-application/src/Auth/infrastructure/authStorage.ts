import { type AuthData, DEFAULT_AUTH_DATA } from '../domain/Auth'

export const readAuthStorage = (): AuthData => {
  try {
    const value = localStorage.getItem('user')
    return value ? (JSON.parse(value) as AuthData) : DEFAULT_AUTH_DATA
  } catch {
    return DEFAULT_AUTH_DATA
  }
}

export const clearAuthStorage = (): void => {
  localStorage.setItem('user', JSON.stringify(DEFAULT_AUTH_DATA))
}

export const saveAuthStorage = (data: AuthData): void => {
  localStorage.setItem('user', JSON.stringify(data))
}
