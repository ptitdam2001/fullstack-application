import { Suspense } from 'react'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../../tests/test-utils'
import { TeamList } from './TeamList'
import type { Team } from '../../domain/Team'
import { describe, expect, it, vi } from 'vitest'

const mockTeams: Team[] = [
  { id: '1', name: 'Les Rouges', color: '#ff0000', areas: [] },
  { id: '2', name: 'Les Bleus', color: '#0000ff', areas: [] },
]

const mockUseTeamList = vi.fn(() => ({
  query: { data: mockTeams },
  pagination: { page: 0, rowsPerPage: 12 },
  changePage: vi.fn(),
  totalPages: 1,
}))

vi.mock('../../application/useTeamList', () => ({
  useTeamList: () => mockUseTeamList(),
}))

describe('TeamList', () => {
  it('renders grid of teams', () => {
    renderWithProviders(
      <Suspense fallback={<div>Loading...</div>}>
        <TeamList viewMode="grid" />
      </Suspense>
    )
    // Grid.Root uses GridLayout which requires real dimensions to render items — check container instead
    expect(screen.getByTestId('TeamList')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="grid"]')).toBeInTheDocument()
  })

  it('renders list of teams', () => {
    renderWithProviders(
      <Suspense fallback={<div>Loading...</div>}>
        <TeamList viewMode="list" />
      </Suspense>
    )
    expect(screen.getByText('Les Rouges')).toBeInTheDocument()
  })

  it('renders container with testid', () => {
    renderWithProviders(
      <Suspense fallback={null}>
        <TeamList viewMode="grid" />
      </Suspense>
    )
    expect(screen.getByTestId('TeamList')).toBeInTheDocument()
  })

  it('shows suspense fallback while loading', () => {
    mockUseTeamList.mockImplementation(() => {
      throw new Promise(() => {})
    })
    renderWithProviders(
      <Suspense fallback={<div>Loading...</div>}>
        <TeamList viewMode="grid" />
      </Suspense>
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
