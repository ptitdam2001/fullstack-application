import { MemoryRouter, Route, Routes } from 'react-router'
import { render, screen } from '@testing-library/react'
import { RequireRole } from './RequireRole'
import { type UserWithoutPassword } from '@Sdk/model'

const { mockUseAuthValue } = vi.hoisted(() => ({
  mockUseAuthValue: vi.fn(),
}))

vi.mock('../../application/AuthProvider', () => ({
  AuthProvider: {
    useAuthValue: mockUseAuthValue,
  },
}))

const renderRequireRole = (allowed: (user: UserWithoutPassword) => boolean) =>
  render(
    <MemoryRouter initialEntries={['/app/admin']}>
      <Routes>
        <Route
          path="/app/admin"
          element={
            <RequireRole allowed={allowed}>
              <div>Protected content</div>
            </RequireRole>
          }
        />
        <Route path="/app" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  )

describe('RequireRole', () => {
  it('renders children when allowed returns true', () => {
    mockUseAuthValue.mockReturnValue({ user: { isAdmin: true } })

    renderRequireRole(user => user.isAdmin)

    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('redirects to /app when allowed returns false', () => {
    mockUseAuthValue.mockReturnValue({ user: { isAdmin: false } })

    renderRequireRole(user => user.isAdmin)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('redirects to /app when no user is present', () => {
    mockUseAuthValue.mockReturnValue({ user: undefined })

    renderRequireRole(user => user.isAdmin)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
