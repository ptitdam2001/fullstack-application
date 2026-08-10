import { Button, TableRow, TableCell } from '@repo/design-system'
import { RotateCcw } from 'lucide-react'
import { useIntl } from 'react-intl'
import type { ChampionshipRow } from './AdminChampionshipTable'

type AdminChampionshipTableRowProps = {
  championship: ChampionshipRow
  onResume: (id: string) => void
}

export const AdminChampionshipTableRow = ({ championship, onResume }: AdminChampionshipTableRowProps) => {
  const intl = useIntl()

  return (
    <TableRow id={championship.id}>
      <TableCell className="font-medium">{championship.name}</TableCell>
      <TableCell>{championship.seasonLabel ?? <span className="text-muted-foreground">—</span>}</TableCell>
      <TableCell>{championship.categoryLabel ?? <span className="text-muted-foreground">—</span>}</TableCell>
      <TableCell className="text-right">
        {championship.isDraft && (
          <Button
            variant="outline"
            size="icon"
            aria-label={intl.formatMessage({ id: 'adminChampionships.action.resume' })}
            onPress={() => onResume(championship.id)}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
