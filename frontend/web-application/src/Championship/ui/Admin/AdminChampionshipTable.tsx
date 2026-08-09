import { FormattedMessage } from 'react-intl'
import { Table, TableHeader, TableHead, TableBody } from '@repo/design-system'
import { AdminChampionshipTableRow } from './AdminChampionshipTableRow'

export type ChampionshipRow = {
  id: string
  name: string
  seasonLabel: string | null
  categoryLabel: string | null
}

type AdminChampionshipTableProps = {
  championships: ChampionshipRow[]
}

export const AdminChampionshipTable = ({ championships }: AdminChampionshipTableProps) => (
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
    </TableHeader>
    <TableBody
      renderEmptyState={() => (
        <div className="text-muted-foreground py-8 text-center">
          <FormattedMessage id="adminChampionships.table.empty" />
        </div>
      )}
    >
      {championships.map(championship => (
        <AdminChampionshipTableRow key={championship.id} championship={championship} />
      ))}
    </TableBody>
  </Table>
)
