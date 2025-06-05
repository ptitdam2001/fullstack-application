import type { Meta, StoryObj } from '@storybook/react-vite'
import { Signin } from './Signin'
import { fn } from 'storybook/test'
import { HttpResponse, delay, graphql } from 'msw'

const meta = {
  title: 'Authentication/Signin',
  component: Signin,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: { onConnectionDone: fn() },
} satisfies Meta<typeof Signin>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    msw: {
      auth: [
        // Handles a "Login" mutation
        graphql.mutation('LoginUser', async req => {
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
