import { type AuthData, DEFAULT_AUTH_DATA } from '../domain/Auth'

export const clearAuthStorage = (): void => {
  localStorage.setItem('user', JSON.stringify(DEFAULT_AUTH_DATA))
}

export const saveAuthStorage = (data: AuthData): void => {
  localStorage.setItem('user', JSON.stringify(data))
}
