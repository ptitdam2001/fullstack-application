// export * from '@tanstack/react-query'
// export * from 'graphql-request'

import { GraphQLClient } from 'graphql-request'

export const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_URL as string

export const graphqlRequestClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  credentials: 'include',
  mode: 'cors',
})
export { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// export * from '@tanstack/react-query'
// export * from 'graphql-request'
