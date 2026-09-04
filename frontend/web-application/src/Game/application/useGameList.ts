import { useTransition } from 'react'
import { usePagination } from '@Common/hooks/usePagination'
import { useGetGamesSuspense, useCountAllGamesSuspense } from '../infrastructure/useGameApi'

export const useGameList = () => {
  const { changePage: rawChangePage, changeRowsPerPage: rawChangeRowsPerPage, ...pagination } = usePagination()
  const [isPending, startTransition] = useTransition()
  const changePage = (page: number) => startTransition(() => rawChangePage(page))
  const changeRowsPerPage = (rowsPerPage: number) => startTransition(() => rawChangeRowsPerPage(rowsPerPage))

  const query = useGetGamesSuspense({ page: pagination.page, limit: pagination.rowsPerPage })
  const countQuery = useCountAllGamesSuspense()
  return { query, countQuery, pagination, changePage, changeRowsPerPage, isPending }
}
