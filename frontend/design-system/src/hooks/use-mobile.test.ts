import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useIsMobile } from './use-mobile'

const mockMatchMedia = (initialMatches: boolean) => {
  let matches = initialMatches
  const listeners = new Set<() => void>()
  vi.spyOn(window, 'matchMedia').mockImplementation(
    query =>
      ({
        get matches() {
          return matches
        },
        media: query,
        addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
        removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
      }) as unknown as MediaQueryList
  )
  return {
    listeners,
    change: (next: boolean) => {
      matches = next
      listeners.forEach(listener => listener())
    },
  }
}

describe('useIsMobile', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('queries the width below the 768px breakpoint', () => {
    mockMatchMedia(false)
    renderHook(() => useIsMobile())
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)')
  })

  it('returns the current match of the media query', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('follows the changes of the media query', () => {
    const media = mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => media.change(true))
    expect(result.current).toBe(true)
  })

  it('removes its listener on unmount', () => {
    const media = mockMatchMedia(false)
    const { unmount } = renderHook(() => useIsMobile())
    expect(media.listeners.size).toBe(1)

    unmount()
    expect(media.listeners.size).toBe(0)
  })
})
