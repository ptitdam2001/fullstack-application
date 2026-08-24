import { act } from '@testing-library/react'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useMatchList } from './useMatchList'

describe('useMatchList', () => {
  it('starts on page 0 with no filters', () => {
    const { result } = renderHookWithProviders(() => useMatchList())
    expect(result.current.pagination.page).toBe(0)
    expect(result.current.filters).toEqual({})
  })

  it('changeFilters updates filters', () => {
    const { result } = renderHookWithProviders(() => useMatchList())

    act(() => result.current.changeFilters({ championshipId: 'champ-1' }))

    expect(result.current.filters).toEqual({ championshipId: 'champ-1' })
  })

  it('changeFilters resets pagination to page 0', () => {
    const { result } = renderHookWithProviders(() => useMatchList())

    act(() => result.current.changePage(3))
    expect(result.current.pagination.page).toBe(3)

    act(() => result.current.changeFilters({ status: 'SCHEDULED' }))

    expect(result.current.pagination.page).toBe(0)
  })

  it('changePage alone does not touch filters', () => {
    const { result } = renderHookWithProviders(() => useMatchList())

    act(() => result.current.changeFilters({ ageCategoryId: 'cat-1' }))
    act(() => result.current.changePage(2))

    expect(result.current.filters).toEqual({ ageCategoryId: 'cat-1' })
    expect(result.current.pagination.page).toBe(2)
  })
})
