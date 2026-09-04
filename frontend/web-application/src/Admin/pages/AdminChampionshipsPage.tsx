import { Suspense } from 'react'
import { useNavigate } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button, Layout, Separator, TablePagination, Typography } from '@repo/design-system'
import { CirclePlus } from 'lucide-react'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { useChampionshipListSuspense } from '@Championship/application/useChampionshipList'
import { useSeasonList } from '@Season/application/useSeasonList'
import { useAgeCategoryList } from '@AgeCategory/application/useAgeCategoryList'
import { AdminChampionshipTable, type ChampionshipRow } from '@Championship/ui/Admin/AdminChampionshipTable'

const AdminChampionshipListContent = () => {
  const { query, countQuery, pagination, changePage } = useChampionshipListSuspense(25)
  const championships = query.data
  const count = countQuery.data

  const seasonList = useSeasonList()
  const categoryList = useAgeCategoryList()
  const seasons = seasonList.query.data ?? []
  const categories = categoryList.query.data ?? []

  const navigate = useNavigate()

  const rows: ChampionshipRow[] = championships.map(championship => ({
    id: championship.id,
    name: championship.name ?? '',
    seasonLabel: seasons.find(s => s.id === championship.seasonId)?.label ?? null,
    categoryLabel: categories.find(c => c.id === championship.ageCategoryId)?.label ?? null,
    isDraft: championship.isDraft,
    isFinished: championship.isFinished,
    startDate: championship.startDate ?? null,
    endDate: championship.endDate ?? null,
    currentPhaseType: championship.currentPhaseType,
    teamsCount: championship.teamsCount,
    matchesPlayed: championship.matchesPlayed,
    matchesTotal: championship.matchesTotal,
  }))

  return (
    <section className="flex h-full w-full flex-col gap-0.5">
      <AdminChampionshipTable championships={rows} onResume={id => navigate(`new/${id}`)} />
      <div className="min-h-10">
        <TablePagination
          count={(count ?? 0) as number}
          page={pagination.page}
          onPageChange={changePage}
          rowsPerPage={pagination.rowsPerPage}
          className="w-full"
        />
      </div>
    </section>
  )
}

export const AdminChampionshipsPage = () => {
  const navigate = useNavigate()

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between px-4 py-2">
          <Typography.Title1>
            <FormattedMessage id="adminChampionships.title" />
          </Typography.Title1>
          <Button variant="outline" size="sm" onPress={() => navigate('new')}>
            <CirclePlus className="h-4 w-4" />
            <FormattedMessage id="adminChampionships.action.create" />
          </Button>
        </div>
        <Separator orientation="horizontal" />
      </Layout.Header>
      <Layout.Content>
        <ErrorBoundary>
          <Suspense fallback={<TableLoader nbCols={3} nbRows={10} />}>
            <AdminChampionshipListContent />
          </Suspense>
        </ErrorBoundary>
      </Layout.Content>
    </Layout.Root>
  )
}
