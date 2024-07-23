import React from 'react'

import { QueryClient, QueryClientProvider } from '../src/api'

import type { Preview } from '@storybook/react'
import { withThemeByClassName } from '@storybook/addon-themes'
import { initialize, mswLoader } from 'msw-storybook-addon'

import '../src/index.css'

import authHandlers from '../config/mocks/auth'
import userHandlers from '../config/mocks/user'

// Initialize MSW
initialize({})

const graphQLClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000,
    },
  },
  // fetchOptions: () => {
  //   const sessionId = getAuth({})
  //   const anotherHeader = sessionId ? { authorization: `Bearer ${sessionId}` } : {}
  //   return {
  //     headers: {
  //       ...anotherHeader,
  //       accept: '*/*',
  //     },
  //   } as RequestInit
  // },
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers: {
        auth: authHandlers,
        user: userHandlers,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        // nameOfTheme: 'classNameForTheme',
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    Story => (
      <QueryClientProvider client={graphQLClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  // Provide the MSW addon loader globally
  loaders: [mswLoader],
}

export default preview
