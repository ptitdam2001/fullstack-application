import { fireEvent, render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { SidebarProvider } from '@repo/design-system'
import { type UserWithoutPassword } from '@Sdk/model'
import { AppSidebar } from './AppSidebar'

const { mockUseAuthValue } = vi.hoisted(() => ({
  mockUseAuthValue: vi.fn(),
}))

vi.mock('@Auth/application/AuthProvider', () => ({
  AuthProvider: {
    useAuthValue: mockUseAuthValue,
  },
}))

const defaultUser: UserWithoutPassword = {
  id: '000000000000000000000001',
  email: 'camille@test.local',
  firstName: 'Camille',
  lastName: 'Martin',
  isAdmin: false,
  isActive: true,
  isBlocked: false,
  isReferee: false,
  roles: [],
}

// jsdom has no matchMedia, which the design-system sidebar reads to detect mobile viewports
const stubMatchMedia = () => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

const createRouter = () =>
  createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <SidebarProvider>
            <AppSidebar />
          </SidebarProvider>
        ),
      },
    ],
    { initialEntries: ['/app'] }
  )

export class AppSidebarPage {
  private user: UserWithoutPassword
  private router = createRouter()

  constructor(userOverrides: Partial<UserWithoutPassword> = {}) {
    this.user = { ...defaultUser, ...userOverrides }
  }

  render() {
    stubMatchMedia()
    mockUseAuthValue.mockReturnValue({ user: this.user })
    render(<RouterProvider router={this.router} />)
    return this
  }

  footer() {
    const footer = document.querySelector<HTMLElement>('[data-slot="sidebar-footer"]')
    if (!footer) {
      throw new Error('The sidebar footer is not rendered')
    }
    return within(footer)
  }

  footerAvatar() {
    return this.footer().getByTestId('user-avatar')
  }

  profileButton() {
    return this.footer().getByRole('button', { name: new RegExp(`${this.user.firstName} ${this.user.lastName}`) })
  }

  signOutButton() {
    return this.footer().getByRole('button', { name: 'auth.signout' })
  }

  footerButtons() {
    return this.footer().getAllByRole('button')
  }

  menuButton(labelId: string) {
    return screen.getByRole('button', { name: labelId })
  }

  queryButton(name: string | RegExp) {
    return screen.queryByRole('button', { name })
  }

  currentPath() {
    return this.router.state.location.pathname
  }

  clickProfileButton() {
    fireEvent.click(this.profileButton())
    return this
  }

  clickMenuButton(labelId: string) {
    fireEvent.click(this.menuButton(labelId))
    return this
  }
}
