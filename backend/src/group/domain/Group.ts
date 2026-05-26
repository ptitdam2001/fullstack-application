export enum MatchMode {
  SINGLE = 'SINGLE',
  HOME_AND_AWAY = 'HOME_AND_AWAY',
}

export type Group = {
  id: string
  phaseId: string
  name: string
  matchMode: MatchMode
  teamIds: string[]
  updatedAt: Date
}

export type CreateGroupInput = Omit<Group, 'id' | 'updatedAt'>
export type UpdateGroupInput = Partial<CreateGroupInput>
