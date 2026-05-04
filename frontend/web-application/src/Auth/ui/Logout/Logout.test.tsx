import { renderWithProviders } from '../../../../tests/test-utils'
import { Logout } from './Logout'

const { mockLogout } = vi.hoisted(() => ({ mockLogout: vi.fn() }))

vi.mock('../../application/useLogoutAction', () => ({
  useLogoutAction: () => mockLogout,
}))

describe('Logout', () => {
  it('calls logout on mount', () => {
    renderWithProviders(<Logout />)
    expect(mockLogout).toHaveBeenCalledOnce()
  })
})
