import { FormattedMessage } from 'react-intl'
import { Table } from '@Common/Table/Table'
import type { Team, TeamWithAgeCategoryLabel } from '../../domain/Team'
import { AdminTeamTableRow } from './AdminTeamTableRow'

type AdminTeamTableProps = {
  teams: TeamWithAgeCategoryLabel[]
  onEdit: (teamId: string) => void
  onDelete: (team: Team) => void
}

export const AdminTeamTable = ({ teams, onEdit, onDelete }: AdminTeamTableProps) => (
  <Table.TableContainer>
    <Table.TableHeader>
      <Table.TableHead size="60px">
        <FormattedMessage id="adminTeams.table.color" />
      </Table.TableHead>
      <Table.TableHead>
        <FormattedMessage id="adminTeams.table.name" />
      </Table.TableHead>
      <Table.TableHead>
        <FormattedMessage id="adminTeams.table.ageCategory" />
      </Table.TableHead>
      <Table.TableHead>
        <FormattedMessage id="adminTeams.table.venue" />
      </Table.TableHead>
      <Table.TableHead size="120px">
        <FormattedMessage id="adminTeams.table.actions" />
      </Table.TableHead>
    </Table.TableHeader>
    <Table.TableBody>
      {teams.length === 0 ? (
        <Table.TableRow>
          <Table.TableCell colSpan={5} className="text-muted-foreground text-center py-8">
            <FormattedMessage id="adminTeams.table.empty" />
          </Table.TableCell>
        </Table.TableRow>
      ) : (
        teams.map(team => (
          <AdminTeamTableRow key={team.id} team={team} onEdit={onEdit} onDelete={onDelete} />
        ))
      )}
    </Table.TableBody>
  </Table.TableContainer>
)
