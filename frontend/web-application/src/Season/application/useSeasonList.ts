import { useTransition } from 'react'
import { usePagination } from '@Common/hooks/usePagination'
import {
  useGetSeasons,
  useGetSeasonsSuspense,
  useCountSeasons,
  useCountSeasonsSuspense,
} from '../infrastructure/useSeasonApi'

export const useSeasonList = (rowsPerPage = 20) => {
  const { changePage, ...pagination } = usePagination({ page: 0, rowsPerPage })

  const query = useGetSeasons({ page: pagination.page, count: pagination.rowsPerPage })
  const countQuery = useCountSeasons()

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, totalPages }
}

export const useSeasonListSuspense = (rowsPerPage = 20) => {
  const { changePage: rawChangePage, ...pagination } = usePagination({ page: 0, rowsPerPage })
  const [isPending, startTransition] = useTransition()
  const changePage = (page: number) => startTransition(() => rawChangePage(page))

  const query = useGetSeasonsSuspense({ page: pagination.page, count: pagination.rowsPerPage })
  const countQuery = useCountSeasonsSuspense()

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, totalPages, isPending }
}
