import type { IPlayerRepository } from '../ports/IPlayerRepository.js'
import type { CreatePlayerInput } from '../domain/Player.js'
import { PlayerNotFoundError } from '../domain/PlayerErrors.js'

export class PlayerUseCases {
  constructor(private readonly repo: IPlayerRepository) {}

  create(input: CreatePlayerInput) {
    return this.repo.create(input)
  }

  async assignToTeam(userId: string, teamId: string) {
    const player = await this.repo.findByUserId(userId)
    if (!player) throw new PlayerNotFoundError(userId)
    return this.repo.assignToTeam(userId, teamId)
  }
}
