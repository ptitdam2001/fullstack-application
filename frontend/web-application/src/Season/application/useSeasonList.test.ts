import { act, waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '../../../tests/test-utils'
import * as api from '../infrastructure/useSeasonApi'
import { useSeasonList, useSeasonListSuspense } from './useSeasonList'

// Spies delegate to the real hooks so MSW still answers — we only observe the params sent to the API.
vi.mock('../infrastructure/useSeasonApi', async importOriginal => {
  const original = await importOriginal<typeof api>()
  return {
    ...original,
    useGetSeasons: vi.fn(original.useGetSeasons),
    useGetSeasonsSuspense: vi.fn(original.useGetSeasonsSuspense),
  }
})

// List + count suspend in series, each behind orval's 500ms MSW delay
const SUSPENSE_WATERFALL_TIMEOUT = 3000

const lastPageSent = (hook: typeof api.useGetSeasons | typeof api.useGetSeasonsSuspense) =>
  vi.mocked(hook).mock.lastCall?.[0]?.page

describe('useSeasonList', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the zero-based UI page as a one-based API page', async () => {
    const { result } = renderHookWithProviders(() => useSeasonList())
    await waitFor(() => expect(result.current).not.toBeNull())
    expect(lastPageSent(api.useGetSeasons)).toBe(1)

    act(() => result.current.changePage(2))
    await waitFor(() => expect(result.current.pagination.page).toBe(2))
    expect(lastPageSent(api.useGetSeasons)).toBe(3)
  })
})

describe('useSeasonListSuspense', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the zero-based UI page as a one-based API page', async () => {
    const { result } = renderHookWithProviders(() => useSeasonListSuspense())
    await waitFor(() => expect(result.current).not.toBeNull(), { timeout: SUSPENSE_WATERFALL_TIMEOUT })
    expect(lastPageSent(api.useGetSeasonsSuspense)).toBe(1)

    act(() => result.current.changePage(2))
    await waitFor(() => expect(result.current.pagination.page).toBe(2))
    expect(lastPageSent(api.useGetSeasonsSuspense)).toBe(3)
  })
})
