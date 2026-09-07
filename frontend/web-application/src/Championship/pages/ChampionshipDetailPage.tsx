import { Suspense, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Layout } from '@repo/design-system'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { NotFound } from '@Common/NotFound'
import { useSeasonListSuspense } from '@Season/application/useSeasonList'
import { useAgeCategoryListSuspense } from '@AgeCategory/application/useAgeCategoryList'
import { useChampionshipDetail } from '../application/useChampionshipDetail'
import { usePhaseList } from '../application/usePhaseList'
import { usePhaseGroups } from '../application/usePhaseGroups'
import { useGroupStandings } from '../application/useGroupStandings'
import { useChampionshipMatches } from '../application/useChampionshipMatches'
import { useTeamLookup } from '../application/useTeamLookup'
import { ChampionshipHeader } from '../ui/ChampionshipHeader/ChampionshipHeader'
import { PhaseTabs } from '../ui/PhaseTabs/PhaseTabs'
import { PoolSelector } from '../ui/PoolSelector/PoolSelector'
import { StandingsTable } from '../ui/StandingsTable/StandingsTable'
import { MatchesPanel, type MatchesFilter } from '../ui/MatchesPanel/MatchesPanel'
import { KnockoutPlaceholder } from '../ui/KnockoutPlaceholder/KnockoutPlaceholder'
import { PhaseType, type Phase } from '../domain/Phase'
import type { Group } from '../domain/Group'
import { MatchStatus } from '../domain/Match'

type GroupPhasePoolsProps = { championshipId: string; phase: Phase; groups: Group[] }

const GroupPhasePools = ({ championshipId, phase, groups }: GroupPhasePoolsProps) => {
  const navigate = useNavigate()
  const [poolId, setPoolId] = useState(groups[0].id)
  const pool = groups.find(group => group.id === poolId) ?? groups[0]
  const { data: standings } = useGroupStandings(pool.id)
  const teams = useTeamLookup()
  const { data: allMatches } = useChampionshipMatches(championshipId)
  const [filter, setFilter] = useState<MatchesFilter>('all')

  const filteredMatches = allMatches
    .filter(match => match.groupId === pool.id)
    .filter(match => {
      if (filter === 'all') {
        return true
      }
      if (filter === 'played') {
        return match.status !== MatchStatus.SCHEDULED
      }
      return match.status === filter
    })

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_400px]">
      <div className="flex flex-col gap-2">
        <PoolSelector pools={groups} value={pool.id} onValueChange={setPoolId} />
        <StandingsTable rows={standings.rows} teams={teams} qualifyRank={phase.qualification?.maxRank ?? 0} />
      </div>
      <MatchesPanel
        matches={filteredMatches}
        filter={filter}
        onFilterChange={setFilter}
        onViewAll={() => navigate('/app/admin/matches')}
      />
    </div>
  )
}

const GroupPhaseContent = ({ championshipId, phase }: { championshipId: string; phase: Phase }) => {
  const { data: groups } = usePhaseGroups(phase.id)

  if (groups.length === 0) {
    return (
      <div className="text-muted-foreground py-16 text-center text-sm">
        <FormattedMessage id="championshipDetail.standings.empty" />
      </div>
    )
  }

  return <GroupPhasePools championshipId={championshipId} phase={phase} groups={groups} />
}

const ChampionshipDetailContent = ({ championshipId }: { championshipId: string }) => {
  const { data: championship } = useChampionshipDetail(championshipId)
  const { data: phases } = usePhaseList(championshipId)
  const { query: seasonQuery } = useSeasonListSuspense()
  const { query: categoryQuery } = useAgeCategoryListSuspense()
  const seasons = seasonQuery.data
  const categories = categoryQuery.data

  const [phaseId, setPhaseId] = useState(phases[0]?.id)
  const phase = phases.find(p => p.id === phaseId) ?? phases[0]

  const seasonLabel = seasons.find(season => season.id === championship.seasonId)?.label ?? null
  const categoryLabel = categories.find(category => category.id === championship.ageCategoryId)?.label ?? null

  return (
    <div className="flex flex-col gap-4 p-4">
      <ChampionshipHeader
        championship={championship}
        seasonLabel={seasonLabel}
        categoryLabel={categoryLabel}
        phasesCount={phases.length}
      />
      {phase && (
        <>
          <PhaseTabs phases={phases} value={phase.id} onValueChange={setPhaseId} />
          <Suspense fallback={<TableLoader nbCols={3} nbRows={6} />} key={phase.id}>
            {phase.type === PhaseType.GROUP ? (
              <GroupPhaseContent championshipId={championshipId} phase={phase} />
            ) : (
              <KnockoutPlaceholder />
            )}
          </Suspense>
        </>
      )}
    </div>
  )
}

export const ChampionshipDetailPage = () => {
  const { championshipId } = useParams()

  if (!championshipId) {
    return <NotFound />
  }

  return (
    <Layout.Root>
      <Layout.Content>
        <ErrorBoundary>
          <Suspense fallback={<TableLoader nbCols={3} nbRows={10} />}>
            <ChampionshipDetailContent championshipId={championshipId} />
          </Suspense>
        </ErrorBoundary>
      </Layout.Content>
    </Layout.Root>
  )
}
