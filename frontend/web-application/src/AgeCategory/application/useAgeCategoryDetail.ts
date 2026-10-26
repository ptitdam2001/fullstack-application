import { useGetAgeCategory } from '../infrastructure/useAgeCategoryApi'

export const useAgeCategoryDetail = (ageCategoryId: string) => useGetAgeCategory(ageCategoryId)
