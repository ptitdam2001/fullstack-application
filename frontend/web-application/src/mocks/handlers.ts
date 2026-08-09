import { getAgeCategoryMock } from '@Sdk/age-category/age-category.msw'
import { getAreaMock } from '@Sdk/area/area.msw'
import { getAuthenticationMock } from '@Sdk/authentication/authentication.msw'
import { getBracketMock } from '@Sdk/bracket/bracket.msw'
import { getChampionshipMock } from '@Sdk/championship/championship.msw'
import { getGamesMock } from '@Sdk/games/games.msw'
import { getGroupMock } from '@Sdk/group/group.msw'
import { getMatchMock } from '@Sdk/match/match.msw'
import { getPhaseMock } from '@Sdk/phase/phase.msw'
import { getSeasonMock } from '@Sdk/season/season.msw'
import { getTeamMock } from '@Sdk/team/team.msw'
import { getGetTeamsMockHandler, getTeamsMock, getGetTeamsResponseMock } from '@Sdk/teams/teams.msw'
import { getGetCoachTeamsMockHandler } from '@Sdk/user-team/user-team.msw'
import { getUsersMock } from '@Sdk/users/users.msw'
import { mockCoachTeam, mockCoachUserTeam } from './fixtures'

export const handlers = [
  // Overrides first — MSW v2 uses first-match-wins
  getGetTeamsMockHandler([mockCoachTeam, ...getGetTeamsResponseMock()]),
  getGetCoachTeamsMockHandler([mockCoachUserTeam]),
  ...getAgeCategoryMock(),
  ...getAreaMock(),
  ...getAuthenticationMock(),
  ...getBracketMock(),
  ...getChampionshipMock(),
  ...getGamesMock(),
  ...getGroupMock(),
  ...getMatchMock(),
  ...getPhaseMock(),
  ...getSeasonMock(),
  ...getTeamMock(),
  ...getTeamsMock(),
  ...getUsersMock(),
]
