import { getAreaMock } from '@Sdk/area/area.msw'
import { getAuthenticationMock } from '@Sdk/authentication/authentication.msw'
import { getGamesMock } from '@Sdk/games/games.msw'
import { getTeamMock } from '@Sdk/team/team.msw'
import { getTeamsMock } from '@Sdk/teams/teams.msw'
import { getUsersMock } from '@Sdk/users/users.msw'

export const handlers = [
  ...getAreaMock(),
  ...getAuthenticationMock(),
  ...getGamesMock(),
  ...getTeamMock(),
  ...getTeamsMock(),
  ...getUsersMock()
]
