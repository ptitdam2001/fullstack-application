import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@Api'
import { BrowserRouter } from 'react-router-dom'

type Props = {
  children: ReactNode
}

const graphQLClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000,
    },
  },
})

export const UrqlClientProvider = ({ children }: Props) => (
  <QueryClientProvider client={graphQLClient}>{children}</QueryClientProvider>
)

export const AppProviders = ({ children }: Props) => (
  <BrowserRouter>
    <UrqlClientProvider>{children}</UrqlClientProvider>
  </BrowserRouter>
)
