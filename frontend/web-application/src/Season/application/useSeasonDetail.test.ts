import { waitFor } from '@testing-library/react'
import { server } from '@/mocks/node'
import { getGetSeasonMockHandler } from '@Sdk/season/season.msw'
import type { Season } from '../domain/Season'
import { renderHookWithProviders } from '../../../tests/test-utils'
import * as api from '../infrastructure/useSeasonApi'
import { useSeasonDetail } from './useSeasonDetail'

// Spy delegates to the real hook so MSW still answers — we only observe the id sent to the API.
vi.mock('../infrastructure/useSeasonApi', async importOriginal => {
  const original = await importOriginal<typeof api>()
  return { ...original, useGetSeason: vi.fn(original.useGetSeason) }
})

const season: Season = {
  id: 'season-1',
  label: '2024-2025',
  startDate: null,
  endDate: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('useSeasonDetail', () => {
  beforeEach(() => server.use(getGetSeasonMockHandler(season)))

  it('requests the season of the given id', () => {
    renderHookWithProviders(() => useSeasonDetail(season.id))
    expect(vi.mocked(api.useGetSeason).mock.lastCall?.[0]).toBe(season.id)
  })

  it('returns the season once loaded', async () => {
    const { result } = renderHookWithProviders(() => useSeasonDetail(season.id))
    await waitFor(() => expect(result.current.data).toEqual(season))
  })
})
