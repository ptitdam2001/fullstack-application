import type { Meta, StoryObj } from '@storybook/react-vite'
import { withRouter, reactRouterParameters } from 'storybook-addon-remix-react-router'
import { AuthActions } from './AuthActions'
import { AuthProvider } from '@Auth/application/AuthProvider'
import { getMeResponseMock } from '@Sdk/authentication/authentication.msw'

const meta = {
  component: AuthActions,
  title: 'Auth/ui/AuthActions',
  decorators: [
    withRouter,
    StoryComponent => (
      <AuthProvider.Provider>
        <StoryComponent />
      </AuthProvider.Provider>
    ),
  ],
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { pathname: '/app/my-profile' },
        searchParams: {},
        state: undefined,
      },
    }),
    localStorage: {
      user: { user: getMeResponseMock(), token: '12345' },
    },
  },
} satisfies Meta<typeof AuthActions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
