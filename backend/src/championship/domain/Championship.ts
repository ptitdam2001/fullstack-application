export enum AgeCategory {
  U9 = 'U9',
  U11 = 'U11',
  U13 = 'U13',
  U15 = 'U15',
  U18 = 'U18',
  Senior = 'Senior',
}

export type PointsConfig = {
  win: number
  draw: number
  loss: number
  forfeit: number
}

export type Championship = {
  id: string
  name: string | null
  ageCategory: AgeCategory
  season: string
  startDate: Date | null
  endDate: Date | null
  pointsConfig: PointsConfig
}

export type CreateChampionshipInput = Omit<Championship, 'id'>
export type UpdateChampionshipInput = Partial<CreateChampionshipInput>
