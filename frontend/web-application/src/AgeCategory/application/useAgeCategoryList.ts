import { usePagination } from '@Common/hooks/usePagination'
import { useGetAgeCategories, useCountAgeCategories } from '../infrastructure/useAgeCategoryApi'

export const useAgeCategoryList = (rowsPerPage = 20) => {
  const { changePage, ...pagination } = usePagination({ page: 0, rowsPerPage })

  const query = useGetAgeCategories({ page: pagination.page, count: pagination.rowsPerPage })
  const countQuery = useCountAgeCategories()

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, totalPages }
}
