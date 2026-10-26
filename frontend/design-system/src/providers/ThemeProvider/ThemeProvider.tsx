import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeConfig, IThemeStorage } from '../../theme/types'
import { DEFAULT_THEME } from '../../theme/defaultTheme'
import { applyTheme } from '../../theme/applyTheme'
import { LocalStorageThemeStorage } from '../../theme/storage/LocalStorageThemeStorage'
import { ThemeConfigContext } from './ThemeConfigContext'

const defaultStorage = new LocalStorageThemeStorage()

type ThemeProviderProps = {
  children: React.ReactNode
  defaultMode?: 'light' | 'dark' | 'system'
  storage?: IThemeStorage
}

const ThemeConfigProvider = ({ children, storage }: { children: React.ReactNode; storage: IThemeStorage }) => {
  const [themeConfig, setThemeConfigState] = React.useState<ThemeConfig>(() => storage.load() ?? DEFAULT_THEME)

  const setThemeConfig = React.useCallback(
    (config: ThemeConfig) => {
      setThemeConfigState(config)
      applyTheme(config)
      storage.save(config)
    },
    [storage]
  )

  React.useEffect(() => {
    applyTheme(themeConfig)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <ThemeConfigContext.Provider value={{ themeConfig, setThemeConfig }}>{children}</ThemeConfigContext.Provider>
}

export const ThemeProvider = ({ children, defaultMode = 'system', storage = defaultStorage }: ThemeProviderProps) => (
  <NextThemesProvider attribute="class" defaultTheme={defaultMode} enableSystem disableTransitionOnChange>
    <ThemeConfigProvider storage={storage}>{children}</ThemeConfigProvider>
  </NextThemesProvider>
)
