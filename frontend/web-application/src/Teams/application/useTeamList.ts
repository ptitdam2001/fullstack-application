import { useTransition } from 'react'
import { usePagination } from '@Common/hooks/usePagination'
import { useGetTeamsSuspense, useCountTeamsSuspense } from '../infrastructure/useTeamApi'

export const useTeamList = (rowsPerPage = 12) => {
  const { changePage: rawChangePage, ...pagination } = usePagination({ page: 0, rowsPerPage })
  const [isPending, startTransition] = useTransition()
  const changePage = (page: number) => startTransition(() => rawChangePage(page))

  const query = useGetTeamsSuspense({ page: pagination.page, limit: pagination.rowsPerPage })
  const countQuery = useCountTeamsSuspense()

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, totalPages, isPending }
}
