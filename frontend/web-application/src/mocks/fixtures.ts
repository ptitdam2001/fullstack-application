import { TeamRole } from '@Sdk/model'
import type { AgeCategory, Team, UserTeam } from '@Sdk/model'

const MOCK_COACH_TEAM_ID = '000000000000000000000001'

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

export const mockAgeCategories: AgeCategory[] = [
  {
    id: 'age-cat-1',
    label: 'U13',
    genre: 'MALE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'age-cat-2',
    label: 'U15',
    genre: 'FEMALE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'age-cat-3',
    label: 'Senior',
    genre: 'MIXED',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]
