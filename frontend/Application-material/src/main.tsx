import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth } from '@Auth/Auth'
import { AppRouting } from '@Application/AppRouting'

import { OpenProvider } from '@Providers/OpenProvider'
import { ThemeProvider } from '@Theme/ThemeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Auth.Provider>
              <OpenProvider.Provider value={false}>
                <AppRouting />
              </OpenProvider.Provider>
            </Auth.Provider>
          </ThemeProvider>
        </QueryClientProvider>
      </React.Suspense>
    </StrictMode>
  )
})
