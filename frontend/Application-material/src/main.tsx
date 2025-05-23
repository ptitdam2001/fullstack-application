import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@Auth/AuthProvider'
import { AppRouting } from '@Application/AppRouting'

import { OpenProvider } from '@Providers/OpenProvider'
import { ThemeProvider } from '@Theme/Provider/ThemeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Toast from '@Common/Toast/Toast'

import './index.css'

async function enableMocking() {
  if (import.meta.env.PROD) {
    return
  }

  const { worker } = await import('./mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start()
}

const queryClient = new QueryClient()

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <React.Suspense fallback="loading">
        <Toast.Provider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
            <ThemeProvider>
              <AuthProvider.Provider>
                <OpenProvider.Provider value={false}>
                  <AppRouting />
                </OpenProvider.Provider>
              </AuthProvider.Provider>
            </ThemeProvider>
          </QueryClientProvider>
        </Toast.Provider>
      </React.Suspense>
    </StrictMode>
  )
})
