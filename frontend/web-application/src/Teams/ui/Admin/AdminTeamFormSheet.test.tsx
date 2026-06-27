import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AdminTeamFormSheet } from './AdminTeamFormSheet'

vi.mock('@Teams/application/useTeamDetail', () => ({
  useTeamDetail: vi.fn(),
}))

vi.mock('@Teams/ui/TeamForm/TeamForm', () => ({
  TeamForm: ({ teamId }: { teamId?: string }) => <div data-testid="team-form" data-team-id={teamId} />,
}))

vi.mock('@Common/Loading/LinearProgress', () => ({
  LinearProgress: () => <div data-testid="linear-progress" />,
}))

vi.mock('@Common/NotFound', () => ({
  NotFound: () => <div data-testid="not-found" />,
}))

import { useTeamDetail } from '@Teams/application/useTeamDetail'

const mockedUseTeamDetail = vi.mocked(useTeamDetail)

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
}

describe('AdminTeamFormSheet', () => {
  describe('create mode (no teamId)', () => {
    it('renders create title', () => {
      render(<AdminTeamFormSheet {...defaultProps} />)
      expect(screen.getByText('adminTeams.dialog.create.title')).toBeInTheDocument()
    })

    it('renders TeamForm without teamId', () => {
      render(<AdminTeamFormSheet {...defaultProps} />)
      const form = screen.getByTestId('team-form')
      expect(form).toBeInTheDocument()
      expect(form).not.toHaveAttribute('data-team-id')
    })
  })

  describe('edit mode (with teamId)', () => {
    it('renders edit title', () => {
      mockedUseTeamDetail.mockReturnValue({
        data: { id: '1', name: 'Les Rouges', color: '#e53e3e', areas: [] },
        isLoading: false,
        isError: false,
      } as never)

      render(<AdminTeamFormSheet {...defaultProps} teamId="1" />)
      expect(screen.getByText('adminTeams.dialog.edit.title')).toBeInTheDocument()
    })

    it('renders TeamForm with teamId when data loaded', () => {
      mockedUseTeamDetail.mockReturnValue({
        data: { id: '1', name: 'Les Rouges', color: '#e53e3e', areas: [] },
        isLoading: false,
        isError: false,
      } as never)

      render(<AdminTeamFormSheet {...defaultProps} teamId="1" />)
      const form = screen.getByTestId('team-form')
      expect(form).toBeInTheDocument()
      expect(form).toHaveAttribute('data-team-id', '1')
    })

    it('renders LinearProgress while loading', () => {
      mockedUseTeamDetail.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      } as never)

      render(<AdminTeamFormSheet {...defaultProps} teamId="1" />)
      expect(screen.getByTestId('linear-progress')).toBeInTheDocument()
      expect(screen.queryByTestId('team-form')).not.toBeInTheDocument()
    })

    it('renders NotFound on error', () => {
      mockedUseTeamDetail.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      } as never)

      render(<AdminTeamFormSheet {...defaultProps} teamId="1" />)
      expect(screen.getByTestId('not-found')).toBeInTheDocument()
      expect(screen.queryByTestId('team-form')).not.toBeInTheDocument()
    })
  })

  describe('closed state', () => {
    it('does not render content when closed', () => {
      render(<AdminTeamFormSheet open={false} onOpenChange={vi.fn()} />)
      expect(screen.queryByText('adminTeams.dialog.create.title')).not.toBeInTheDocument()
      expect(screen.queryByTestId('team-form')).not.toBeInTheDocument()
    })
  })
})
