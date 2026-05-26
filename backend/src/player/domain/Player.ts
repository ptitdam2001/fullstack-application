export type Player = {
  id: string
  userId: string
  teamId: string
  jersey: number | null
  position: string | null
  updatedAt: Date
}

export type CreatePlayerInput = Omit<Player, 'id' | 'updatedAt'>
export type UpdatePlayerInput = Partial<Omit<CreatePlayerInput, 'userId' | 'teamId'>>
