import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import React from 'react'
import { AuthProvider } from '@Auth/AuthProvider'
import { AnonymousLayout, ConnectedLayout, RootLayout } from '@Layouts/'
import { Dashboard, Login, MyProfile, NotFound, ResetPassword } from '@Pages/'
import { AuthenticatedContent } from '@Auth/AuthenticatedContent'
import { Logout } from '@Auth/Logout'

import '@fontsource/roboto'
import '@fontsource/poppins'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <React.Suspense fallback="loading">
      <BrowserRouter>
        <AuthProvider>
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
              <Route path="my-first-page" element={<span>My first page</span>} />
            </Route>
            <Route path="auth" element={<AnonymousLayout />} errorElement={<NotFound />}>
              <Route index path="signin" element={<Login />} />
              <Route path="logout" element={<Logout />} />
              <Route path="forgotten-password" element={<ResetPassword />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </React.Suspense>
  </StrictMode>
)
