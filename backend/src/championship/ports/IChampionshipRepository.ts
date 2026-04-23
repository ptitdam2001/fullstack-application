import type { Championship, CreateChampionshipInput, UpdateChampionshipInput } from '../domain/Championship.js'

export type PaginationOptions = { page: number; count: number }

export interface IChampionshipRepository {
  count(): Promise<number>
  findAll(options: PaginationOptions): Promise<Championship[]>
  findById(id: string): Promise<Championship | null>
  create(input: CreateChampionshipInput): Promise<Championship>
  update(id: string, input: UpdateChampionshipInput): Promise<Championship>
  delete(id: string): Promise<void>
}
