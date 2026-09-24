import { act, waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '../../../tests/test-utils'
import * as api from '../infrastructure/useChampionshipApi'
import { useChampionshipList, useChampionshipListSuspense } from './useChampionshipList'

// Spies delegate to the real hooks so MSW still answers — we only observe the params sent to the API.
vi.mock('../infrastructure/useChampionshipApi', async importOriginal => {
  const original = await importOriginal<typeof api>()
  return {
    ...original,
    useGetChampionships: vi.fn(original.useGetChampionships),
    useGetChampionshipsSuspense: vi.fn(original.useGetChampionshipsSuspense),
  }
})

// List + count suspend in series, each behind orval's 500ms MSW delay
const SUSPENSE_WATERFALL_TIMEOUT = 3000

const lastPageSent = (hook: typeof api.useGetChampionships | typeof api.useGetChampionshipsSuspense) =>
  vi.mocked(hook).mock.lastCall?.[0]?.page

describe('useChampionshipList', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the zero-based UI page as a one-based API page', async () => {
    const { result } = renderHookWithProviders(() => useChampionshipList())
    await waitFor(() => expect(result.current).not.toBeNull())
    expect(lastPageSent(api.useGetChampionships)).toBe(1)

    act(() => result.current.changePage(2))
    await waitFor(() => expect(result.current.pagination.page).toBe(2))
    expect(lastPageSent(api.useGetChampionships)).toBe(3)
  })
})

describe('useChampionshipListSuspense', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the zero-based UI page as a one-based API page', async () => {
    const { result } = renderHookWithProviders(() => useChampionshipListSuspense())
    await waitFor(() => expect(result.current).not.toBeNull(), { timeout: SUSPENSE_WATERFALL_TIMEOUT })
    expect(lastPageSent(api.useGetChampionshipsSuspense)).toBe(1)

    act(() => result.current.changePage(2))
    await waitFor(() => expect(result.current.pagination.page).toBe(2))
    expect(lastPageSent(api.useGetChampionshipsSuspense)).toBe(3)
  })
})
