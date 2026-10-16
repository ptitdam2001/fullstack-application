import type { Championship, CreateChampionshipInput, UpdateChampionshipInput } from '../domain/Championship.js'
import type { PaginationOptions } from '../../../utils/pagination.js'

export type { PaginationOptions }

export interface IChampionshipRepository {
  count(): Promise<number>
  findAll(options: PaginationOptions): Promise<Championship[]>
  findById(id: string): Promise<Championship | null>
  findBySeasonId(seasonId: string): Promise<Championship[]>
  create(input: CreateChampionshipInput): Promise<Championship>
  update(id: string, input: UpdateChampionshipInput): Promise<Championship>
  delete(id: string): Promise<void>
  softDelete(id: string): Promise<void>
  hasPlayedMatches(id: string): Promise<boolean>
}
