import { AreaDisplay } from './AreaDisplay'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TablePagination } from '@repo/design-system'
import type { Area } from '../domain/Area'
import { useAreaList } from '../application/useAreaList'
import React, { Suspense, use } from 'react'

type AreaListProps = {
  actions?: (area: Area) => React.ReactNode
}

const BaseAreaList = ({ actions }: AreaListProps) => {
  const { query, countQuery, pagination, changePage, changeRowsPerPage } = useAreaList()
  const addresses = use(query.promise)
  const count = use(countQuery.promise)

  return (
    <section className="flex h-full w-full flex-col gap-0.5">
      <Table>
        <TableHeader>
          <TableHead>Address</TableHead>
          {actions && <TableHead className="w-[50px]">Actions</TableHead>}
        </TableHeader>
        <TableBody>
          {addresses.map(address => (
            <TableRow key={address.id} id={address.id}>
              <TableCell>
                <AreaDisplay address={address} />
              </TableCell>
              {actions && <TableCell className="text-right">{actions(address)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="min-h-10">
        <TablePagination
          count={count ?? 0}
          page={pagination.page}
          onPageChange={changePage}
          rowsPerPage={pagination.rowsPerPage}
          onRowsPerPageChange={event => changeRowsPerPage(parseInt(event.target.value, 10))}
          className="w-full"
        />
      </div>
    </section>
  )
}

export const AreaList = (props: AreaListProps) => (
  <ErrorBoundary>
    <Suspense fallback={<TableLoader nbCols={2} nbRows={10} />}>
      <BaseAreaList {...props} />
    </Suspense>
  </ErrorBoundary>
)
