import type { Match } from '../../match/domain/Match.js'
import type { PointsConfig } from '../../championship/domain/Championship.js'
import type { StandingRow } from '../domain/Standing.js'
import { MatchStatus } from '../../match/domain/Match.js'

type TeamStats = {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  forfeited: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

function buildStatsMap(teamIds: string[], matches: Match[], pointsConfig: PointsConfig): Map<string, TeamStats> {
  const map = new Map<string, TeamStats>()
  for (const teamId of teamIds) {
    map.set(teamId, {
      teamId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      forfeited: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    })
  }

  for (const match of matches) {
    if (match.status === MatchStatus.CANCELLED || match.status === MatchStatus.SCHEDULED) {
      continue
    }

    const home = map.get(match.homeTeamId)
    const away = map.get(match.awayTeamId)
    if (!home || !away) {
      continue
    }

    if (match.status === MatchStatus.FORFEITED && match.forfeitedBy) {
      const forfeitingTeam = match.forfeitedBy === match.homeTeamId ? home : away
      const winningTeam = match.forfeitedBy === match.homeTeamId ? away : home
      forfeitingTeam.played += 1
      forfeitingTeam.forfeited += 1
      forfeitingTeam.points += pointsConfig.forfeit
      winningTeam.played += 1
      winningTeam.won += 1
      winningTeam.points += pointsConfig.win
      if (match.homeGoals !== null && match.awayGoals !== null) {
        home.goalsFor += match.homeGoals
        home.goalsAgainst += match.awayGoals
        away.goalsFor += match.awayGoals
        away.goalsAgainst += match.homeGoals
      }
      continue
    }

    if (match.status === MatchStatus.PLAYED && match.homeGoals !== null && match.awayGoals !== null) {
      home.played += 1
      away.played += 1
      home.goalsFor += match.homeGoals
      home.goalsAgainst += match.awayGoals
      away.goalsFor += match.awayGoals
      away.goalsAgainst += match.homeGoals

      if (match.homeGoals > match.awayGoals) {
        home.won += 1
        home.points += pointsConfig.win
        away.lost += 1
        away.points += pointsConfig.loss
      } else if (match.homeGoals < match.awayGoals) {
        away.won += 1
        away.points += pointsConfig.win
        home.lost += 1
        home.points += pointsConfig.loss
      } else {
        home.drawn += 1
        home.points += pointsConfig.draw
        away.drawn += 1
        away.points += pointsConfig.draw
      }
    }
  }

  return map
}

function headToHeadStats(teamIds: string[], matches: Match[], pointsConfig: PointsConfig): Map<string, TeamStats> {
  const relevantMatches = matches.filter(m => teamIds.includes(m.homeTeamId) && teamIds.includes(m.awayTeamId))
  return buildStatsMap(teamIds, relevantMatches, pointsConfig)
}

function compareStats(
  a: TeamStats,
  b: TeamStats,
  h2h: Map<string, TeamStats>,
  overall: Map<string, TeamStats>
): number {
  const ah2h = h2h.get(a.teamId)!
  const bh2h = h2h.get(b.teamId)!
  const ao = overall.get(a.teamId)!
  const bo = overall.get(b.teamId)!

  // Head-to-head points
  if (bh2h.points !== ah2h.points) {
    return bh2h.points - ah2h.points
  }
  // Head-to-head goal difference
  const ah2hGD = ah2h.goalsFor - ah2h.goalsAgainst
  const bh2hGD = bh2h.goalsFor - bh2h.goalsAgainst
  if (bh2hGD !== ah2hGD) {
    return bh2hGD - ah2hGD
  }
  // Head-to-head goals scored
  if (bh2h.goalsFor !== ah2h.goalsFor) {
    return bh2h.goalsFor - ah2h.goalsFor
  }
  // Overall goal difference
  const aoGD = ao.goalsFor - ao.goalsAgainst
  const boGD = bo.goalsFor - bo.goalsAgainst
  if (boGD !== aoGD) {
    return boGD - aoGD
  }
  // Overall goals scored
  return bo.goalsFor - ao.goalsFor
}

function sortWithTiebreakers(statsArray: TeamStats[], matches: Match[], pointsConfig: PointsConfig): TeamStats[] {
  const sorted = [...statsArray].sort((a, b) => b.points - a.points)
  const result: TeamStats[] = []
  let i = 0

  while (i < sorted.length) {
    let j = i + 1
    while (j < sorted.length && sorted[j].points === sorted[i].points) {
      j++
    }

    const group = sorted.slice(i, j)
    if (group.length === 1) {
      result.push(group[0])
    } else {
      const tiedIds = group.map(s => s.teamId)
      const h2h = headToHeadStats(tiedIds, matches, pointsConfig)
      const overall = buildStatsMap(tiedIds, matches, pointsConfig)
      group.sort((a, b) => compareStats(a, b, h2h, overall))
      result.push(...group)
    }
    i = j
  }

  return result
}

function assignRanks(sorted: TeamStats[]): StandingRow[] {
  return sorted.map((stats, index) => ({
    rank: index + 1,
    teamId: stats.teamId,
    played: stats.played,
    won: stats.won,
    drawn: stats.drawn,
    lost: stats.lost,
    forfeited: stats.forfeited,
    goalsFor: stats.goalsFor,
    goalsAgainst: stats.goalsAgainst,
    goalDifference: stats.goalsFor - stats.goalsAgainst,
    points: stats.points,
  }))
}

export function calculateStandings(matches: Match[], teamIds: string[], pointsConfig: PointsConfig): StandingRow[] {
  const statsMap = buildStatsMap(teamIds, matches, pointsConfig)
  const sorted = sortWithTiebreakers(Array.from(statsMap.values()), matches, pointsConfig)
  return assignRanks(sorted)
}
