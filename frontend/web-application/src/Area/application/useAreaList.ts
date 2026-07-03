import { usePagination } from '@Common/hooks/usePagination'
import { useGetAreaList, useCountAllAreas } from '../infrastructure/useAreaApi'

export const useAreaList = () => {
  const { changePage, changeRowsPerPage, ...pagination } = usePagination()
  const query = useGetAreaList({ page: pagination.page, limit: pagination.rowsPerPage })
  const countQuery = useCountAllAreas()
  return { query, countQuery, pagination, changePage, changeRowsPerPage }
}
