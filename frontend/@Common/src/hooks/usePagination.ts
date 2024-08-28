import { useMemo, useState } from 'react'

export const usePagination = (onChangePage: (page: number) => void) => {
  const [current, setCurrent] = useState<number>(1)

  return useMemo(
    () => ({
      currentPage: current,
      gotoPage: (page: number) => {
        setCurrent(page)
        onChangePage(page)
      },
    }),
    [current, onChangePage, setCurrent]
  )
}
