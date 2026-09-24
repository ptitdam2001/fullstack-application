import { act, waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '../../../tests/test-utils'
import * as api from '../infrastructure/useMatchApi'
import { useMatchList } from './useMatchList'

// Spy delegates to the real hook so MSW still answers — we only observe the params sent to the API.
vi.mock('../infrastructure/useMatchApi', async importOriginal => {
  const original = await importOriginal<typeof api>()
  return { ...original, useGetMatchesSuspense: vi.fn(original.useGetMatchesSuspense) }
})

describe('useMatchList', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the zero-based UI page as a one-based API page', async () => {
    const lastPageSent = () => vi.mocked(api.useGetMatchesSuspense).mock.lastCall?.[0]?.page
    const { result } = renderHookWithProviders(() => useMatchList())
    await waitFor(() => expect(result.current).not.toBeNull())
    expect(lastPageSent()).toBe(1)

    act(() => result.current.changePage(2))
    await waitFor(() => expect(result.current.pagination.page).toBe(2))
    expect(lastPageSent()).toBe(3)
  })

  it('starts on page 0 with no filters', async () => {
    const { result } = renderHookWithProviders(() => useMatchList())
    await waitFor(() => expect(result.current).not.toBeNull())
    expect(result.current.pagination.page).toBe(0)
    expect(result.current.filters).toEqual({})
  })

  it('changeFilters updates filters', async () => {
    const { result } = renderHookWithProviders(() => useMatchList())
    await waitFor(() => expect(result.current).not.toBeNull())

    act(() => result.current.changeFilters({ championshipId: 'champ-1' }))
    await waitFor(() => expect(result.current.filters).toEqual({ championshipId: 'champ-1' }))
  })

  it('changeFilters resets pagination to page 0', async () => {
    const { result } = renderHookWithProviders(() => useMatchList())
    await waitFor(() => expect(result.current).not.toBeNull())

    act(() => result.current.changePage(3))
    await waitFor(() => expect(result.current.pagination.page).toBe(3))

    act(() => result.current.changeFilters({ status: 'SCHEDULED' }))
    await waitFor(() => expect(result.current.pagination.page).toBe(0))
  })

  it('changePage alone does not touch filters', async () => {
    const { result } = renderHookWithProviders(() => useMatchList())
    await waitFor(() => expect(result.current).not.toBeNull())

    act(() => result.current.changeFilters({ ageCategoryId: 'cat-1' }))
    await waitFor(() => expect(result.current.filters).toEqual({ ageCategoryId: 'cat-1' }))

    act(() => result.current.changePage(2))
    await waitFor(() => expect(result.current.pagination.page).toBe(2))

    expect(result.current.filters).toEqual({ ageCategoryId: 'cat-1' })
  })
})
