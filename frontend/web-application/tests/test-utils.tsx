import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, renderHook, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Suspense, useState, type ReactNode } from 'react'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

// eslint-disable-next-line react-refresh/only-export-components
function AllProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createTestQueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

export function renderWithProviders(ui: ReactNode, options?: RenderOptions) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// eslint-disable-next-line react-refresh/only-export-components
function SuspenseProviders({ children }: { children: ReactNode }) {
  return (
    <AllProviders>
      <Suspense fallback={null}>{children}</Suspense>
    </AllProviders>
  )
}

export function renderHookWithProviders<T>(hook: () => T) {
  return renderHook(hook, { wrapper: SuspenseProviders })
}
