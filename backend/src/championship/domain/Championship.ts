export type PointsConfig = {
  win: number
  draw: number
  loss: number
  forfeit: number
}

export type Championship = {
  id: string
  name: string
  ageCategoryId: string
  season: string
  startDate: Date | null
  endDate: Date | null
  pointsConfig: PointsConfig
  createdAt: Date
  updatedAt: Date
}

export type CreateChampionshipInput = Omit<Championship, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateChampionshipInput = Partial<CreateChampionshipInput>
