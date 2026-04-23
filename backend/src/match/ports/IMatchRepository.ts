import type { Match, CreateMatchInput, UpdateMatchInput } from '../domain/Match.js'

export type PaginationOptions = { page: number; count: number }

export interface IMatchRepository {
  count(): Promise<number>
  findAll(options: PaginationOptions): Promise<Match[]>
  findById(id: string): Promise<Match | null>
  create(input: CreateMatchInput): Promise<Match>
  update(id: string, input: UpdateMatchInput): Promise<Match>
  delete(id: string): Promise<void>
}
