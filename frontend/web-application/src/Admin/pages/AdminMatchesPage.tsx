import { Suspense, use } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, Separator, TablePagination, Typography } from '@repo/design-system'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { useMatchList } from '@Match/application/useMatchList'
import { MatchFilters } from '@Match/ui/Admin/MatchFilters'
import { MatchCardGrid } from '@Match/ui/Admin/MatchCardGrid'
import type { Match } from '@Match/domain/Match'

const handleScoreClick = (_match: Match) => {}
const handleDeleteClick = (_match: Match) => {}

const AdminMatchesContent = () => {
  const { query, countQuery, filters, changeFilters, pagination, changePage } = useMatchList()
  const matches = use(query.promise)
  const resultCount = (countQuery.data ?? 0) as number

  return (
    <section className="flex h-full w-full flex-col gap-0.5">
      <MatchFilters filters={filters} onChange={changeFilters} resultCount={resultCount} />
      <MatchCardGrid matches={matches as Match[]} onScoreClick={handleScoreClick} onDeleteClick={handleDeleteClick} />
      <div className="min-h-10">
        <TablePagination
          count={resultCount}
          page={pagination.page}
          onPageChange={changePage}
          rowsPerPage={pagination.rowsPerPage}
          className="w-full"
        />
      </div>
    </section>
  )
}

export const AdminMatchesPage = () => (
  <Layout.Root>
    <Layout.Header>
      <div className="flex items-center justify-between px-4 py-2">
        <Typography.Title1>
          <FormattedMessage id="adminMatches.title" />
        </Typography.Title1>
      </div>
      <Separator orientation="horizontal" />
    </Layout.Header>
    <Layout.Content>
      <ErrorBoundary>
        <Suspense fallback={<TableLoader nbCols={3} nbRows={10} />}>
          <AdminMatchesContent />
        </Suspense>
      </ErrorBoundary>
    </Layout.Content>
  </Layout.Root>
)
