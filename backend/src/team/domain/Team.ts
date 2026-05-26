import type { AgeCategory } from '../../championship/domain/Championship.js'

export type Team = {
  id: string
  name: string
  color: string | null
  updatedAt: Date
}

export type CreateTeamInput = Omit<Team, 'id' | 'updatedAt'>
export type UpdateTeamInput = Partial<CreateTeamInput>

export type AreaWithoutId = {
  name?: string
  address: string
  city: string
  longitude: number
  latitude: number
}

export type CreateTeamWithCoachInput = {
  name: string
  ageCategory: AgeCategory
  color: string
  areas: AreaWithoutId[]
}

export type TeamCurrentGroup = {
  groupId: string
  groupName: string
  phaseId: string
  championshipId: string
}