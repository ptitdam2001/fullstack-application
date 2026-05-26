import { TeamRole } from '@Sdk/model'
import type { Team, UserTeam } from '@Sdk/model'

export const MOCK_COACH_TEAM_ID = '000000000000000000000001'

export const mockCoachTeam: Team = {
  id: MOCK_COACH_TEAM_ID,
  name: 'Équipe Test',
  color: '#e74c3c',
  areas: [],
}

export const mockCoachUserTeam: UserTeam = {
  id: '000000000000000000000002',
  userId: '000000000000000000000003',
  teamId: MOCK_COACH_TEAM_ID,
  role: TeamRole.COACH,
}
