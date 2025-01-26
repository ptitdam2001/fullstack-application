import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AnonymousLayout, ConnectedLayout, RootLayout } from '@Layouts/'
import { Dashboard, Login, MyProfile, NotFound, ResetPassword } from '@Pages/'
import { AuthenticatedContent } from '@Auth/AuthenticatedContent'
import { Logout } from '@Auth/Logout'
import { TeamDetail, TeamList } from '@Teams/index'
import { PlayerList } from '@Player/index'
import { GameDetail, GameList } from '@Game/index'
import { Calendar } from '@Calendar/index'

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

          <Route path="team">
            <Route index element={<TeamList />} />
            <Route path=":teamId">
              <Route index element={<TeamDetail />} />
              <Route path="players" element={<PlayerList />} />
            </Route>
          </Route>

          <Route path="calendar" element={<Calendar />} />

          <Route path="games">
            <Route index element={<GameList />} />
            <Route path=":gameId" element={<GameDetail />} />
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
