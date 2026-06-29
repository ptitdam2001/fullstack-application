import type { IAgeCategoryRepository, PaginationOptions } from '../ports/IAgeCategoryRepository.js'
import type { CreateAgeCategoryInput, UpdateAgeCategoryInput } from '../domain/AgeCategory.js'
import { AgeCategoryNotFoundError } from '../domain/AgeCategoryErrors.js'

export class AgeCategoryUseCases {
  constructor(private readonly repo: IAgeCategoryRepository) {}

  count() {
    return this.repo.count()
  }

  getAll(options: PaginationOptions) {
    return this.repo.findAll(options)
  }

  async getById(id: string) {
    const ageCategory = await this.repo.findById(id)
    if (!ageCategory) {
      throw new AgeCategoryNotFoundError(id)
    }
    return ageCategory
  }

  create(input: CreateAgeCategoryInput) {
    return this.repo.create(input)
  }

  async update(id: string, input: UpdateAgeCategoryInput) {
    await this.getById(id)
    return this.repo.update(id, input)
  }

  async delete(id: string) {
    await this.getById(id)
    return this.repo.delete(id)
  }
}
