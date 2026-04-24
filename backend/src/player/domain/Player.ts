export type Player = {
  id: string
  userId: string
  teamId: string
  jersey: number | null
  position: string | null
}

export type CreatePlayerInput = Omit<Player, 'id'>
export type UpdatePlayerInput = Partial<Omit<CreatePlayerInput, 'userId' | 'teamId'>>
