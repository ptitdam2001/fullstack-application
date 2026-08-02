import type { ISeasonRepository, PaginationOptions } from '../ports/ISeasonRepository.js'
import type { CreateSeasonInput, UpdateSeasonInput } from '../domain/Season.js'
import { SeasonNotFoundError, SeasonHasUnfinishedChampionshipsError } from '../domain/SeasonErrors.js'
import type { ChampionshipUseCases } from '../../championship/application/ChampionshipUseCases.js'

export class SeasonUseCases {
  constructor(
    private readonly repo: ISeasonRepository,
    private readonly championshipUseCases: ChampionshipUseCases
  ) {}

  count() {
    return this.repo.count()
  }

  getAll(options: PaginationOptions) {
    return this.repo.findAll(options)
  }

  async getById(id: string) {
    const season = await this.repo.findById(id)
    if (!season) {
      throw new SeasonNotFoundError(id)
    }
    return season
  }

  create(input: CreateSeasonInput) {
    return this.repo.create(input)
  }

  async update(id: string, input: UpdateSeasonInput) {
    await this.getById(id)
    return this.repo.update(id, input)
  }

  async archive(id: string) {
    await this.getById(id)
    const hasUnfinished = await this.championshipUseCases.hasUnfinishedChampionships(id)
    if (hasUnfinished) {
      throw new SeasonHasUnfinishedChampionshipsError(id)
    }
    return this.repo.softDelete(id)
  }
}
