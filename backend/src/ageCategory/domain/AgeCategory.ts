export enum Genre {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  MIXED = 'MIXED',
}

export type AgeCategory = {
  id: string
  label: string
  genre: Genre
  createdAt: Date
  updatedAt: Date
}

export type CreateAgeCategoryInput = Omit<AgeCategory, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
export type UpdateAgeCategoryInput = Partial<CreateAgeCategoryInput>
