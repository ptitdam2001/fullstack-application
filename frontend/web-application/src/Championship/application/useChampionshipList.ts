import { useTransition } from 'react'
import { usePagination } from '@Common/hooks/usePagination'
import {
  useGetChampionships,
  useGetChampionshipsSuspense,
  useCountChampionships,
  useCountChampionshipsSuspense,
} from '../infrastructure/useChampionshipApi'

export const useChampionshipList = (rowsPerPage = 20) => {
  const { changePage, ...pagination } = usePagination({ page: 0, rowsPerPage })

  const query = useGetChampionships({ page: pagination.page, count: pagination.rowsPerPage })
  const countQuery = useCountChampionships()

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, totalPages }
}

export const useChampionshipListSuspense = (rowsPerPage = 20) => {
  const { changePage: rawChangePage, ...pagination } = usePagination({ page: 0, rowsPerPage })
  const [isPending, startTransition] = useTransition()
  const changePage = (page: number) => startTransition(() => rawChangePage(page))

  const query = useGetChampionshipsSuspense({ page: pagination.page, count: pagination.rowsPerPage })
  const countQuery = useCountChampionshipsSuspense()

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, totalPages, isPending }
}
