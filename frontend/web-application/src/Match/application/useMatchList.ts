import { useState } from 'react'
import { usePagination } from '@Common/hooks/usePagination'
import { useGetMatches, useCountMatches } from '../infrastructure/useMatchApi'
import type { MatchStatus } from '../domain/Match'

export type MatchListFilters = {
  championshipId?: string
  ageCategoryId?: string
  status?: MatchStatus
}

export const useMatchList = (rowsPerPage = 20) => {
  const { changePage, ...pagination } = usePagination({ page: 0, rowsPerPage })
  const [filters, setFilters] = useState<MatchListFilters>({})

  const changeFilters = (next: MatchListFilters) => {
    setFilters(next)
    changePage(0)
  }

  const query = useGetMatches({ page: pagination.page, count: pagination.rowsPerPage, ...filters })
  const countQuery = useCountMatches(filters)

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, filters, changeFilters, totalPages }
}
