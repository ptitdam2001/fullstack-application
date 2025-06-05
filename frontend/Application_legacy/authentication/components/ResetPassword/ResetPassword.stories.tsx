import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword } from './ResetPassword'
import { fn } from 'storybook/test'
import { HttpResponse, delay, graphql } from 'msw'

const meta = {
  title: 'Authentication/ResetPassword',
  component: ResetPassword,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: { onSuccess: fn() },
} satisfies Meta<typeof ResetPassword>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    msw: {
      auth: [
        // Handles a "Login" mutation
        graphql.mutation('ResetPassword', async req => {
          const { login } = req.variables.input

          await delay(5000)

          sessionStorage.setItem('is-authenticated', login)
          return HttpResponse.json({
            data: {
              login: {
                sessionId: 'abc-123',
              },
            },
          })
        }),
      ],
    },
  },
}
