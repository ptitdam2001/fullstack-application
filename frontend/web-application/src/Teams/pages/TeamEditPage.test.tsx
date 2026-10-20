import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TeamEditPage } from './TeamEditPage'

vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ teamId: '1' }),
}))

vi.mock('@Theme/Provider/ThemeProvider', () => ({
  useTheme: () => 'light',
}))

vi.mock('../application/useTeamDetail', () => ({
  useTeamDetail: () => ({
    data: { id: '1', name: 'Les Rouges', color: '#e53e3e', ageCategoryId: 'c1' },
    isLoading: false,
    isError: false,
  }),
}))

vi.mock('../ui/TeamForm/TeamForm', () => ({
  TeamForm: ({ teamId }: { teamId?: string }) => <div data-testid="team-form" data-team-id={teamId} />,
}))

describe('TeamEditPage', () => {
  it('names the dialog with the translated edit title', () => {
    render(<TeamEditPage />)
    expect(screen.getByRole('dialog', { name: 'teams.editTeam' })).toBeInTheDocument()
    expect(screen.getByTestId('team-form')).toHaveAttribute('data-team-id', '1')
  })
})
