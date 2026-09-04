import { useTransition } from 'react'
import { usePagination } from '@Common/hooks/usePagination'
import { useGetAreaListSuspense, useCountAllAreasSuspense } from '../infrastructure/useAreaApi'

export const useAreaList = () => {
  const { changePage: rawChangePage, changeRowsPerPage: rawChangeRowsPerPage, ...pagination } = usePagination()
  const [isPending, startTransition] = useTransition()
  const changePage = (page: number) => startTransition(() => rawChangePage(page))
  const changeRowsPerPage = (rowsPerPage: number) => startTransition(() => rawChangeRowsPerPage(rowsPerPage))

  const query = useGetAreaListSuspense({ page: pagination.page, limit: pagination.rowsPerPage })
  const countQuery = useCountAllAreasSuspense()
  return { query, countQuery, pagination, changePage, changeRowsPerPage, isPending }
}
