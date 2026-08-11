import { FormattedMessage } from 'react-intl'
import { Table, TableHeader, TableHead, TableBody } from '@repo/design-system'
import { AdminChampionshipTableRow } from './AdminChampionshipTableRow'
import type { PhaseType } from '@Championship/domain/Phase'

export type ChampionshipRow = {
  id: string
  name: string
  seasonLabel: string | null
  categoryLabel: string | null
  isDraft: boolean
  isFinished: boolean
  startDate: string | null
  endDate: string | null
  currentPhaseType: PhaseType | null
  teamsCount: number
  matchesPlayed: number
  matchesTotal: number
}

type AdminChampionshipTableProps = {
  championships: ChampionshipRow[]
  onResume: (id: string) => void
}

export const AdminChampionshipTable = ({ championships, onResume }: AdminChampionshipTableProps) => (
  <Table>
    <TableHeader>
      <TableHead>
        <FormattedMessage id="adminChampionships.table.name" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminChampionships.table.season" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminChampionships.table.category" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminChampionships.table.status" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminChampionships.table.dates" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminChampionships.table.phase" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminChampionships.table.teams" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminChampionships.table.progress" />
      </TableHead>
      <TableHead className="w-[120px]">
        <FormattedMessage id="adminChampionships.table.actions" />
      </TableHead>
    </TableHeader>
    <TableBody
      renderEmptyState={() => (
        <div className="text-muted-foreground py-8 text-center">
          <FormattedMessage id="adminChampionships.table.empty" />
        </div>
      )}
    >
      {championships.map(championship => (
        <AdminChampionshipTableRow key={championship.id} championship={championship} onResume={onResume} />
      ))}
    </TableBody>
  </Table>
)
