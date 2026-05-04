import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../tests/test-utils'
import { AuthActions } from './AuthActions'
import { AuthProvider } from '../../application/AuthProvider'

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../application/AuthProvider', () => ({
  AuthProvider: {
    useAuthValue: vi.fn(),
    useAuthDispatch: vi.fn(() => vi.fn()),
  },
}))

vi.mock('./UserAvatar', () => ({
  UserAvatar: () => <div data-testid="user-avatar" />,
}))

vi.mock('./UserAvatarButton', () => ({
  UserAvatarButton: () => <button aria-label="User menu">Avatar</button>,
}))

vi.mock('@repo/design-system', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@repo/design-system')>()
  return {
    ...actual,
    DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
      <button onClick={onClick}>{children}</button>
    ),
    DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuSeparator: () => <hr />,
  }
})

const mockUser = { id: '1', email: 'john@example.com', firstname: 'John', lastname: 'Doe', role: 'PLAYER' as const }

describe('AuthActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when no user', () => {
    vi.mocked(AuthProvider.useAuthValue).mockReturnValue({ user: undefined, token: undefined })
    const { container } = renderWithProviders(<AuthActions />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when no token', () => {
    vi.mocked(AuthProvider.useAuthValue).mockReturnValue({ user: mockUser, token: undefined })
    const { container } = renderWithProviders(<AuthActions />)
    expect(container.firstChild).toBeNull()
  })

  it('renders avatar button when authenticated', () => {
    vi.mocked(AuthProvider.useAuthValue).mockReturnValue({ user: mockUser, token: 'tok' })
    renderWithProviders(<AuthActions />)
    expect(screen.getByRole('button', { name: /user menu/i })).toBeInTheDocument()
  })

  it('navigates to profile on account click', () => {
    vi.mocked(AuthProvider.useAuthValue).mockReturnValue({ user: mockUser, token: 'tok' })
    renderWithProviders(<AuthActions />)
    fireEvent.click(screen.getByText('settings.account'))
    expect(mockNavigate).toHaveBeenCalledWith('/app/my-profile')
  })

  it('navigates to logout page on sign out click', () => {
    vi.mocked(AuthProvider.useAuthValue).mockReturnValue({ user: mockUser, token: 'tok' })
    renderWithProviders(<AuthActions />)
    fireEvent.click(screen.getByText('auth.signout'))
    expect(mockNavigate).toHaveBeenCalledWith('/auth/logout')
  })
})
