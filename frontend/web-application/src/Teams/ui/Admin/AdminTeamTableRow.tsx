import { Button } from '@repo/design-system'
import { Pencil, Trash2 } from 'lucide-react'
import { useIntl } from 'react-intl'
import { Table } from '@Common/Table/Table'
import type { Team, TeamWithAgeCategoryLabel } from '../../domain/Team'

type AdminTeamTableRowProps = {
  team: TeamWithAgeCategoryLabel
  onEdit: (teamId: string) => void
  onDelete: (team: Team) => void
}

export const AdminTeamTableRow = ({ team, onEdit, onDelete }: AdminTeamTableRowProps) => {
  const intl = useIntl()

  return (
    <Table.TableRow>
      <Table.TableCell>
        {team.color ? (
          <span className="inline-block h-4 w-4 rounded-full" style={{ backgroundColor: team.color }} />
        ) : (
          '—'
        )}
      </Table.TableCell>
      <Table.TableCell className="font-medium">{team.name}</Table.TableCell>
      <Table.TableCell>{team.ageCategoryLabel ?? '—'}</Table.TableCell>
      <Table.TableCell>{team.areas?.[0]?.name ?? '—'}</Table.TableCell>
      <Table.TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label={intl.formatMessage({ id: 'adminTeams.action.edit' })}
            onPress={() => onEdit(team.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={intl.formatMessage({ id: 'adminTeams.action.delete' })}
            onPress={() => onDelete(team)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Table.TableCell>
    </Table.TableRow>
  )
}
