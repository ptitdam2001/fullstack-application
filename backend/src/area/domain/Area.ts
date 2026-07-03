export type Area = {
  id: string
  name: string | null
  address: string
  city: string
  longitude: number
  latitude: number
  updatedAt: Date
}

export type CreateAreaInput = Omit<Area, 'id' | 'updatedAt'>
export type UpdateAreaInput = Partial<CreateAreaInput>
