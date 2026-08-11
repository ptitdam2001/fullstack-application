import { Button, TableRow, TableCell, Tooltip } from '@repo/design-system'
import { BookCheck } from 'lucide-react'
import { useIntl } from 'react-intl'
import type { ChampionshipRow } from './AdminChampionshipTable'
import { ChampionshipStatusDot } from './ChampionshipStatusDot'
import { PhaseType } from '@Championship/domain/Phase'

type AdminChampionshipTableRowProps = {
  championship: ChampionshipRow
  onResume: (id: string) => void
}

const formatDate = (date: string | null, locale: string) => (date ? new Date(date).toLocaleDateString(locale) : null)

const PHASE_TYPE_MESSAGE_ID: Record<PhaseType, string> = {
  [PhaseType.GROUP]: 'adminChampionships.phaseType.GROUP',
  [PhaseType.KNOCKOUT]: 'adminChampionships.phaseType.KNOCKOUT',
}

export const AdminChampionshipTableRow = ({ championship, onResume }: AdminChampionshipTableRowProps) => {
  const intl = useIntl()

  const startDate = formatDate(championship.startDate, intl.locale)
  const endDate = formatDate(championship.endDate, intl.locale)
  const dates = startDate && endDate ? `${startDate} – ${endDate}` : null

  return (
    <TableRow id={championship.id}>
      <TableCell className="font-medium">{championship.name}</TableCell>
      <TableCell>{championship.seasonLabel ?? <span className="text-muted-foreground">—</span>}</TableCell>
      <TableCell>{championship.categoryLabel ?? <span className="text-muted-foreground">—</span>}</TableCell>
      <TableCell>
        <ChampionshipStatusDot isDraft={championship.isDraft} isFinished={championship.isFinished} />
      </TableCell>
      <TableCell>{dates ?? <span className="text-muted-foreground">—</span>}</TableCell>
      <TableCell>
        {championship.currentPhaseType ? (
          intl.formatMessage({ id: PHASE_TYPE_MESSAGE_ID[championship.currentPhaseType] })
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>{championship.teamsCount}</TableCell>
      <TableCell>
        {championship.matchesTotal > 0 ? (
          `${championship.matchesPlayed}/${championship.matchesTotal}`
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {championship.isDraft && (
          <Tooltip content={intl.formatMessage({ id: 'adminChampionships.action.resumeTooltip' })}>
            <Button
              variant="outline"
              size="icon"
              aria-label={intl.formatMessage({ id: 'adminChampionships.action.resume' })}
              onPress={() => onResume(championship.id)}
            >
              <BookCheck className="h-4 w-4" />
            </Button>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  )
}
