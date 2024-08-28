import { ReactElement } from 'react'

export type TableCol<T> = {
  key: string
  label: string
  render?: (line: T) => ReactElement
}

export type TableRowAction<T> = {
  icon?: ReactElement
  label?: string
  onClick: (item: T) => void
  disable?: boolean | ((item: T) => boolean)
}

export type TablePaginationProps = {
  currentPage: number
  maxPage: number
  onClick: (pageNumber: number) => void
}
