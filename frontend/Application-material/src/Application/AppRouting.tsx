import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AnonymousLayout, ConnectedLayout, RootLayout } from '@Layouts/'
import { Dashboard, Login, MyProfile, NotFound, ResetPassword } from '@Pages/'
import { AuthenticatedContent } from '@Auth/AuthenticatedContent'
import { Logout } from '@Auth/Logout'

export const AppRouting = () => {
  return (
    <BrowserRouter>
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
        </Route>
        <Route path="auth" element={<AnonymousLayout />} errorElement={<NotFound />}>
          <Route index path="signin" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="forgotten-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
