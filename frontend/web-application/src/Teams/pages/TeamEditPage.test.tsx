import { describe, expect, it, vi } from 'vitest'
import { TeamEditPagePage } from './TeamEditPage.page'

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
    const page = new TeamEditPagePage().render()
    expect(page.dialog()).toBeInTheDocument()
    expect(page.teamForm()).toHaveAttribute('data-team-id', '1')
  })
})
