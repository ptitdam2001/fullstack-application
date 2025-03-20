import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { AnonymousLayout, ConnectedLayout, RootLayout } from '@Layouts/'
import { Dashboard, Login, MyProfile, NotFound, ResetPassword } from '@Pages/'
import { AuthenticatedContent } from '@Auth/AuthenticatedContent'
import { Logout } from '@Auth/Logout'
import { GameDetail, GameList } from '@Game/index'
import { Calendar } from '@Calendar/index'
import { TeamPage, TeamsPage } from '@Teams/pages'
import { TeamPlayersPage } from '@Player/pages'
import { AreaEditPage, AreaPages, SettingsLayout } from '@Settings/index'
import { TeamEditPage } from '@Teams/pages'
import { TeamLayout } from '@Teams/index'

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

          <Route path="team" element={<TeamLayout />}>
            <Route index element={<Navigate to="list" />} />
            <Route path="list" element={<TeamsPage />}>
              <Route path=":teamId/edit" element={<TeamEditPage />} />
              <Route path="create" element={<TeamEditPage />} />
            </Route>
            <Route path=":teamId">
              <Route index element={<TeamPage />} />
              <Route path="players" element={<TeamPlayersPage />} />
            </Route>
            <Route path="create" element={<TeamEditPage />} />
          </Route>

          <Route path="calendar" element={<Calendar />} />

          <Route path="games">
            <Route index element={<GameList />} />
            <Route path=":gameId" element={<GameDetail />} />
          </Route>

          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="areas" />} />

            <Route element={<AreaPages />} path="areas">
              <Route element={<AreaEditPage />} path=":areaId/edit" />
              <Route element={<AreaEditPage />} path="create" />
            </Route>
          </Route>
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
