import { usePagination } from '@Common/hooks/usePagination'
import { useGetGames, useCountAllGames } from '../infrastructure/useGameApi'

export const useGameList = () => {
  const { changePage, changeRowsPerPage, ...pagination } = usePagination()
  const query = useGetGames({ page: pagination.page, limit: pagination.rowsPerPage })
  const countQuery = useCountAllGames()
  return { query, countQuery, pagination, changePage, changeRowsPerPage }
}
