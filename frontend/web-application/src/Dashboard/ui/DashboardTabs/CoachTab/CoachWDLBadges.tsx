import { MatchStatus } from '@Sdk/model/matchStatus'
import type { Match } from '@Sdk/model/match'

type Props = {
  teamId: string
  matches: Match[]
}

export const CoachWDLBadges = ({ teamId, matches }: Props) => {
  const playedMatches = matches.filter(
    m => m.status === MatchStatus.PLAYED && (m.homeTeamId === teamId || m.awayTeamId === teamId)
  )

  let W = 0,
    D = 0,
    L = 0
  for (const m of playedMatches) {
    const isHome = m.homeTeamId === teamId
    const teamGoals = isHome ? (m.homeGoals ?? 0) : (m.awayGoals ?? 0)
    const oppGoals = isHome ? (m.awayGoals ?? 0) : (m.homeGoals ?? 0)
    if (teamGoals > oppGoals) {
      W++
    } else if (teamGoals === oppGoals) {
      D++
    } else {
      L++
    }
  }

  return (
    <div className="flex gap-1 text-xs">
      <span className="rounded bg-green-100 px-1.5 py-0.5 font-semibold text-green-700">{W}V</span>
      <span className="rounded bg-gray-100 px-1.5 py-0.5 font-semibold text-gray-600">{D}N</span>
      <span className="rounded bg-red-100 px-1.5 py-0.5 font-semibold text-red-700">{L}D</span>
    </div>
  )
}
