import { ReactElement } from 'react'
import { TablePagination } from './Pagination'
import { TableCol, TablePaginationProps, TableRowAction } from './types'
import { RowActions } from './RowActions'
import { TableCell, TableCellHeader, TableContainer, TableTitle } from './styledComponent'
import { TableHead } from './TableHead'
import { WithDataTestIdProps, WithDesignProps } from '../../types'
import classNames from 'classnames'

type TableProps<T> = {
  columns: TableCol<T>[]
  data: T[]
  title?: string | ReactElement
  rowActions?: TableRowAction<T>[]
  pagination?: TablePaginationProps
  withBorder?: boolean
} & WithDesignProps &
  WithDataTestIdProps

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const Table = <T extends { [k: string]: any }>({
  columns,
  data,
  title,
  rowActions,
  pagination,
  className,
  withBorder = false,
  'data-testid': testId,
}: TableProps<T>) => (
  <TableContainer className={classNames(className, { 'rounded-lg shadow': withBorder })} data-testid={testId}>
    {title && <TableTitle data-testid={testId && `${testId}--title`}>{title}</TableTitle>}
    <table className="min-w-full leading-normal">
      <TableHead data-testid={testId && `${testId}--head`}>
        {columns.map(column => (
          <TableCellHeader id={`col-${column.key}`} scope="col" key={`header-col-${column.key}`}>
            {column.label}
          </TableCellHeader>
        ))}

        <TableCellHeader scope="col" />
      </TableHead>

      <tbody>
        {data.map((line, index) => (
          <tr key={`body-row-${index}`} data-testid={testId && `${testId}--line`}>
            {columns.map(({ key, render }, colIndex) => (
              <TableCell key={`body-row-${index}-col-${colIndex}`}>
                {line[key] ? render?.(line) || <p className="text-gray-900 whitespace-no-wrap">{line[key]}</p> : null}
              </TableCell>
            ))}
            {/* Actions */}
            <TableCell key={`row-action-${index}`}>
              {rowActions && <RowActions<T> row={line} rowActions={rowActions} />}
            </TableCell>
          </tr>
        ))}
      </tbody>
    </table>
    {pagination && <TablePagination {...pagination} data-testid={testId && `${testId}--pagination`} />}
  </TableContainer>
)

export default Table
