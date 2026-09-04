import { act, waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useMatchList } from './useMatchList'

describe('useMatchList', () => {
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
