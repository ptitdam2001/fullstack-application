import { FormattedMessage } from 'react-intl'
import { Table, TableHeader, TableHead, TableBody } from '@repo/design-system'
import type { Season } from '../../domain/Season'
import { AdminSeasonTableRow } from './AdminSeasonTableRow'

type AdminSeasonTableProps = {
  seasons: Season[]
  onEdit: (id: string) => void
  onDelete: (season: Season) => void
}

export const AdminSeasonTable = ({ seasons, onEdit, onDelete }: AdminSeasonTableProps) => (
  <Table>
    <TableHeader>
      <TableHead>
        <FormattedMessage id="adminSeasons.table.label" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminSeasons.table.startDate" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminSeasons.table.endDate" />
      </TableHead>
      <TableHead className="w-[120px]">
        <FormattedMessage id="adminSeasons.table.actions" />
      </TableHead>
    </TableHeader>
    <TableBody
      renderEmptyState={() => (
        <div className="text-muted-foreground py-8 text-center">
          <FormattedMessage id="adminSeasons.table.empty" />
        </div>
      )}
    >
      {seasons.map(season => (
        <AdminSeasonTableRow key={season.id} season={season} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </TableBody>
  </Table>
)
