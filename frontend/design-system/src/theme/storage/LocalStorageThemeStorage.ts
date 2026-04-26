import type { IThemeStorage, ThemeConfig } from '../types'

const STORAGE_KEY = 'ds-theme-config'

export class LocalStorageThemeStorage implements IThemeStorage {
  load(): ThemeConfig | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as ThemeConfig) : null
    } catch {
      return null
    }
  }

  save(config: ThemeConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch {
      // Storage quota exceeded or private browsing — silent fail
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY)
  }
}
