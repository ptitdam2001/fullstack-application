import { act, waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '../../../tests/test-utils'
import * as api from '../infrastructure/useUserApi'
import { useUserListSuspense } from './useUserList'

// Spies delegate to the real hooks so MSW still answers — we only observe the params sent to the API.
vi.mock('../infrastructure/useUserApi', async importOriginal => {
  const original = await importOriginal<typeof api>()
  return {
    ...original,
    useGetUsersSuspense: vi.fn(original.useGetUsersSuspense),
    useCountUsersSuspense: vi.fn(original.useCountUsersSuspense),
  }
})

// List + count suspend in series, each behind orval's 500ms MSW delay
const SUSPENSE_WATERFALL_TIMEOUT = 3000

const lastListParams = () => vi.mocked(api.useGetUsersSuspense).mock.lastCall?.[0]
const lastCountParams = () => vi.mocked(api.useCountUsersSuspense).mock.lastCall?.[0]

const renderList = async () => {
  const hook = renderHookWithProviders(() => useUserListSuspense())
  await waitFor(() => expect(hook.result.current).not.toBeNull(), { timeout: SUSPENSE_WATERFALL_TIMEOUT })
  return hook
}

describe('useUserListSuspense', () => {
  beforeEach(() => vi.clearAllMocks())

  it('always paginates, with the zero-based page sent as-is (the /users API is zero-based)', async () => {
    const { result } = await renderList()
    expect(lastListParams()).toEqual({ page: 0, limit: 20 })

    act(() => result.current.changePage(2))
    await waitFor(() => expect(result.current.pagination.page).toBe(2))
    expect(lastListParams()).toEqual({ page: 2, limit: 20 })
  })

  it('starts without filter and counts every user', async () => {
    const { result } = await renderList()
    expect(result.current.filters).toEqual({})
    expect(lastCountParams()).toEqual({})
  })

  it('applies the isActive filter to both list and count, and resets to page 0', async () => {
    const { result } = await renderList()
    act(() => result.current.changePage(3))
    await waitFor(() => expect(result.current.pagination.page).toBe(3))

    act(() => result.current.changeFilters({ isActive: false }))
    // The transition commits only once both new list + count queries resolved
    await waitFor(() => expect(result.current.filters).toEqual({ isActive: false }), {
      timeout: SUSPENSE_WATERFALL_TIMEOUT,
    })

    expect(result.current.pagination.page).toBe(0)
    expect(lastListParams()).toEqual({ page: 0, limit: 20, isActive: false })
    expect(lastCountParams()).toEqual({ isActive: false })
  })

  it('computes totalPages from the count', async () => {
    const { result } = await renderList()
    const count = result.current.countQuery.data
    expect(result.current.totalPages).toBe(Math.ceil(count / 20))
  })
})
