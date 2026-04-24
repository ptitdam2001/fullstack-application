import type { IPlayerRepository } from '../ports/IPlayerRepository.js'
import type { CreatePlayerInput, UpdatePlayerInput } from '../domain/Player.js'
import { PlayerNotFoundError } from '../domain/PlayerErrors.js'

export class PlayerUseCases {
  constructor(private readonly repo: IPlayerRepository) {}

  create(input: CreatePlayerInput) {
    return this.repo.create(input)
  }

  async update(id: string, input: UpdatePlayerInput) {
    const player = await this.repo.findById(id)
    if (!player) throw new PlayerNotFoundError(id)
    return this.repo.update(id, input)
  }

  async delete(id: string) {
    const player = await this.repo.findById(id)
    if (!player) throw new PlayerNotFoundError(id)
    return this.repo.delete(id)
  }
}
