import { FormattedMessage } from 'react-intl'
import { createBrowserRouter, createRoutesFromElements, Navigate, Outlet, Route, RouterProvider } from 'react-router'

import { AnonymousLayout, ConnectedLayout, RootLayout } from '@Layouts/'
import { Dashboard } from './pages/Dashboard'
import { MyProfile } from '@Auth/pages'
import { NotFound } from '@Common/NotFound'
import { Logout } from '@Auth/ui/Logout/Logout'
import { GameDetail, GameList } from '@Game/index'
import { CalendarPage } from '@Calendar/index'
import { TeamCreatePage, TeamPage, TeamsPage } from '@Teams/pages'
import { TeamPlayersPage } from '@Player/pages'
import { MainSettingsPage, SettingsLayout } from '@Settings/index'
import { AreasPage } from '@Area/index'
import { TeamEditPage } from '@Teams/pages'
import { TeamLayout } from '@Teams/index'
import { CheckAuthentication } from '@Auth/ui/CheckAuthentication/CheckAuthentication'
import { RequireRole } from '@Auth/ui/RequireRole/RequireRole'
import { ActivatePage, ForgottenPasswordPage, LoginPage, RegisterPage, ResetPasswordPage } from '@Auth/pages'
import { OnboardingScreen } from '@Auth/ui/OnboardingScreen/OnboardingScreen'
import { TeamBreadcrumb } from '@Teams'
import { ChampionshipWizardPage } from '@Championship/pages/ChampionshipWizardPage'
import { ChampionshipDetailPage } from '@Championship/pages/ChampionshipDetailPage'
import { ChampionshipBreadcrumb } from '@Championship/ui/ChampionshipBreadcrumb/ChampionshipBreadcrumb'
import {
  AdminUsersPage,
  AdminChampionshipsPage,
  AdminTeamsPage,
  AdminTeamDeletePage,
  AdminAgeCategoriesPage,
  AdminSeasonsPage,
  AdminMatchesPage,
} from '@Admin'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
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
        <Route path="onboarding" element={<OnboardingScreen />} />
        <Route
          path="my-profile"
          element={<MyProfile />}
          handle={{ breadcrumb: <FormattedMessage id="breadcrumb.myProfile" /> }}
        />

        <Route path="team" element={<TeamLayout />} handle={{ breadcrumb: <FormattedMessage id="breadcrumb.teams" /> }}>
          <Route index element={<Navigate to="list" />} />

          <Route path="list" element={<TeamsPage />} handle={{ breadcrumb: <FormattedMessage id="breadcrumb.list" /> }}>
            <Route
              path=":teamId/edit"
              element={<TeamEditPage />}
              handle={{
                breadcrumb: (params: Record<string, string | undefined>) => <TeamBreadcrumb teamId={params.teamId!} />,
              }}
            />
            <Route
              path="create"
              element={<TeamCreatePage />}
              handle={{ breadcrumb: <FormattedMessage id="breadcrumb.create" /> }}
            />
          </Route>

          <Route
            path=":teamId"
            handle={{
              breadcrumb: (params: Record<string, string | undefined>) => <TeamBreadcrumb teamId={params.teamId!} />,
            }}
          >
            <Route index element={<TeamPage />} />
            <Route
              path="players"
              element={<TeamPlayersPage />}
              handle={{ breadcrumb: <FormattedMessage id="breadcrumb.players" /> }}
            />
          </Route>

          <Route
            path="create"
            element={<TeamCreatePage />}
            handle={{ breadcrumb: <FormattedMessage id="breadcrumb.create" /> }}
          />
        </Route>

        <Route
          path="calendar"
          element={<CalendarPage />}
          handle={{ breadcrumb: <FormattedMessage id="breadcrumb.calendar" /> }}
        />

        <Route path="games" handle={{ breadcrumb: <FormattedMessage id="breadcrumb.matches" /> }}>
          <Route index element={<GameList />} />
          <Route
            path=":gameId"
            element={<GameDetail />}
            handle={{ breadcrumb: (params: Record<string, string | undefined>) => params.gameId }}
          />
        </Route>

        <Route
          path="admin"
          element={
            <RequireRole allowed={user => Boolean(user.isAdmin)}>
              <Outlet />
            </RequireRole>
          }
          handle={{ breadcrumb: <FormattedMessage id="breadcrumb.admin" /> }}
        >
          <Route index element={<Navigate to="users" />} />
          <Route
            path="users"
            element={<AdminUsersPage />}
            handle={{ breadcrumb: <FormattedMessage id="breadcrumb.adminUsers" /> }}
          />
          <Route path="championships" handle={{ breadcrumb: <FormattedMessage id="breadcrumb.championships" /> }}>
            <Route index element={<AdminChampionshipsPage />} />
            <Route
              path="new"
              element={<ChampionshipWizardPage />}
              handle={{ breadcrumb: <FormattedMessage id="breadcrumb.newChampionship" /> }}
            />
            <Route
              path="new/:championshipId"
              element={<ChampionshipWizardPage />}
              handle={{ breadcrumb: <FormattedMessage id="breadcrumb.resumeChampionship" /> }}
            />
            <Route
              path=":championshipId"
              element={<ChampionshipDetailPage />}
              handle={{
                breadcrumb: (params: Record<string, string | undefined>) => (
                  <ChampionshipBreadcrumb championshipId={params.championshipId!} />
                ),
              }}
            />
          </Route>
          <Route
            path="teams"
            element={<AdminTeamsPage />}
            handle={{ breadcrumb: <FormattedMessage id="breadcrumb.teams" /> }}
          >
            <Route
              path=":teamId/delete"
              element={<AdminTeamDeletePage />}
              handle={{ breadcrumb: <FormattedMessage id="breadcrumb.delete" /> }}
            />
          </Route>
          <Route path="matches" handle={{ breadcrumb: <FormattedMessage id="breadcrumb.matches" /> }}>
            <Route index element={<AdminMatchesPage />} />
          </Route>
        </Route>

        <Route
          path="settings"
          element={<SettingsLayout />}
          handle={{ breadcrumb: <FormattedMessage id="breadcrumb.settings" /> }}
        >
          <Route index element={<MainSettingsPage />} />

          <Route
            element={<AreasPage />}
            path="areas"
            handle={{ breadcrumb: <FormattedMessage id="breadcrumb.areas" /> }}
          />
          <Route
            path="age-categories"
            element={
              <RequireRole allowed={user => Boolean(user.isAdmin)}>
                <AdminAgeCategoriesPage />
              </RequireRole>
            }
            handle={{ breadcrumb: <FormattedMessage id="breadcrumb.ageCategories" /> }}
          />
          <Route
            path="seasons"
            element={
              <RequireRole allowed={user => Boolean(user.isAdmin)}>
                <AdminSeasonsPage />
              </RequireRole>
            }
            handle={{ breadcrumb: <FormattedMessage id="breadcrumb.seasons" /> }}
          />
        </Route>
      </Route>

      <Route path="auth" element={<AnonymousLayout />} errorElement={<NotFound />}>
        <Route index path="signin" element={<LoginPage />} />
        <Route path="logout" element={<Logout />} />
        <Route path="forgotten-password" element={<ForgottenPasswordPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="activate" element={<ActivatePage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
    </Route>
  )
)

export const AppRouting = () => <RouterProvider router={router} />
