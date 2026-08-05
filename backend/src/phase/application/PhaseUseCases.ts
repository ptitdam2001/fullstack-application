import type { IPhaseRepository } from '../ports/IPhaseRepository.js'
import type { CreatePhaseInput, UpdatePhaseInput } from '../domain/Phase.js'
import { PhaseNotFoundError, PhaseDuplicateOrderError, PreviousPhaseNotFinishedError } from '../domain/PhaseErrors.js'

export class PhaseUseCases {
  constructor(private readonly repo: IPhaseRepository) {}

  getByChampionshipId(championshipId: string) {
    return this.repo.findByChampionshipId(championshipId)
  }

  async getById(id: string) {
    const phase = await this.repo.findById(id)
    if (!phase) {
      throw new PhaseNotFoundError(id)
    }
    return phase
  }

  async create(input: CreatePhaseInput) {
    const existing = await this.repo.findByChampionshipId(input.championshipId)
    if (existing.some(p => p.order === input.order)) {
      throw new PhaseDuplicateOrderError(input.championshipId, input.order)
    }
    if (input.order > 1) {
      const previousPhase = existing.find(p => p.order === input.order - 1)
      const previousFinished = previousPhase ? await this.repo.isFinished(previousPhase.id) : false
      if (!previousFinished) {
        throw new PreviousPhaseNotFinishedError(input.championshipId, input.order)
      }
    }
    return this.repo.create(input)
  }

  async update(id: string, input: UpdatePhaseInput) {
    await this.getById(id)
    return this.repo.update(id, input)
  }

  async delete(id: string) {
    await this.getById(id)
    const hasHistory = await this.repo.hasPlayedMatches(id)
    if (hasHistory) {
      return this.repo.softDelete(id)
    }
    return this.repo.delete(id)
  }
}
