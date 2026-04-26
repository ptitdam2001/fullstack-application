import type { ThemeConfig } from './types'

// Empty tokens = CSS variables from index.css apply unchanged.
// Customization adds overrides on top.
export const DEFAULT_THEME: ThemeConfig = {
  name: 'default',
  tokens: { light: {}, dark: {} },
}
