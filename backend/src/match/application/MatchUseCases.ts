import type { IMatchRepository, PaginationOptions, MatchFilterOptions } from '../ports/IMatchRepository.js'
import type { CreateMatchInput, UpdateMatchInput } from '../domain/Match.js'
import { MatchStatus } from '../domain/Match.js'
import { MatchNotFoundError } from '../domain/MatchErrors.js'
import type { BracketUseCases } from '../../bracket/application/BracketUseCases.js'

export class MatchUseCases {
  constructor(
    private readonly repo: IMatchRepository,
    private readonly bracketUseCases: BracketUseCases
  ) {}

  count(filters?: MatchFilterOptions) {
    return this.repo.count(filters)
  }

  getAll(options: PaginationOptions, filters?: MatchFilterOptions) {
    return this.repo.findAll(options, filters)
  }

  async getById(id: string) {
    const match = await this.repo.findById(id)
    if (!match) {
      throw new MatchNotFoundError(id)
    }
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
    const updated = await this.repo.update(id, input)
    if (updated.bracketId && (updated.status === MatchStatus.PLAYED || updated.status === MatchStatus.FORFEITED)) {
      await this.bracketUseCases.advanceWinner(updated)
    }
    return updated
  }

  async delete(id: string) {
    const match = await this.getById(id)
    if (match.status === MatchStatus.SCHEDULED || match.status === MatchStatus.CANCELLED) {
      return this.repo.delete(id)
    }
    return this.repo.softDelete(id)
  }
}
