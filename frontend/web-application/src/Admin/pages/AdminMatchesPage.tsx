import { Suspense } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, Separator, Typography } from '@repo/design-system'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { useMatchList } from '@Match/application/useMatchList'
import { MatchFilters } from '@Match/ui/Admin/MatchFilters'

const AdminMatchesContent = () => {
  const { countQuery, filters, changeFilters } = useMatchList()
  const resultCount = (countQuery.data ?? 0) as number

  return <MatchFilters filters={filters} onChange={changeFilters} resultCount={resultCount} />
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
