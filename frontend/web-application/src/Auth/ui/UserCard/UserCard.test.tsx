import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../../tests/test-utils'
import { UserCard } from './UserCard'

vi.mock('../../application/AuthProvider', () => ({
  AuthProvider: {
    useAuthValue: vi.fn(),
    useAuthDispatch: vi.fn(() => vi.fn()),
  },
}))

import { AuthProvider } from '../../application/AuthProvider'

const mockUser = { id: '1', email: 'john@example.com', firstname: 'John', lastname: 'Doe', role: 'PLAYER' as const }

describe('UserCard', () => {
  it('renders user email as login', () => {
    vi.mocked(AuthProvider.useAuthValue).mockReturnValue({ user: mockUser, token: 'tok' })
    renderWithProviders(<UserCard />)
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('renders empty login when no user', () => {
    vi.mocked(AuthProvider.useAuthValue).mockReturnValue({ user: undefined, token: undefined })
    renderWithProviders(<UserCard />)
    expect(screen.queryByText('john@example.com')).not.toBeInTheDocument()
  })
})
