import { Tooltip, cn } from '@repo/design-system'
import { useIntl } from 'react-intl'
import { getChampionshipStatus, type ChampionshipStatus } from './getChampionshipStatus'

type ChampionshipStatusDotProps = {
  isDraft: boolean
  isFinished: boolean
}

const STATUS_COLOR: Record<ChampionshipStatus, string> = {
  draft: 'bg-muted-foreground',
  inProgress: 'bg-blue-500',
  finished: 'bg-emerald-500',
}

export const ChampionshipStatusDot = ({ isDraft, isFinished }: ChampionshipStatusDotProps) => {
  const intl = useIntl()
  const status = getChampionshipStatus(isDraft, isFinished)
  const label = intl.formatMessage({ id: `adminChampionships.status.${status}` })

  return (
    <Tooltip content={label}>
      <span
        role="img"
        aria-label={label}
        className={cn('inline-block h-2.5 w-2.5 rounded-full', STATUS_COLOR[status])}
      />
    </Tooltip>
  )
}
