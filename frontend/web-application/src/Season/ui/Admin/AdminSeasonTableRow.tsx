import { Button, TableRow, TableCell } from '@repo/design-system'
import { Pencil, Trash2 } from 'lucide-react'
import { useIntl } from 'react-intl'
import type { Season } from '../../domain/Season'

type AdminSeasonTableRowProps = {
  season: Season
  onEdit: (id: string) => void
  onDelete: (season: Season) => void
}

const formatDate = (date: string | null | undefined, locale: string) =>
  date ? new Date(date).toLocaleDateString(locale) : '—'

export const AdminSeasonTableRow = ({ season, onEdit, onDelete }: AdminSeasonTableRowProps) => {
  const intl = useIntl()

  return (
    <TableRow id={season.id}>
      <TableCell className="font-medium">{season.label}</TableCell>
      <TableCell>{formatDate(season.startDate, intl.locale)}</TableCell>
      <TableCell>{formatDate(season.endDate, intl.locale)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label={intl.formatMessage({ id: 'adminSeasons.action.edit' })}
            onPress={() => onEdit(season.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={intl.formatMessage({ id: 'adminSeasons.action.delete' })}
            onPress={() => onDelete(season)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
