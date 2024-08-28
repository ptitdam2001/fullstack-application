import { SnackbarProvider } from 'notistack'
import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from '@Application/config/routes'
import { QueryClient, QueryClientProvider } from '@Api'

const router = createBrowserRouter(routes)
// Create a client
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

function App() {
  return (
    <React.Suspense fallback="loading">
      <QueryClientProvider client={graphQLClient}>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </QueryClientProvider>
    </React.Suspense>
  )
}

export default App
