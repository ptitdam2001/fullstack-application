import { vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../../tests/test-utils'
import { CheckAuthentication } from './CheckAuthentication'

vi.mock('../../application/AuthProvider', () => ({
  AuthProvider: {
    useAuthValue: vi.fn(),
    useAuthDispatch: vi.fn(() => vi.fn()),
  },
}))

import { AuthProvider } from '../../application/AuthProvider'

describe('CheckAuthentication', () => {
  it('renders children when user authenticated', () => {
    vi.mocked(AuthProvider.useAuthValue).mockReturnValue({
      user: { id: '1', email: 'a@b.com', firstname: 'A', lastname: 'B' },
      token: 'tok',
    })

    renderWithProviders(
      <CheckAuthentication>
        <div>protected</div>
      </CheckAuthentication>
    )

    expect(screen.getByText('protected')).toBeInTheDocument()
  })

  it('redirects to login when no user', () => {
    vi.mocked(AuthProvider.useAuthValue).mockReturnValue({ user: undefined, token: undefined })

    renderWithProviders(
      <CheckAuthentication>
        <div>protected</div>
      </CheckAuthentication>
    )

    expect(screen.queryByText('protected')).not.toBeInTheDocument()
  })
})
