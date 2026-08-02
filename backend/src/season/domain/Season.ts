export type Season = {
  id: string
  label: string
  startDate: Date | null
  endDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export type CreateSeasonInput = Omit<Season, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
export type UpdateSeasonInput = Partial<CreateSeasonInput>
