import type { ThemeConfig, ThemeTokens } from './types'
import { TOKEN_TO_CSS_VAR } from './tokenMap'

const STYLE_TAG_ID = 'ds-theme-override'

function buildVarBlock(tokens: Partial<ThemeTokens>): string {
  return Object.entries(tokens)
    .map(([key, value]) => {
      const cssVar = TOKEN_TO_CSS_VAR[key as keyof ThemeTokens]
      return cssVar ? `  ${cssVar}: ${value};` : null
    })
    .filter(Boolean)
    .join('\n')
}

export function applyTheme(config: ThemeConfig): void {
  if (typeof document === 'undefined') {
    return
  }

  let style = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = STYLE_TAG_ID
    document.head.appendChild(style)
  }

  const lightBlock = buildVarBlock(config.tokens.light)
  const darkBlock = buildVarBlock(config.tokens.dark)

  style.textContent = [
    lightBlock ? `:root {\n${lightBlock}\n}` : '',
    darkBlock ? `.dark {\n${darkBlock}\n}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export function removeTheme(): void {
  if (typeof document === 'undefined') {
    return
  }
  document.getElementById(STYLE_TAG_ID)?.remove()
}
