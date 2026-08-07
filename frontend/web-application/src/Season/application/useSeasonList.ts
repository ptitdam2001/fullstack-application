import { usePagination } from '@Common/hooks/usePagination'
import { useGetSeasons, useCountSeasons } from '../infrastructure/useSeasonApi'

export const useSeasonList = (rowsPerPage = 20) => {
  const { changePage, ...pagination } = usePagination({ page: 0, rowsPerPage })

  const query = useGetSeasons({ page: pagination.page, count: pagination.rowsPerPage })
  const countQuery = useCountSeasons()

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, totalPages }
}
