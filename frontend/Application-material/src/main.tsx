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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SpotifyProvider } from '@Spotify/SpotifyProvider'
import { AllCategories } from '@Categories/AllCategories'

import './index.css'
import { Category } from '@Categories/Category'

const queryClient = new QueryClient()
const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENTID
const spotifyClientSecret = import.meta.env.VITE_SPOTIFY_SECRET

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <React.Suspense fallback="loading">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <SpotifyProvider clientId={spotifyClientId} clientSecret={spotifyClientSecret}>
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
                      <Route path="categories">
                        <Route index element={<AllCategories />} />

                        <Route path=":category" element={<Category />} />
                      </Route>
                    </Route>
                    <Route path="auth" element={<AnonymousLayout />} errorElement={<NotFound />}>
                      <Route index path="signin" element={<Login />} />
                      <Route path="logout" element={<Logout />} />
                      <Route path="forgotten-password" element={<ResetPassword />} />
                    </Route>
                  </Routes>
                </OpenProvider.Provider>
              </SpotifyProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </React.Suspense>
  </StrictMode>
)
