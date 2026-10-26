import type { AgeCategory } from '../domain/AgeCategory'
import { useGetAgeCategories } from '../infrastructure/useAgeCategoryApi'

// Large enough to hold every age category in one page, so no count request is needed
const ALL_AGE_CATEGORIES_PAGE_SIZE = 100

export const useAllAgeCategories = (): AgeCategory[] => {
  const { data } = useGetAgeCategories({ page: 1, count: ALL_AGE_CATEGORIES_PAGE_SIZE })
  return data ?? []
}
