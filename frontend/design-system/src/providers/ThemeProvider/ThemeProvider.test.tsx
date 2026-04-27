import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useContext } from 'react'
import { ThemeProvider, ThemeConfigContext } from './ThemeProvider'
import type { IThemeStorage, ThemeConfig } from '../../theme/types'

const makeStorage = (initial: ThemeConfig | null = null): IThemeStorage => ({
  load: vi.fn().mockReturnValue(initial),
  save: vi.fn(),
  clear: vi.fn(),
})

const TestConsumer = () => {
  const ctx = useContext(ThemeConfigContext)
  return <div data-testid="name">{ctx?.themeConfig.name ?? 'none'}</div>
}

beforeEach(() => {
  document.getElementById('ds-theme-override')?.remove()
})

describe('ThemeProvider', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ThemeProvider storage={makeStorage()}>
        <span>child</span>
      </ThemeProvider>
    )
    expect(getByText('child')).toBeInTheDocument()
  })

  it('loads theme from storage on mount', () => {
    const stored: ThemeConfig = { name: 'custom', tokens: { light: {}, dark: {} } }
    const { getByTestId } = render(
      <ThemeProvider storage={makeStorage(stored)}>
        <TestConsumer />
      </ThemeProvider>
    )
    expect(getByTestId('name').textContent).toBe('custom')
  })

  it('falls back to default theme when storage is empty', () => {
    const { getByTestId } = render(
      <ThemeProvider storage={makeStorage(null)}>
        <TestConsumer />
      </ThemeProvider>
    )
    expect(getByTestId('name').textContent).toBe('default')
  })

  it('calls storage.save when setThemeConfig is invoked', () => {
    const storage = makeStorage()
    const SetterConsumer = () => {
      const ctx = useContext(ThemeConfigContext)
      return (
        <button onClick={() => ctx?.setThemeConfig({ name: 'custom', tokens: { light: {}, dark: {} } })}>update</button>
      )
    }
    const { getByText } = render(
      <ThemeProvider storage={storage}>
        <SetterConsumer />
      </ThemeProvider>
    )
    act(() => getByText('update').click())
    expect(storage.save).toHaveBeenCalledWith(expect.objectContaining({ name: 'custom' }))
  })

  it('injects style tag when theme has token overrides', () => {
    const stored: ThemeConfig = {
      name: 'custom',
      tokens: { light: { primary: 'oklch(0.5 0.2 200)' }, dark: {} },
    }
    render(
      <ThemeProvider storage={makeStorage(stored)}>
        <span />
      </ThemeProvider>
    )
    const style = document.getElementById('ds-theme-override')
    expect(style?.textContent).toContain('--primary')
  })
})

describe('ThemeConfigContext outside ThemeProvider', () => {
  it('is null when used without provider', () => {
    const { getByTestId } = render(<TestConsumer />)
    expect(getByTestId('name').textContent).toBe('none')
  })
})
