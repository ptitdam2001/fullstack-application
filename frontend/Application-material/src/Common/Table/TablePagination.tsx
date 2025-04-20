import { Button } from '@/components/ui/button'
import { className as cn } from '@Common/utils/className'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type TablePaginationProps = {
  /**
   * The number of rows in the table.
   */
  count: number
  /**
   * The zero-based index of the current page.
   */
  page: number
  /**
   * Callback fired when the page is changed.
   */
  onPageChange: (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void
  /**
   * The number of rows per page.
   *
   * Set -1 to display all the rows.
   */
  rowsPerPage: number
  /**
   * Customizes the options of the rows per page select field. If less than two options are
   * available, no select field will be displayed.
   * Use -1 for the value with a custom label to show all the rows.
   * @default [10, 25, 50, 100]
   */
  rowsPerPageOptions?: ReadonlyArray<
    | number
    | {
        value: number
        label: string
      }
  >

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
  <div className={cn('flex items-center justify-between p-4 max-w-sm', className)}>
    <Button variant="outline" size="icon" onClick={evt => onPageChange?.(evt, page - 1)} disabled={page === 0}>
      <ChevronLeft />
    </Button>
    <select onChange={onRowsPerPageChange} value={rowsPerPage} className="border rounded p-2">
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
      onClick={evt => onPageChange?.(evt, page + 1)}
      disabled={page >= Math.ceil(count / rowsPerPage) - 1}
    >
      <ChevronRight />
    </Button>
  </div>
)
