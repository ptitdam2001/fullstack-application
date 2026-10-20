import { describe, expect, it, vi } from 'vitest'
import { TeamCreatePagePage } from './TeamCreatePage.page'

vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('@Theme/Provider/ThemeProvider', () => ({
  useTheme: () => 'light',
}))

vi.mock('../ui/TeamForm/TeamForm', () => ({
  TeamForm: () => <div data-testid="team-form" />,
}))

describe('TeamCreatePage', () => {
  it('names the dialog with the translated create title', () => {
    const page = new TeamCreatePagePage().render()
    expect(page.dialog()).toBeInTheDocument()
    expect(page.teamForm()).toBeInTheDocument()
  })
})
