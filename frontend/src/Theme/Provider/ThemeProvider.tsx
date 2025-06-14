import { createContextWithWrite } from '@Common/Context/createContextWithWrite'
import { useLocalStorage } from '@Common/hooks/useLocalstorage'
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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme }) => {
  const [lsTheme] = useLocalStorage(LOCALSTORAGE_THEME_KEY, initialTheme || 'system')

  React.useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (lsTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(lsTheme)
  }, [lsTheme])

  return <Provider value={lsTheme}>{children}</Provider>
}
