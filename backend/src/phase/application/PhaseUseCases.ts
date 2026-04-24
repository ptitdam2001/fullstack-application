import type { IPhaseRepository } from '../ports/IPhaseRepository.js'
import type { CreatePhaseInput, UpdatePhaseInput } from '../domain/Phase.js'
import { PhaseNotFoundError } from '../domain/PhaseErrors.js'

export class PhaseUseCases {
  constructor(private readonly repo: IPhaseRepository) {}

  getByChampionshipId(championshipId: string) {
    return this.repo.findByChampionshipId(championshipId)
  }

  async getById(id: string) {
    const phase = await this.repo.findById(id)
    if (!phase) throw new PhaseNotFoundError(id)
    return phase
  }

  create(input: CreatePhaseInput) {
    return this.repo.create(input)
  }

  async update(id: string, input: UpdatePhaseInput) {
    await this.getById(id)
    return this.repo.update(id, input)
  }

  async delete(id: string) {
    await this.getById(id)
    return this.repo.delete(id)
  }
}
