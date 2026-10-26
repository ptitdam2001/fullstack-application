import * as React from 'react'
import type { ThemeConfig } from '../../theme/types'

export type ThemeConfigContextValue = {
  themeConfig: ThemeConfig
  setThemeConfig: (config: ThemeConfig) => void
}

export const ThemeConfigContext = React.createContext<ThemeConfigContextValue | null>(null)
