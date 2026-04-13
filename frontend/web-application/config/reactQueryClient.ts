import { matchQuery, MutationCache, QueryClient, QueryKey } from '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidates?: Array<QueryKey>
    }
  }
}

export const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      reactQueryClient.invalidateQueries({
        predicate: query =>
          // invalidate all matching tags at once
          // or everything if no meta is provided
          mutation.meta?.invalidates?.some(queryKey => matchQuery({ queryKey }, query)) ?? true,
      })
    },
  }),
})
