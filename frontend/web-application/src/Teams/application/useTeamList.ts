import { usePagination } from '@Common/hooks/usePagination'
import { useGetTeams, useCountTeams } from '../infrastructure/useTeamApi'

export const useTeamList = (rowsPerPage = 12) => {
  const { changePage, ...pagination } = usePagination({ page: 0, rowsPerPage })

  const query = useGetTeams({ page: pagination.page, limit: pagination.rowsPerPage })
  const countQuery = useCountTeams()

  const totalPages = Math.ceil(((countQuery.data ?? 0) as number) / rowsPerPage)

  return { query, countQuery, pagination, changePage, totalPages }
}
