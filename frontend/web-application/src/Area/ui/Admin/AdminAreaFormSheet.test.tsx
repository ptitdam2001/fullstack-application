import { render, screen } from '@testing-library/react'
import { AdminAreaFormSheet } from './AdminAreaFormSheet'

vi.mock('../../application/useAreaDetail', () => ({
  useAreaDetail: vi.fn(),
}))

vi.mock('../AreaForm', () => ({
  AreaForm: ({ areaId }: { areaId?: string }) => <div data-testid="area-form" data-area-id={areaId} />,
}))

vi.mock('@Common/Loading/LinearProgress', () => ({
  LinearProgress: () => <div data-testid="linear-progress" />,
}))

vi.mock('@Common/NotFound', () => ({
  NotFound: () => <div data-testid="not-found" />,
}))

import { useAreaDetail } from '../../application/useAreaDetail'

const mockedUseAreaDetail = vi.mocked(useAreaDetail)

const defaultProps = { open: true, onOpenChange: vi.fn() }

const mockData = {
  id: '1',
  name: 'Stade Pierre-Dupont',
  address: '1 rue du Stade',
  city: 'Paris',
  longitude: 2.35,
  latitude: 48.85,
}

describe('AdminAreaFormSheet', () => {
  describe('create mode (no areaId)', () => {
    it('renders create title', () => {
      render(<AdminAreaFormSheet {...defaultProps} />)
      expect(screen.getByText('adminAreas.dialog.create.title')).toBeInTheDocument()
    })

    it('renders form without areaId', () => {
      render(<AdminAreaFormSheet {...defaultProps} />)
      const form = screen.getByTestId('area-form')
      expect(form).toBeInTheDocument()
      expect(form).not.toHaveAttribute('data-area-id')
    })
  })

  describe('edit mode (with areaId)', () => {
    it('renders edit title', () => {
      mockedUseAreaDetail.mockReturnValue({ data: mockData, isLoading: false, isError: false } as never)
      render(<AdminAreaFormSheet {...defaultProps} areaId="1" />)
      expect(screen.getByText('adminAreas.dialog.edit.title')).toBeInTheDocument()
    })

    it('renders form with areaId when data is loaded', () => {
      mockedUseAreaDetail.mockReturnValue({ data: mockData, isLoading: false, isError: false } as never)
      render(<AdminAreaFormSheet {...defaultProps} areaId="1" />)
      const form = screen.getByTestId('area-form')
      expect(form).toHaveAttribute('data-area-id', '1')
    })

    it('renders LinearProgress while loading', () => {
      mockedUseAreaDetail.mockReturnValue({ data: undefined, isLoading: true, isError: false } as never)
      render(<AdminAreaFormSheet {...defaultProps} areaId="1" />)
      expect(screen.getByTestId('linear-progress')).toBeInTheDocument()
      expect(screen.queryByTestId('area-form')).not.toBeInTheDocument()
    })

    it('renders NotFound on error', () => {
      mockedUseAreaDetail.mockReturnValue({ data: undefined, isLoading: false, isError: true } as never)
      render(<AdminAreaFormSheet {...defaultProps} areaId="1" />)
      expect(screen.getByTestId('not-found')).toBeInTheDocument()
      expect(screen.queryByTestId('area-form')).not.toBeInTheDocument()
    })
  })

  describe('closed state', () => {
    it('does not render content when closed', () => {
      render(<AdminAreaFormSheet open={false} onOpenChange={vi.fn()} />)
      expect(screen.queryByText('adminAreas.dialog.create.title')).not.toBeInTheDocument()
      expect(screen.queryByTestId('area-form')).not.toBeInTheDocument()
    })
  })
})
