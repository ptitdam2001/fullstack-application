import { vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../tests/test-utils'
import { AuthProvider } from './AuthProvider'

vi.mock('./useCheckAuth', () => ({
  useCheckAuth: vi.fn(() => ({
    user: { id: '1', email: 'a@b.com', firstname: 'A', lastname: 'B' },
    token: 'tok',
  })),
}))

const ValueConsumer = () => {
  const { user } = AuthProvider.useAuthValue()
  return <div>{user?.email ?? 'no user'}</div>
}

const DispatchConsumer = () => {
  const dispatch = AuthProvider.useAuthDispatch()
  return <button onClick={() => dispatch({ user: undefined, token: undefined })}>logout</button>
}

describe('AuthProvider', () => {
  it('exposes auth value from useCheckAuth to children', () => {
    renderWithProviders(
      <AuthProvider.Provider>
        <ValueConsumer />
      </AuthProvider.Provider>
    )

    expect(screen.getByText('a@b.com')).toBeInTheDocument()
  })

  it('exposes dispatch function to children', () => {
    renderWithProviders(
      <AuthProvider.Provider>
        <DispatchConsumer />
      </AuthProvider.Provider>
    )

    expect(screen.getByRole('button', { name: 'logout' })).toBeInTheDocument()
  })
})
