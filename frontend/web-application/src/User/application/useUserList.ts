import { useState, useTransition } from 'react'
import { usePagination } from '@Common/hooks/usePagination'
import { useGetUsersSuspense, useCountUsersSuspense } from '../infrastructure/useUserApi'
import type { UserListFilters } from '../domain/User'

// GET /users paginates only when page/count are sent (the dashboard relies on the unpaginated list),
// so this hook always sends both.
export const useUserListSuspense = (rowsPerPage = 20) => {
  const { changePage: rawChangePage, ...pagination } = usePagination({ page: 0, rowsPerPage })
  const [filters, setFilters] = useState<UserListFilters>({})
  const [isPending, startTransition] = useTransition()

  const changePage = (page: number) => startTransition(() => rawChangePage(page))

  const changeFilters = (next: UserListFilters) =>
    startTransition(() => {
      setFilters(next)
      rawChangePage(0)
    })

  const query = useGetUsersSuspense({ page: pagination.page + 1, count: pagination.rowsPerPage, ...filters })
  const countQuery = useCountUsersSuspense(filters)

  const totalPages = Math.ceil(countQuery.data / rowsPerPage)

  return { query, countQuery, pagination, changePage, filters, changeFilters, totalPages, isPending }
}
