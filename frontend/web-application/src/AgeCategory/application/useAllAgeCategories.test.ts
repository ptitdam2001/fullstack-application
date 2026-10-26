import { waitFor } from '@testing-library/react'
import { server } from '@/mocks/node'
import { getGetAgeCategoriesMockHandler } from '@Sdk/age-category/age-category.msw'
import { mockAgeCategories } from '../../mocks/fixtures'
import { renderHookWithProviders } from '../../../tests/test-utils'
import * as api from '../infrastructure/useAgeCategoryApi'
import { useAllAgeCategories } from './useAllAgeCategories'

// Spies delegate to the real hooks so MSW still answers — we only observe the calls made to the API.
vi.mock('../infrastructure/useAgeCategoryApi', async importOriginal => {
  const original = await importOriginal<typeof api>()
  return {
    ...original,
    useGetAgeCategories: vi.fn(original.useGetAgeCategories),
    useCountAgeCategories: vi.fn(original.useCountAgeCategories),
  }
})

describe('useAllAgeCategories', () => {
  beforeEach(() => server.use(getGetAgeCategoriesMockHandler(mockAgeCategories)))

  it('requests the first page of 100 age categories', () => {
    renderHookWithProviders(() => useAllAgeCategories())
    expect(vi.mocked(api.useGetAgeCategories).mock.lastCall?.[0]).toEqual({ page: 1, count: 100 })
  })

  it('returns an empty list while loading', () => {
    const { result } = renderHookWithProviders(() => useAllAgeCategories())
    expect(result.current).toEqual([])
  })

  it('returns the age categories once loaded', async () => {
    const { result } = renderHookWithProviders(() => useAllAgeCategories())
    await waitFor(() => expect(result.current).toEqual(mockAgeCategories))
  })

  it('does not count the age categories', () => {
    renderHookWithProviders(() => useAllAgeCategories())
    expect(api.useCountAgeCategories).not.toHaveBeenCalled()
  })
})
