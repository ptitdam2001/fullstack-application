import type { Team, CreateTeamInput, UpdateTeamInput, CreateTeamWithCoachInput } from '../domain/Team.js'
import type { Player } from '../../player/domain/Player.js'
import type { UserTeam } from '../../userTeam/domain/UserTeam.js'

export type TeamPlayersOptions = { page: number; count: number }
export type TeamCalendarOptions = { page: number; count: number; startDate?: Date; endDate?: Date }

export type GameSummary = {
  id: string
  date: Date | null
  teams: { teamId: string; score: number }[]
}

export interface ITeamRepository {
  count(): Promise<number>
  findAll(): Promise<Team[]>
  findById(id: string): Promise<Team | null>
  create(input: CreateTeamInput): Promise<Team>
  update(id: string, input: UpdateTeamInput): Promise<Team>
  delete(id: string): Promise<void>
  findPlayers(teamId: string, options: TeamPlayersOptions): Promise<Player[]>
  findCalendar(teamId: string, options: TeamCalendarOptions): Promise<GameSummary[]>
  createWithCoach(input: CreateTeamWithCoachInput, coachUserId: string): Promise<{ team: Team; userTeam: UserTeam }>
}
