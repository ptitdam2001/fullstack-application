import type { Match, MatchStatus, CreateMatchInput, UpdateMatchInput } from '../domain/Match.js'

export type PaginationOptions = { page: number; count: number }
export type MatchFilterOptions = { status?: MatchStatus; pastDue?: boolean }

export interface IMatchRepository {
  count(): Promise<number>
  findAll(options: PaginationOptions, filters?: MatchFilterOptions): Promise<Match[]>
  findById(id: string): Promise<Match | null>
  findByGroupId(groupId: string): Promise<Match[]>
  create(input: CreateMatchInput): Promise<Match>
  update(id: string, input: UpdateMatchInput): Promise<Match>
  delete(id: string): Promise<void>
  softDelete(id: string): Promise<void>
}
