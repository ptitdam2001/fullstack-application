import { type AuthData, DEFAULT_AUTH_DATA } from '../domain/Auth'

const STORAGE_KEY = 'user'

export const readAuthStorage = (): AuthData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthData) : DEFAULT_AUTH_DATA
  } catch {
    return DEFAULT_AUTH_DATA
  }
}

export const saveAuthStorage = (data: AuthData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const clearAuthStorage = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_AUTH_DATA))
}
