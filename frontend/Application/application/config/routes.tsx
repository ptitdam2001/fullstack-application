import { NotFound } from '@Common/components'
import { RouteObject } from 'react-router-dom'
import { DefaultLayout, ConnectedLayout } from '@Application/layout'
import { Dashboard } from '@Application/components'
import { MyProfileForm } from '@Authentication/components'
import { Login, ResetPassword } from '@Application/pages'
import { AuthLayout } from '@Authentication/layout'

export default [
  {
    path: '/',
    element: <AuthLayout signinPath="/auth/signin" connectedPath="/app" />,
    errorElement: <NotFound />,
    children: [
      {
        path: 'app',
        element: <ConnectedLayout />,
        errorElement: <NotFound />,
        children: [
          {
            element: <Dashboard />,
            index: true,
          },
          {
            path: 'my-profile',
            element: <MyProfileForm />,
          },
          {
            path: 'my-first-page',
            element: <span>My first page</span>,
          },
        ],
      },
    ],
  },
  {
    path: 'auth',
    element: <DefaultLayout />,
    children: [
      {
        path: 'signin',
        element: <Login />,
        index: true,
      },
      {
        path: 'forgotten-password',
        element: <ResetPassword />,
      },
    ],
  },
] as RouteObject[]
