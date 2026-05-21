import type { IMatchRepository, PaginationOptions, MatchFilterOptions } from '../ports/IMatchRepository.js'
import type { CreateMatchInput, UpdateMatchInput } from '../domain/Match.js'
import { MatchNotFoundError } from '../domain/MatchErrors.js'

export class MatchUseCases {
  constructor(private readonly repo: IMatchRepository) {}

  count() {
    return this.repo.count()
  }

  getAll(options: PaginationOptions, filters?: MatchFilterOptions) {
    return this.repo.findAll(options, filters)
  }

  async getById(id: string) {
    const match = await this.repo.findById(id)
    if (!match) throw new MatchNotFoundError(id)
    return match
  }

  getByGroupId(groupId: string) {
    return this.repo.findByGroupId(groupId)
  }

  create(input: CreateMatchInput) {
    return this.repo.create(input)
  }

  async update(id: string, input: UpdateMatchInput) {
    await this.getById(id)
    return this.repo.update(id, input)
  }

  async delete(id: string) {
    await this.getById(id)
    return this.repo.delete(id)
  }
}
