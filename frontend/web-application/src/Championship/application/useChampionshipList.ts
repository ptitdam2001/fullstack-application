import { usePagination } from '@Common/hooks/usePagination'
import { useGetChampionships, useCountChampionships } from '../infrastructure/useChampionshipApi'

export const useChampionshipList = (rowsPerPage = 20) => {
  const { changePage, ...pagination } = usePagination({ page: 0, rowsPerPage })

  const query = useGetChampionships({ page: pagination.page, count: pagination.rowsPerPage })
  const countQuery = useCountChampionships()

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, totalPages }
}
