import type { Bracket, CreateBracketInput } from '../domain/Bracket.js'

export interface IBracketRepository {
  create(input: CreateBracketInput): Promise<Bracket>
}
