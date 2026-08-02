import type { IBracketRepository } from '../ports/IBracketRepository.js'
import type { CreateBracketInput } from '../domain/Bracket.js'

export class BracketUseCases {
  constructor(private readonly repo: IBracketRepository) {}

  create(input: CreateBracketInput) {
    return this.repo.create(input)
  }
}
