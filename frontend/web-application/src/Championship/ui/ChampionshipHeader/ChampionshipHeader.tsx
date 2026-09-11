import { FormattedMessage, useIntl } from 'react-intl'
import { Badge, Typography } from '@repo/design-system'
import { getChampionshipStatus, type ChampionshipStatus } from '../Admin/getChampionshipStatus'
import type { Championship } from '../../domain/Championship'

type ChampionshipHeaderProps = {
  championship: Championship
  seasonLabel: string | null
  categoryLabel: string | null
  phasesCount: number
}

const STATUS_BADGE_CLASS: Record<ChampionshipStatus, string> = {
  draft: 'bg-gray-100 text-gray-800 border-transparent dark:bg-gray-800 dark:text-gray-300',
  inProgress: 'bg-blue-100 text-blue-800 border-transparent dark:bg-blue-900 dark:text-blue-200',
  finished: 'bg-emerald-100 text-emerald-800 border-transparent dark:bg-emerald-900 dark:text-emerald-200',
}

const Dash = () => <span className="text-muted-foreground">—</span>

export const ChampionshipHeader = ({
  championship,
  seasonLabel,
  categoryLabel,
  phasesCount,
}: ChampionshipHeaderProps) => {
  const intl = useIntl()
  const status = getChampionshipStatus(championship.isDraft, championship.isFinished)
  const { win, draw, loss, forfeit } = championship.pointsConfig

  return (
    <div className="flex flex-wrap items-start gap-5">
      <div>
        <Typography.Title1>{championship.name}</Typography.Title1>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline" className={STATUS_BADGE_CLASS[status]}>
            <FormattedMessage id={`adminChampionships.status.${status}`} />
          </Badge>
          <Badge variant="outline">{seasonLabel ?? <Dash />}</Badge>
          <Badge variant="outline">{categoryLabel ?? <Dash />}</Badge>
          <Badge variant="outline">
            <FormattedMessage id="championshipDetail.points.win" /> {win} ·{' '}
            <FormattedMessage id="championshipDetail.points.draw" /> {draw} ·{' '}
            <FormattedMessage id="championshipDetail.points.loss" /> {loss} ·{' '}
            <FormattedMessage id="championshipDetail.points.forfeit" /> {forfeit}
          </Badge>
        </div>
      </div>

      <div className="ml-auto flex flex-wrap gap-6">
        <div>
          <div className="text-lg leading-tight font-bold">{phasesCount}</div>
          <div className="text-muted-foreground text-[11px] tracking-wide uppercase">
            {intl.formatMessage({ id: 'championshipDetail.stats.phases' })}
          </div>
        </div>
        <div>
          <div className="text-lg leading-tight font-bold">{championship.teamsCount}</div>
          <div className="text-muted-foreground text-[11px] tracking-wide uppercase">
            {intl.formatMessage({ id: 'championshipDetail.stats.teams' })}
          </div>
        </div>
        <div>
          <div className="text-lg leading-tight font-bold">
            {championship.matchesPlayed}/{championship.matchesTotal}
          </div>
          <div className="text-muted-foreground text-[11px] tracking-wide uppercase">
            {intl.formatMessage({ id: 'championshipDetail.stats.matches' })}
          </div>
        </div>
      </div>
    </div>
  )
}
