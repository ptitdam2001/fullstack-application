import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import type { Match } from '@Sdk/model/match'

type Props = {
  matches: Match[]
  teamNames: Record<string, string>
}

export const RefereeUpcomingMatches = ({ matches, teamNames }: Props) => {
  if (matches.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold tracking-wider uppercase">
        <FormattedMessage id="refereeDashboard.upcoming.title" />
      </h3>
      <ul className="flex flex-col gap-2">
        {matches.map(m => (
          <li key={m.id} className="bg-card flex items-center justify-between rounded-lg border px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">
                {teamNames[m.homeTeamId] ?? m.homeTeamId}{' '}
                <span className="text-muted-foreground text-xs">
                  <FormattedMessage id="refereeDashboard.vs" />
                </span>{' '}
                {teamNames[m.awayTeamId] ?? m.awayTeamId}
              </span>
              <span className="text-muted-foreground text-xs">
                {m.scheduledAt ? new Date(m.scheduledAt).toLocaleString() : '—'}
              </span>
              {m.area.name && <span className="text-muted-foreground text-xs">{m.area.name}</span>}
            </div>
            <Link to={`/app/games/${m.id}`} className="text-primary text-xs font-medium hover:underline">
              →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
