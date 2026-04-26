import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeToggle } from './ThemeToggle'
import * as useThemeConfigModule from '../../hooks/use-theme-config'

const mockUseThemeConfig = (colorMode: string) => {
  const setColorMode = vi.fn()
  vi.spyOn(useThemeConfigModule, 'useThemeConfig').mockReturnValue({
    colorMode,
    setColorMode,
    themeConfig: { name: 'default', tokens: { light: {}, dark: {} } },
    setThemeConfig: vi.fn(),
    updateTokens: vi.fn(),
    resetTheme: vi.fn(),
  })
  return setColorMode
}

describe('ThemeToggle', () => {
  it('renders with data-slot="theme-toggle"', () => {
    mockUseThemeConfig('light')
    const { getByRole } = render(<ThemeToggle />)
    expect(getByRole('button')).toHaveAttribute('data-slot', 'theme-toggle')
  })

  it('cycles light → dark on click', () => {
    const setColorMode = mockUseThemeConfig('light')
    const { getByRole } = render(<ThemeToggle />)
    fireEvent.click(getByRole('button'))
    expect(setColorMode).toHaveBeenCalledWith('dark')
  })

  it('cycles dark → system on click', () => {
    const setColorMode = mockUseThemeConfig('dark')
    const { getByRole } = render(<ThemeToggle />)
    fireEvent.click(getByRole('button'))
    expect(setColorMode).toHaveBeenCalledWith('system')
  })

  it('cycles system → light on click', () => {
    const setColorMode = mockUseThemeConfig('system')
    const { getByRole } = render(<ThemeToggle />)
    fireEvent.click(getByRole('button'))
    expect(setColorMode).toHaveBeenCalledWith('light')
  })

  it('aria-label mentions current and next mode', () => {
    mockUseThemeConfig('light')
    const { getByRole } = render(<ThemeToggle />)
    expect(getByRole('button')).toHaveAttribute('aria-label', 'Current theme: light. Switch to dark')
  })

  it('forwards className', () => {
    mockUseThemeConfig('system')
    const { getByRole } = render(<ThemeToggle className="extra" />)
    expect(getByRole('button')).toHaveClass('extra')
  })
})
