import { act, waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '../../../tests/test-utils'
import * as api from '../infrastructure/useAgeCategoryApi'
import { useAgeCategoryList, useAgeCategoryListSuspense } from './useAgeCategoryList'

// Spies delegate to the real hooks so MSW still answers — we only observe the params sent to the API.
vi.mock('../infrastructure/useAgeCategoryApi', async importOriginal => {
  const original = await importOriginal<typeof api>()
  return {
    ...original,
    useGetAgeCategories: vi.fn(original.useGetAgeCategories),
    useGetAgeCategoriesSuspense: vi.fn(original.useGetAgeCategoriesSuspense),
  }
})

// List + count suspend in series, each behind orval's 500ms MSW delay
const SUSPENSE_WATERFALL_TIMEOUT = 3000

const lastPageSent = (hook: typeof api.useGetAgeCategories | typeof api.useGetAgeCategoriesSuspense) =>
  vi.mocked(hook).mock.lastCall?.[0]?.page

describe('useAgeCategoryList', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the zero-based UI page as a one-based API page', async () => {
    const { result } = renderHookWithProviders(() => useAgeCategoryList())
    await waitFor(() => expect(result.current).not.toBeNull())
    expect(lastPageSent(api.useGetAgeCategories)).toBe(1)

    act(() => result.current.changePage(2))
    await waitFor(() => expect(result.current.pagination.page).toBe(2))
    expect(lastPageSent(api.useGetAgeCategories)).toBe(3)
  })
})

describe('useAgeCategoryListSuspense', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the zero-based UI page as a one-based API page', async () => {
    const { result } = renderHookWithProviders(() => useAgeCategoryListSuspense())
    await waitFor(() => expect(result.current).not.toBeNull(), { timeout: SUSPENSE_WATERFALL_TIMEOUT })
    expect(lastPageSent(api.useGetAgeCategoriesSuspense)).toBe(1)

    act(() => result.current.changePage(2))
    await waitFor(() => expect(result.current.pagination.page).toBe(2))
    expect(lastPageSent(api.useGetAgeCategoriesSuspense)).toBe(3)
  })
})
