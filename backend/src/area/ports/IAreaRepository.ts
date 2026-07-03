import type { Area, CreateAreaInput, UpdateAreaInput } from '../domain/Area.js'

export type PaginationOptions = { page: number; limit: number }

export interface IAreaRepository {
  count(): Promise<number>
  findAll(options: PaginationOptions): Promise<Area[]>
  findById(id: string): Promise<Area | null>
  create(input: CreateAreaInput): Promise<Area>
  update(id: string, input: UpdateAreaInput): Promise<Area>
  delete(id: string): Promise<void>
}
