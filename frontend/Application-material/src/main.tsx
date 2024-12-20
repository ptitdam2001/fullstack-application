import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@Auth/AuthProvider'
import { AnonymousLayout, ConnectedLayout, RootLayout } from '@Layouts/'
import { Dashboard, Login, MyProfile, NotFound, ResetPassword } from '@Pages/'
import { AuthenticatedContent } from '@Auth/AuthenticatedContent'
import { Logout } from '@Auth/Logout'
import { OpenProvider } from '@Providers/OpenProvider'
import { ThemeProvider } from '@Theme/ThemeProvider'
import { Team } from '@Pages/Team'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <React.Suspense fallback="loading">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <OpenProvider.Provider value={false}>
                <Routes>
                  <Route path="/" element={<RootLayout />} />
                  <Route
                    path="app"
                    element={
                      <AuthenticatedContent>
                        <ConnectedLayout />
                      </AuthenticatedContent>
                    }
                    errorElement={<NotFound />}
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="my-profile" element={<MyProfile />} />
                    <Route path="my-team" element={<Team />} />
                  </Route>
                  <Route path="auth" element={<AnonymousLayout />} errorElement={<NotFound />}>
                    <Route index path="signin" element={<Login />} />
                    <Route path="logout" element={<Logout />} />
                    <Route path="forgotten-password" element={<ResetPassword />} />
                  </Route>
                </Routes>
              </OpenProvider.Provider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </React.Suspense>
  </StrictMode>
)
