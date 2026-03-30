
import { useLocalStorage } from '@Common/hooks/useLocalstorage'
import { createContextWithWrite } from '@repo/design-system'
import React from 'react'

export type Theme = 'light' | 'dark' | 'system'

const { Provider, useDispatch, useValue } = createContextWithWrite<Theme, Theme>('theme')

type ThemeProviderProps = {
  children: React.ReactNode
  initialTheme?: Theme
}

const LOCALSTORAGE_THEME_KEY = 'theme'

// eslint-disable-next-line react-refresh/only-export-components
export const useSetTheme = () => {
  const dispatch = useDispatch()
  const [, setToStore] = useLocalStorage(LOCALSTORAGE_THEME_KEY, 'system')

  return (theme: Theme) => {
    dispatch(theme)
    setToStore(theme)
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = useValue

const ThemeApplier: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useValue()

  React.useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme }) => {
  const [lsTheme] = useLocalStorage(LOCALSTORAGE_THEME_KEY, initialTheme || 'system')

  return (
    <Provider value={lsTheme}>
      <ThemeApplier>{children}</ThemeApplier>
    </Provider>
  )
}
