import { getAreaMock } from '@Sdk/area/area.msw'
import { getAuthenticationMock } from '@Sdk/authentication/authentication.msw'
import { getChampionshipMock } from '@Sdk/championship/championship.msw'
import { getGamesMock } from '@Sdk/games/games.msw'
import { getMatchMock } from '@Sdk/match/match.msw'
import { getTeamMock } from '@Sdk/team/team.msw'
import { getGetTeamsMockHandler, getTeamsMock, getGetTeamsResponseMock } from '@Sdk/teams/teams.msw'
import { getGetCoachTeamsMockHandler } from '@Sdk/user-team/user-team.msw'
import { getUsersMock } from '@Sdk/users/users.msw'
import { mockCoachTeam, mockCoachUserTeam } from './fixtures'

export const handlers = [
  // Overrides first — MSW v2 uses first-match-wins
  getGetTeamsMockHandler([mockCoachTeam, ...getGetTeamsResponseMock()]),
  getGetCoachTeamsMockHandler([mockCoachUserTeam]),
  ...getAreaMock(),
  ...getAuthenticationMock(),
  ...getChampionshipMock(),
  ...getGamesMock(),
  ...getMatchMock(),
  ...getTeamMock(),
  ...getTeamsMock(),
  ...getUsersMock(),
]
