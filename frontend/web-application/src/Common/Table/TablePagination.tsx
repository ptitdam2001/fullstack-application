import { Button } from '@repo/design-system'
import { cn } from '@repo/design-system'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type TablePaginationProps = {
  /** Total number of rows. */
  count: number
  /** Zero-based index of the current page. */
  page: number
  /** Called when the user navigates to a new page. */
  onPageChange: (newPage: number) => void
  /** Number of rows per page. Use -1 to show all rows. */
  rowsPerPage: number
  /** Options for the rows-per-page selector. @default [10, 25, 50, 100] */
  rowsPerPageOptions?: ReadonlyArray<number | { value: number; label: string }>
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  className?: string
}

export const TablePagination: React.FunctionComponent<TablePaginationProps> = ({
  className,
  count,
  page,
  onPageChange,
  rowsPerPage,
  rowsPerPageOptions = [10, 25, 50, 100],
  onRowsPerPageChange,
}) => (
  <div className={cn('flex max-w-sm items-center justify-between p-4', className)}>
    <Button variant="outline" size="icon" onPress={() => onPageChange(page - 1)} isDisabled={page === 0}>
      <ChevronLeft />
    </Button>
    <select onChange={onRowsPerPageChange} value={rowsPerPage} className="rounded border p-2">
      {rowsPerPageOptions.map((option, index) => {
        if (typeof option === 'number') {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          )
        } else {
          return (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          )
        }
      })}
    </select>
    <span>
      {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, count)} of {count}
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
