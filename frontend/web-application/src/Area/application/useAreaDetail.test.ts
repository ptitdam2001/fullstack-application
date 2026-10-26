import { waitFor } from '@testing-library/react'
import { server } from '@/mocks/node'
import { getGetAreaMockHandler } from '@Sdk/area/area.msw'
import type { Area } from '../domain/Area'
import { renderHookWithProviders } from '../../../tests/test-utils'
import * as api from '../infrastructure/useAreaApi'
import { useAreaDetail } from './useAreaDetail'

// Spy delegates to the real hook so MSW still answers — we only observe the id sent to the API.
vi.mock('../infrastructure/useAreaApi', async importOriginal => {
  const original = await importOriginal<typeof api>()
  return { ...original, useGetArea: vi.fn(original.useGetArea) }
})

const area: Area = {
  id: 'area-1',
  name: 'Stade Pierre-Dupont',
  address: '1 rue du Stade',
  city: 'Paris',
  longitude: 2.35,
  latitude: 48.85,
}

describe('useAreaDetail', () => {
  beforeEach(() => server.use(getGetAreaMockHandler(area)))

  it('requests the area of the given id', () => {
    renderHookWithProviders(() => useAreaDetail(area.id))
    expect(vi.mocked(api.useGetArea).mock.lastCall?.[0]).toBe(area.id)
  })

  it('returns the area once loaded', async () => {
    const { result } = renderHookWithProviders(() => useAreaDetail(area.id))
    await waitFor(() => expect(result.current.data).toEqual(area))
  })
})
