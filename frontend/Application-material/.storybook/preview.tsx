import type { Preview } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initialize, mswLoader } from 'msw-storybook-addon'

import '../src/index.css'

const queryClient = new QueryClient()

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({
  onUnhandledRequest: 'bypass',
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [storyFn => <QueryClientProvider client={queryClient}>{storyFn()}</QueryClientProvider>],
  loaders: [mswLoader], // 👈 Add the MSW loader to all stories
}

export default preview
