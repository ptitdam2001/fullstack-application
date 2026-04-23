import type { IChampionshipRepository, PaginationOptions } from '../ports/IChampionshipRepository.js'
import type { CreateChampionshipInput, UpdateChampionshipInput } from '../domain/Championship.js'
import { ChampionshipNotFoundError } from '../domain/ChampionshipErrors.js'

export class ChampionshipUseCases {
  constructor(private readonly repo: IChampionshipRepository) {}

  count() {
    return this.repo.count()
  }

  getAll(options: PaginationOptions) {
    return this.repo.findAll(options)
  }

  async getById(id: string) {
    const championship = await this.repo.findById(id)
    if (!championship) throw new ChampionshipNotFoundError(id)
    return championship
  }

  create(input: CreateChampionshipInput) {
    return this.repo.create(input)
  }

  async update(id: string, input: UpdateChampionshipInput) {
    await this.getById(id)
    return this.repo.update(id, input)
  }

  async delete(id: string) {
    await this.getById(id)
    return this.repo.delete(id)
  }
}
