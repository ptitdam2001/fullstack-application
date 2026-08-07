import { describe, expect, it, vi } from 'vitest'
import { AdminSeasonFormSheetPage } from './AdminSeasonFormSheet.page'

vi.mock('../../infrastructure/useSeasonApi', () => ({
  useGetSeason: vi.fn(),
}))

vi.mock('./SeasonForm', () => ({
  SeasonForm: ({ seasonId }: { seasonId?: string }) => <div data-testid="season-form" data-season-id={seasonId} />,
}))

vi.mock('@Common/Loading/LinearProgress', () => ({
  LinearProgress: () => <div data-testid="linear-progress" />,
}))

vi.mock('@Common/NotFound', () => ({
  NotFound: () => <div data-testid="not-found" />,
}))

import { useGetSeason } from '../../infrastructure/useSeasonApi'

const mockedUseGetSeason = vi.mocked(useGetSeason)

const mockData = {
  id: '1',
  label: '2024-2025',
  startDate: null,
  endDate: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('AdminSeasonFormSheet', () => {
  describe('create mode (no seasonId)', () => {
    it('renders create title', () => {
      const page = new AdminSeasonFormSheetPage().render()
      expect(page.createTitle()).toBeInTheDocument()
    })

    it('renders form without seasonId', () => {
      const page = new AdminSeasonFormSheetPage().render()
      expect(page.form()).toBeInTheDocument()
      expect(page.form()).not.toHaveAttribute('data-season-id')
    })
  })

  describe('edit mode (with seasonId)', () => {
    it('renders edit title', () => {
      mockedUseGetSeason.mockReturnValue({ data: mockData, isLoading: false, isError: false } as never)
      const page = new AdminSeasonFormSheetPage({ seasonId: '1' }).render()
      expect(page.editTitle()).toBeInTheDocument()
    })

    it('renders form with seasonId when data is loaded', () => {
      mockedUseGetSeason.mockReturnValue({ data: mockData, isLoading: false, isError: false } as never)
      const page = new AdminSeasonFormSheetPage({ seasonId: '1' }).render()
      expect(page.form()).toHaveAttribute('data-season-id', '1')
    })

    it('renders LinearProgress while loading', () => {
      mockedUseGetSeason.mockReturnValue({ data: undefined, isLoading: true, isError: false } as never)
      const page = new AdminSeasonFormSheetPage({ seasonId: '1' }).render()
      expect(page.linearProgress()).toBeInTheDocument()
      expect(page.form()).not.toBeInTheDocument()
    })

    it('renders NotFound on error', () => {
      mockedUseGetSeason.mockReturnValue({ data: undefined, isLoading: false, isError: true } as never)
      const page = new AdminSeasonFormSheetPage({ seasonId: '1' }).render()
      expect(page.notFound()).toBeInTheDocument()
      expect(page.form()).not.toBeInTheDocument()
    })
  })

  describe('closed state', () => {
    it('does not render content when closed', () => {
      const page = new AdminSeasonFormSheetPage({ open: false }).render()
      expect(page.createTitle()).not.toBeInTheDocument()
      expect(page.form()).not.toBeInTheDocument()
    })
  })
})
