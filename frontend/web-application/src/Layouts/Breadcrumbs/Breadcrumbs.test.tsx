import { render, screen } from '@testing-library/react'
import { FormattedMessage } from 'react-intl'
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router'
import { Breadcrumbs } from './Breadcrumbs'

const renderAt = (path: string) => {
  const router = createMemoryRouter(
    [
      {
        path: '/app',
        element: (
          <>
            <Breadcrumbs />
            <Outlet />
          </>
        ),
        children: [
          {
            path: 'team',
            handle: { breadcrumb: <FormattedMessage id="breadcrumb.teams" /> },
            children: [{ path: 'list', handle: { breadcrumb: <FormattedMessage id="breadcrumb.list" /> } }],
          },
        ],
      },
    ],
    { initialEntries: [path] }
  )
  return render(<RouterProvider router={router} />)
}

describe('Breadcrumbs', () => {
  it('renders the home link through i18n', () => {
    renderAt('/app')

    expect(screen.getByText('breadcrumb.home').closest('a')).toHaveAttribute('href', '/app')
  })

  it('renders translated route crumbs, the last one as the current page', () => {
    renderAt('/app/team/list')

    expect(screen.getByText('breadcrumb.teams').closest('a')).toHaveAttribute('href', '/app/team')
    expect(screen.getByText('breadcrumb.list').closest('a')).toBeNull()
  })
})
