import type { Season, CreateSeasonInput, UpdateSeasonInput } from '../domain/Season.js'

export type PaginationOptions = { page: number; count: number }

export interface ISeasonRepository {
  count(): Promise<number>
  findAll(options: PaginationOptions): Promise<Season[]>
  findById(id: string): Promise<Season | null>
  create(input: CreateSeasonInput): Promise<Season>
  update(id: string, input: UpdateSeasonInput): Promise<Season>
  softDelete(id: string): Promise<void>
}
