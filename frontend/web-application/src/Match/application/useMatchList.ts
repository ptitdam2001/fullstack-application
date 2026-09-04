import { useState, useTransition } from 'react'
import { usePagination } from '@Common/hooks/usePagination'
import { useGetMatchesSuspense, useCountMatches } from '../infrastructure/useMatchApi'
import type { MatchStatus } from '../domain/Match'

export type MatchListFilters = {
  championshipId?: string
  ageCategoryId?: string
  status?: MatchStatus
}

export const useMatchList = (rowsPerPage = 20) => {
  const { changePage: rawChangePage, ...pagination } = usePagination({ page: 0, rowsPerPage })
  const [filters, setFilters] = useState<MatchListFilters>({})
  const [isPending, startTransition] = useTransition()

  const changePage = (page: number) => startTransition(() => rawChangePage(page))

  const changeFilters = (next: MatchListFilters) =>
    startTransition(() => {
      setFilters(next)
      rawChangePage(0)
    })

  const query = useGetMatchesSuspense({ page: pagination.page, count: pagination.rowsPerPage, ...filters })
  const countQuery = useCountMatches(filters)

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, filters, changeFilters, totalPages, isPending }
}
