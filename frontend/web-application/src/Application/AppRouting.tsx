import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router'

import { AnonymousLayout, ConnectedLayout, RootLayout } from '@Layouts/'
import { Dashboard, MyProfile, NotFound } from '@Pages/'
import { Logout } from '@Auth/Logout'
import { GameDetail, GameList } from '@Game/index'
import { CalendarPage } from '@Calendar/index'
import { TeamCreatePage, TeamPage, TeamsPage } from '@Teams/pages'
import { TeamPlayersPage } from '@Player/pages'
import { AreaEditPage, AreaPages, SettingsLayout } from '@Settings/index'
import { TeamEditPage } from '@Teams/pages'
import { TeamLayout } from '@Teams/index'
import { CheckAuthentication } from '@Auth/CheckAuthentication/CheckAuthentication'
import { ForgottenPasswordPage, LoginPage } from '@Auth/pages'
import { TeamBreadcrumb } from '@Teams/TeamBreadcrumb'
import { AreaBreadcrumb } from '@Settings/AreaBreadcrumb'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />} />

      <Route
        path="app"
        element={
          <CheckAuthentication>
            <ConnectedLayout />
          </CheckAuthentication>
        }
        errorElement={<NotFound />}
      >
        <Route index element={<Dashboard />} />
        <Route path="my-profile" element={<MyProfile />} handle={{ breadcrumb: 'Mon profil' }} />

        <Route path="team" element={<TeamLayout />} handle={{ breadcrumb: 'Équipes' }}>
          <Route index element={<Navigate to="list" />} />

          <Route path="list" element={<TeamsPage />} handle={{ breadcrumb: 'Liste' }}>
            <Route
              path=":teamId/edit"
              element={<TeamEditPage />}
              handle={{
                breadcrumb: (params: Record<string, string | undefined>) => <TeamBreadcrumb teamId={params.teamId!} />,
              }}
            />
            <Route path="create" element={<TeamCreatePage />} handle={{ breadcrumb: 'Créer' }} />
          </Route>

          <Route
            path=":teamId"
            handle={{
              breadcrumb: (params: Record<string, string | undefined>) => <TeamBreadcrumb teamId={params.teamId!} />,
            }}
          >
            <Route index element={<TeamPage />} />
            <Route path="players" element={<TeamPlayersPage />} handle={{ breadcrumb: 'Joueurs' }} />
          </Route>

          <Route path="create" element={<TeamCreatePage />} handle={{ breadcrumb: 'Créer' }} />
        </Route>

        <Route path="calendar" element={<CalendarPage />} handle={{ breadcrumb: 'Calendrier' }} />

        <Route path="games" handle={{ breadcrumb: 'Matchs' }}>
          <Route index element={<GameList />} />
          <Route
            path=":gameId"
            element={<GameDetail />}
            handle={{ breadcrumb: (params: Record<string, string | undefined>) => params.gameId }}
          />
        </Route>

        <Route path="settings" element={<SettingsLayout />} handle={{ breadcrumb: 'Paramètres' }}>
          <Route index element={<Navigate to="areas" />} />
          <Route element={<AreaPages />} path="areas" handle={{ breadcrumb: 'Aires' }}>
            <Route
              element={<AreaEditPage />}
              path=":areaId/edit"
              handle={{
                breadcrumb: (params: Record<string, string | undefined>) => <AreaBreadcrumb areaId={params.areaId!} />,
              }}
            />
            <Route element={<AreaEditPage />} path="create" handle={{ breadcrumb: 'Créer' }} />
          </Route>
        </Route>
      </Route>

      <Route path="auth" element={<AnonymousLayout />} errorElement={<NotFound />}>
        <Route index path="signin" element={<LoginPage />} />
        <Route path="logout" element={<Logout />} />
        <Route path="forgotten-password" element={<ForgottenPasswordPage />} />
      </Route>
    </>
  )
)

export const AppRouting = () => {
  return <RouterProvider router={router} />
}
