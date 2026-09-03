import { Suspense, use, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, Separator, TablePagination, Typography } from '@repo/design-system'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { useMatchList } from '@Match/application/useMatchList'
import { useMatchDelete } from '@Match/application/useMatchDelete'
import { MatchFilters } from '@Match/ui/Admin/MatchFilters'
import { MatchCardGrid } from '@Match/ui/Admin/MatchCardGrid'
import { ScoreEntryDialog } from '@Match/ui/Admin/ScoreEntryDialog'
import { DeleteMatchDialog } from '@Match/ui/Admin/DeleteMatchDialog'
import type { Match } from '@Match/domain/Match'

const AdminMatchesContent = () => {
  const { query, countQuery, filters, changeFilters, pagination, changePage } = useMatchList()
  const matches = use(query.promise)
  const resultCount = (countQuery.data ?? 0) as number
  const [matchForScore, setMatchForScore] = useState<Match | null>(null)
  const [matchForDelete, setMatchForDelete] = useState<Match | null>(null)
  const { deleteMatch, isPending: isDeleting } = useMatchDelete()

  const handleConfirmDelete = async () => {
    if (!matchForDelete) {
      return
    }
    await deleteMatch(matchForDelete.id)
    setMatchForDelete(null)
  }

  return (
    <section className="flex h-full w-full flex-col gap-0.5">
      <MatchFilters filters={filters} onChange={changeFilters} resultCount={resultCount} />
      <MatchCardGrid matches={matches as Match[]} onScoreClick={setMatchForScore} onDeleteClick={setMatchForDelete} />
      <div className="min-h-10">
        <TablePagination
          count={resultCount}
          page={pagination.page}
          onPageChange={changePage}
          rowsPerPage={pagination.rowsPerPage}
          className="w-full"
        />
      </div>
      {matchForScore && (
        <ScoreEntryDialog
          match={matchForScore}
          open
          onOpenChange={open => {
            if (!open) {
              setMatchForScore(null)
            }
          }}
          onFinish={() => setMatchForScore(null)}
        />
      )}
      {matchForDelete && (
        <DeleteMatchDialog
          match={matchForDelete}
          open
          onOpenChange={open => {
            if (!open) {
              setMatchForDelete(null)
            }
          }}
          onConfirm={handleConfirmDelete}
          isPending={isDeleting}
        />
      )}
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
