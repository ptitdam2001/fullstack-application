import { waitFor } from '@testing-library/react'
import { server } from '@/mocks/node'
import { getGetAgeCategoryMockHandler } from '@Sdk/age-category/age-category.msw'
import { mockAgeCategories } from '../../mocks/fixtures'
import { renderHookWithProviders } from '../../../tests/test-utils'
import * as api from '../infrastructure/useAgeCategoryApi'
import { useAgeCategoryDetail } from './useAgeCategoryDetail'

// Spy delegates to the real hook so MSW still answers — we only observe the id sent to the API.
vi.mock('../infrastructure/useAgeCategoryApi', async importOriginal => {
  const original = await importOriginal<typeof api>()
  return { ...original, useGetAgeCategory: vi.fn(original.useGetAgeCategory) }
})

const ageCategory = mockAgeCategories[0]

describe('useAgeCategoryDetail', () => {
  beforeEach(() => server.use(getGetAgeCategoryMockHandler(ageCategory)))

  it('requests the age category of the given id', () => {
    renderHookWithProviders(() => useAgeCategoryDetail(ageCategory.id))
    expect(vi.mocked(api.useGetAgeCategory).mock.lastCall?.[0]).toBe(ageCategory.id)
  })

  it('returns the age category once loaded', async () => {
    const { result } = renderHookWithProviders(() => useAgeCategoryDetail(ageCategory.id))
    await waitFor(() => expect(result.current.data).toEqual(ageCategory))
  })
})
