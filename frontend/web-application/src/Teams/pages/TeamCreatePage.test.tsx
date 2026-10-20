import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TeamCreatePage } from './TeamCreatePage'

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
    render(<TeamCreatePage />)
    expect(screen.getByRole('dialog', { name: 'teams.createTeam' })).toBeInTheDocument()
    expect(screen.getByTestId('team-form')).toBeInTheDocument()
  })
})
