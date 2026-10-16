import type { Season, CreateSeasonInput, UpdateSeasonInput } from '../domain/Season.js'
import type { PaginationOptions } from '../../../utils/pagination.js'

export type { PaginationOptions }

export interface ISeasonRepository {
  count(): Promise<number>
  findAll(options: PaginationOptions): Promise<Season[]>
  findById(id: string): Promise<Season | null>
  create(input: CreateSeasonInput): Promise<Season>
  update(id: string, input: UpdateSeasonInput): Promise<Season>
  softDelete(id: string): Promise<void>
}
