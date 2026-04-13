import { DEFAULT_AUTH_DATA } from './AuthProvider'

export const getAuthToken = (): string | undefined => {
  const raw = localStorage.getItem('user')
  return JSON.parse(raw ?? '{}')?.token
}

export const clearAuthStorage = (): void => {
  localStorage.setItem('user', JSON.stringify(DEFAULT_AUTH_DATA))
}
