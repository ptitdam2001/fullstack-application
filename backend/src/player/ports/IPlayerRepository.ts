import type { Player, CreatePlayerInput, UpdatePlayerInput } from '../domain/Player.js'

export interface IPlayerRepository {
  findById(id: string): Promise<Player | null>
  findByUserId(userId: string): Promise<Player | null>
  create(input: CreatePlayerInput): Promise<Player>
  update(id: string, input: UpdatePlayerInput): Promise<Player>
  assignToTeam(userId: string, teamId: string): Promise<void>
}
