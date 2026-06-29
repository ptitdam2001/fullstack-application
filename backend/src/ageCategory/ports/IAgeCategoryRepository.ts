import type { AgeCategory, CreateAgeCategoryInput, UpdateAgeCategoryInput } from '../domain/AgeCategory.js'

export type PaginationOptions = { page: number; count: number }

export interface IAgeCategoryRepository {
  count(): Promise<number>
  findAll(options: PaginationOptions): Promise<AgeCategory[]>
  findById(id: string): Promise<AgeCategory | null>
  create(input: CreateAgeCategoryInput): Promise<AgeCategory>
  update(id: string, input: UpdateAgeCategoryInput): Promise<AgeCategory>
  delete(id: string): Promise<void>
}
