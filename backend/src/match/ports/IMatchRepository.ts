import type { Match, MatchStatus, CreateMatchInput, UpdateMatchInput } from '../domain/Match.js'
import type { PaginationOptions } from '../../../utils/pagination.js'

export type { PaginationOptions }
export type MatchFilterOptions = {
  status?: MatchStatus
  pastDue?: boolean
  championshipId?: string
  ageCategoryId?: string
}

export interface IMatchRepository {
  count(filters?: MatchFilterOptions): Promise<number>
  findAll(options: PaginationOptions, filters?: MatchFilterOptions): Promise<Match[]>
  findById(id: string): Promise<Match | null>
  findByGroupId(groupId: string): Promise<Match[]>
  findByBracketId(bracketId: string): Promise<Match[]>
  create(input: CreateMatchInput): Promise<Match>
  update(id: string, input: UpdateMatchInput): Promise<Match>
  delete(id: string): Promise<void>
  softDelete(id: string): Promise<void>
}
