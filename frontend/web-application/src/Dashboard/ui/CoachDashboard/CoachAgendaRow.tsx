import { MapPin } from 'lucide-react'
import type { Match, Team } from '@Sdk/model'

type Props = {
  match: Match
  teamById: Record<string, Team>
}

export const CoachAgendaRow = ({ match, teamById }: Props) => {
  const date = match.scheduledAt ? new Date(match.scheduledAt) : null
  const home = teamById[match.homeTeamId]
  const away = teamById[match.awayTeamId]

  return (
    <div className="hover:bg-secondary grid cursor-pointer grid-cols-[48px_1fr_auto] items-center gap-3 rounded-lg px-3 py-2.5">
      <div className="bg-background rounded-lg border py-1 text-center">
        {date ? (
          <>
            <div className="text-base leading-tight font-semibold">{date.getDate()}</div>
            <div className="text-muted-foreground text-[9px] font-medium tracking-widest uppercase">
              {date.toLocaleString('fr-FR', { month: 'short' })}
            </div>
          </>
        ) : (
          <div className="text-muted-foreground text-xs">—</div>
        )}
      </div>

      <div className="min-w-0">
        <div className="truncate text-sm font-medium">
          {home?.name ?? match.homeTeamId} vs {away?.name ?? match.awayTeamId}
        </div>
        <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
          <MapPin className="h-2.5 w-2.5" />
          {match.area?.name ?? '—'}
        </div>
      </div>

      {date && (
        <div className="text-xs font-semibold whitespace-nowrap">
          {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  )
}
