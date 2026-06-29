import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AdminAgeCategoryFormSheet } from './AdminAgeCategoryFormSheet'

vi.mock('../../infrastructure/useAgeCategoryApi', () => ({
  useGetAgeCategory: vi.fn(),
}))

vi.mock('./AgeCategoryForm', () => ({
  AgeCategoryForm: ({ ageCategoryId }: { ageCategoryId?: string }) => (
    <div data-testid="age-category-form" data-age-category-id={ageCategoryId} />
  ),
}))

vi.mock('@Common/Loading/LinearProgress', () => ({
  LinearProgress: () => <div data-testid="linear-progress" />,
}))

vi.mock('@Common/NotFound', () => ({
  NotFound: () => <div data-testid="not-found" />,
}))

import { useGetAgeCategory } from '../../infrastructure/useAgeCategoryApi'

const mockedUseGetAgeCategory = vi.mocked(useGetAgeCategory)

const defaultProps = { open: true, onOpenChange: vi.fn() }

const mockData = {
  id: '1',
  label: 'U13',
  genre: 'MALE',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('AdminAgeCategoryFormSheet', () => {
  describe('create mode (no ageCategoryId)', () => {
    it('renders create title', () => {
      render(<AdminAgeCategoryFormSheet {...defaultProps} />)
      expect(screen.getByText('adminAgeCategories.dialog.create.title')).toBeInTheDocument()
    })

    it('renders form without ageCategoryId', () => {
      render(<AdminAgeCategoryFormSheet {...defaultProps} />)
      const form = screen.getByTestId('age-category-form')
      expect(form).toBeInTheDocument()
      expect(form).not.toHaveAttribute('data-age-category-id')
    })
  })

  describe('edit mode (with ageCategoryId)', () => {
    it('renders edit title', () => {
      mockedUseGetAgeCategory.mockReturnValue({ data: mockData, isLoading: false, isError: false } as never)
      render(<AdminAgeCategoryFormSheet {...defaultProps} ageCategoryId="1" />)
      expect(screen.getByText('adminAgeCategories.dialog.edit.title')).toBeInTheDocument()
    })

    it('renders form with ageCategoryId when data is loaded', () => {
      mockedUseGetAgeCategory.mockReturnValue({ data: mockData, isLoading: false, isError: false } as never)
      render(<AdminAgeCategoryFormSheet {...defaultProps} ageCategoryId="1" />)
      const form = screen.getByTestId('age-category-form')
      expect(form).toHaveAttribute('data-age-category-id', '1')
    })

    it('renders LinearProgress while loading', () => {
      mockedUseGetAgeCategory.mockReturnValue({ data: undefined, isLoading: true, isError: false } as never)
      render(<AdminAgeCategoryFormSheet {...defaultProps} ageCategoryId="1" />)
      expect(screen.getByTestId('linear-progress')).toBeInTheDocument()
      expect(screen.queryByTestId('age-category-form')).not.toBeInTheDocument()
    })

    it('renders NotFound on error', () => {
      mockedUseGetAgeCategory.mockReturnValue({ data: undefined, isLoading: false, isError: true } as never)
      render(<AdminAgeCategoryFormSheet {...defaultProps} ageCategoryId="1" />)
      expect(screen.getByTestId('not-found')).toBeInTheDocument()
      expect(screen.queryByTestId('age-category-form')).not.toBeInTheDocument()
    })
  })

  describe('closed state', () => {
    it('does not render content when closed', () => {
      render(<AdminAgeCategoryFormSheet open={false} onOpenChange={vi.fn()} />)
      expect(screen.queryByText('adminAgeCategories.dialog.create.title')).not.toBeInTheDocument()
      expect(screen.queryByTestId('age-category-form')).not.toBeInTheDocument()
    })
  })
})
