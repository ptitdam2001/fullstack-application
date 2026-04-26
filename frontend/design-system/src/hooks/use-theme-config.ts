import { useContext } from 'react'
import { useTheme as useNextTheme } from 'next-themes'
import { ThemeConfigContext } from '../providers/ThemeProvider/ThemeProvider'
import type { ThemeConfig, ThemeTokens } from '../theme/types'
import { DEFAULT_THEME } from '../theme/defaultTheme'

export type UseThemeConfigReturn = {
  themeConfig: ThemeConfig
  colorMode: string | undefined
  setColorMode: (mode: string) => void
  setThemeConfig: (config: ThemeConfig) => void
  updateTokens: (tokens: Partial<ThemeTokens>, mode?: 'light' | 'dark') => void
  resetTheme: () => void
}

export const useThemeConfig = (): UseThemeConfigReturn => {
  const ctx = useContext(ThemeConfigContext)
  if (!ctx) {
    throw new Error('useThemeConfig must be used within ThemeProvider')
  }

  const { theme, setTheme } = useNextTheme()

  const updateTokens = (tokens: Partial<ThemeTokens>, mode: 'light' | 'dark' = 'light') => {
    ctx.setThemeConfig({
      ...ctx.themeConfig,
      tokens: {
        ...ctx.themeConfig.tokens,
        [mode]: { ...ctx.themeConfig.tokens[mode], ...tokens },
      },
    })
  }

  const resetTheme = () => ctx.setThemeConfig(DEFAULT_THEME)

  return {
    themeConfig: ctx.themeConfig,
    setThemeConfig: ctx.setThemeConfig,
    colorMode: theme,
    setColorMode: setTheme,
    updateTokens,
    resetTheme,
  }
}
