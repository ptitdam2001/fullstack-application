import { Tooltip, cn } from '@repo/design-system'
import { useIntl } from 'react-intl'

type ChampionshipStatus = 'draft' | 'inProgress' | 'finished'

type ChampionshipStatusDotProps = {
  isDraft: boolean
  isFinished: boolean
}

const STATUS_COLOR: Record<ChampionshipStatus, string> = {
  draft: 'bg-muted-foreground',
  inProgress: 'bg-blue-500',
  finished: 'bg-emerald-500',
}

const getStatus = (isDraft: boolean, isFinished: boolean): ChampionshipStatus => {
  if (isDraft) {
    return 'draft'
  }
  if (isFinished) {
    return 'finished'
  }
  return 'inProgress'
}

export const ChampionshipStatusDot = ({ isDraft, isFinished }: ChampionshipStatusDotProps) => {
  const intl = useIntl()
  const status = getStatus(isDraft, isFinished)
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
