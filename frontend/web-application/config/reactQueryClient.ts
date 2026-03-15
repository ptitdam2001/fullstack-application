import { QueryClient } from '@tanstack/react-query'

export const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
    },
  },
})
