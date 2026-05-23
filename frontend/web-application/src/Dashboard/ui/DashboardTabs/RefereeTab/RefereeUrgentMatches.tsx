import dayjs from 'dayjs'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import type { Match } from '@Sdk/model/match'

type Props = {
  matches: Match[]
  teamNames: Record<string, string>
}

export const RefereeUrgentMatches = ({ matches, teamNames }: Props) => {
  if (matches.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
        <FormattedMessage id="refereeDashboard.urgent.title" />
      </h3>
      <ul className="flex flex-col gap-2">
        {matches.map((m) => {
          const daysAgo = dayjs().diff(dayjs(m.scheduledAt), 'day')
          return (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-lg border border-red-500 bg-red-50 px-4 py-3 dark:bg-red-950/20"
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700">
                    <FormattedMessage id="refereeDashboard.urgent.badge" />
                  </span>
                  <span className="text-sm font-medium">
                    {teamNames[m.homeTeamId] ?? m.homeTeamId}{' '}
                    <span className="text-muted-foreground text-xs">
                      <FormattedMessage id="refereeDashboard.vs" />
                    </span>{' '}
                    {teamNames[m.awayTeamId] ?? m.awayTeamId}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">
                  <FormattedMessage id="refereeDashboard.urgent.daysAgo" values={{ days: daysAgo }} />
                </span>
              </div>
              <Link
                to={`/app/games/${m.id}/score`}
                className="text-primary hover:underline text-xs font-medium"
              >
                <FormattedMessage id="refereeDashboard.urgent.action" />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
