import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, renderHook, screen, type RenderOptions } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
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

// eslint-disable-next-line react-refresh/only-export-components
function CurrentPath() {
  return <p data-testid="current-path">{useLocation().pathname}</p>
}

/**
 * Renders `ui` under the route `path`, so that relative navigations resolve as in the application.
 * Any other path renders a probe: read it with `currentPath()` after a navigation.
 */
export function renderAtRoute(ui: ReactNode, path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={ui} />
        <Route path="*" element={<CurrentPath />} />
      </Routes>
    </MemoryRouter>
  )
}

export function currentPath() {
  return screen.getByTestId('current-path').textContent
}
