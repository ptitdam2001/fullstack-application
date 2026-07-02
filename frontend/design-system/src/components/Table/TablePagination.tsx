import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '../../utils/cn'
import { Button } from '../Button/Button'

type TablePaginationProps = {
  count: number
  page: number
  onPageChange: (newPage: number) => void
  rowsPerPage: number
  rowsPerPageOptions?: ReadonlyArray<number>
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  className?: string
}

export const TablePagination = ({
  className,
  count,
  page,
  onPageChange,
  rowsPerPage,
  rowsPerPageOptions = [10, 25, 50, 100],
  onRowsPerPageChange,
}: TablePaginationProps) => (
  <div data-slot="table-pagination" className={cn('flex items-center justify-between p-4', className)}>
    <Button variant="outline" size="icon" onPress={() => onPageChange(page - 1)} isDisabled={page === 0}>
      <ChevronLeft />
    </Button>
    <select onChange={onRowsPerPageChange} value={rowsPerPage} className="rounded border p-2 text-sm">
      {rowsPerPageOptions.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
    <span className="text-sm">
      {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, count)} / {count}
    </span>
    <Button
      variant="outline"
      size="icon"
      onPress={() => onPageChange(page + 1)}
      isDisabled={page >= Math.ceil(count / rowsPerPage) - 1}
    >
      <ChevronRight />
    </Button>
  </div>
)
