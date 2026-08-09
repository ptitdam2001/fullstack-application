import { TableRow, TableCell } from '@repo/design-system'
import type { ChampionshipRow } from './AdminChampionshipTable'

type AdminChampionshipTableRowProps = {
  championship: ChampionshipRow
}

export const AdminChampionshipTableRow = ({ championship }: AdminChampionshipTableRowProps) => (
  <TableRow id={championship.id}>
    <TableCell className="font-medium">{championship.name}</TableCell>
    <TableCell>{championship.seasonLabel ?? <span className="text-muted-foreground">—</span>}</TableCell>
    <TableCell>{championship.categoryLabel ?? <span className="text-muted-foreground">—</span>}</TableCell>
  </TableRow>
)
