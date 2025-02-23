import { useReducer } from "react"

type PaginationState = {
  page: number
  rowsPerPage: number
}

const paginationReducer = (state: PaginationState, action: Partial<PaginationState>): PaginationState => {
  return { ...state, ...action }
}

export const usePagination = (defaultValue: PaginationState = { page: 0, rowsPerPage: 10 }) => {
  const [pagination, dispatchPagination] = useReducer(paginationReducer, defaultValue)

  return {
    ...pagination,
    changePage: (newPage: number) => dispatchPagination({ page: newPage }),
    changeRowsPerPage: (newValue: number) => dispatchPagination({ rowsPerPage: newValue, page: 0 }),
 }
}
