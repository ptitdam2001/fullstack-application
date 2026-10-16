import type { AgeCategory, CreateAgeCategoryInput, UpdateAgeCategoryInput } from '../domain/AgeCategory.js'
import type { PaginationOptions } from '../../../utils/pagination.js'

export type { PaginationOptions }

export interface IAgeCategoryRepository {
  count(): Promise<number>
  findAll(options: PaginationOptions): Promise<AgeCategory[]>
  findById(id: string): Promise<AgeCategory | null>
  create(input: CreateAgeCategoryInput): Promise<AgeCategory>
  update(id: string, input: UpdateAgeCategoryInput): Promise<AgeCategory>
  delete(id: string): Promise<void>
}
