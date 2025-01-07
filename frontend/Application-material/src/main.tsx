import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@Auth/AuthProvider'
import { AppRouting } from '@Application/AppRouting'

import { OpenProvider } from '@Providers/OpenProvider'
import { ThemeProvider } from '@Theme/ThemeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <React.Suspense fallback="loading">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <OpenProvider.Provider value={false}>
              <AppRouting />
            </OpenProvider.Provider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.Suspense>
  </StrictMode>
)
