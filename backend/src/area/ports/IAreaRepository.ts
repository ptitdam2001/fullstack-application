import type { Area, CreateAreaInput, UpdateAreaInput } from '../domain/Area.js'
import type { PaginationOptions } from '../../../utils/pagination.js'

export type { PaginationOptions }

export interface IAreaRepository {
  count(): Promise<number>
  findAll(options: PaginationOptions): Promise<Area[]>
  findById(id: string): Promise<Area | null>
  create(input: CreateAreaInput): Promise<Area>
  update(id: string, input: UpdateAreaInput): Promise<Area>
  delete(id: string): Promise<void>
}
