import { useTransition } from 'react'
import { usePagination } from '@Common/hooks/usePagination'
import {
  useGetAgeCategories,
  useGetAgeCategoriesSuspense,
  useCountAgeCategories,
  useCountAgeCategoriesSuspense,
} from '../infrastructure/useAgeCategoryApi'

export const useAgeCategoryList = (rowsPerPage = 20) => {
  const { changePage, ...pagination } = usePagination({ page: 0, rowsPerPage })

  const query = useGetAgeCategories({ page: pagination.page, count: pagination.rowsPerPage })
  const countQuery = useCountAgeCategories()

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, totalPages }
}

export const useAgeCategoryListSuspense = (rowsPerPage = 20) => {
  const { changePage: rawChangePage, ...pagination } = usePagination({ page: 0, rowsPerPage })
  const [isPending, startTransition] = useTransition()
  const changePage = (page: number) => startTransition(() => rawChangePage(page))

  const query = useGetAgeCategoriesSuspense({ page: pagination.page, count: pagination.rowsPerPage })
  const countQuery = useCountAgeCategoriesSuspense()

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, totalPages, isPending }
}
