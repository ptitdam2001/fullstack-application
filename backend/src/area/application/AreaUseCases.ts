import type { IAreaRepository, PaginationOptions } from '../ports/IAreaRepository.js'
import type { CreateAreaInput, UpdateAreaInput } from '../domain/Area.js'
import { AreaNotFoundError } from '../domain/AreaErrors.js'

export class AreaUseCases {
  constructor(private readonly repo: IAreaRepository) {}

  count() {
    return this.repo.count()
  }

  getAll(options: PaginationOptions) {
    return this.repo.findAll(options)
  }

  async getById(id: string) {
    const area = await this.repo.findById(id)
    if (!area) {
      throw new AreaNotFoundError(id)
    }
    return area
  }

  create(input: CreateAreaInput) {
    return this.repo.create(input)
  }

  async update(id: string, input: UpdateAreaInput) {
    await this.getById(id)
    return this.repo.update(id, input)
  }

  async delete(id: string) {
    await this.getById(id)
    return this.repo.delete(id)
  }
}
