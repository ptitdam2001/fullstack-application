import { FormattedMessage, useIntl } from 'react-intl'
import { Table, TableHeader, TableHead, TableBody } from '@repo/design-system'
import type { Team, TeamWithAgeCategoryLabel } from '../../domain/Team'
import { AdminTeamTableRow } from './AdminTeamTableRow'

type AdminTeamTableProps = {
  teams: TeamWithAgeCategoryLabel[]
  onEdit: (teamId: string) => void
  onDelete: (team: Team) => void
}

export const AdminTeamTable = ({ teams, onEdit, onDelete }: AdminTeamTableProps) => {
  const intl = useIntl()
  return (
    <Table aria-label={intl.formatMessage({ id: 'adminTeams.title' })}>
      <TableHeader>
        <TableHead className="w-[60px]">
          <FormattedMessage id="adminTeams.table.color" />
        </TableHead>
        <TableHead isRowHeader>
          <FormattedMessage id="adminTeams.table.name" />
        </TableHead>
        <TableHead>
          <FormattedMessage id="adminTeams.table.ageCategory" />
        </TableHead>
        <TableHead>
          <FormattedMessage id="adminTeams.table.venue" />
        </TableHead>
        <TableHead className="w-[120px]">
          <FormattedMessage id="adminTeams.table.actions" />
        </TableHead>
      </TableHeader>
      <TableBody
        renderEmptyState={() => (
          <div className="text-muted-foreground py-8 text-center">
            <FormattedMessage id="adminTeams.table.empty" />
          </div>
        )}
      >
        {teams.map(team => (
          <AdminTeamTableRow key={team.id} team={team} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </TableBody>
    </Table>
  )
}
