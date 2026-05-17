import type { ITeamRepository, TeamPlayersOptions, TeamCalendarOptions } from '../ports/ITeamRepository.js'
import type { CreateTeamInput, UpdateTeamInput, CreateTeamWithCoachInput } from '../domain/Team.js'
import type { Team } from '../domain/Team.js'
import type { UserTeam } from '../../userTeam/domain/UserTeam.js'
import { TeamNotFoundError } from '../domain/TeamErrors.js'

export class TeamUseCases {
  constructor(private readonly repo: ITeamRepository) {}

  count() {
    return this.repo.count()
  }

  getAll() {
    return this.repo.findAll()
  }

  async getById(id: string) {
    const team = await this.repo.findById(id)
    if (!team) throw new TeamNotFoundError(id)
    return team
  }

  create(input: CreateTeamInput) {
    return this.repo.create(input)
  }

  async update(id: string, input: UpdateTeamInput) {
    await this.getById(id)
    return this.repo.update(id, input)
  }

  async delete(id: string) {
    await this.getById(id)
    return this.repo.delete(id)
  }

  async getPlayers(teamId: string, options: TeamPlayersOptions) {
    await this.getById(teamId)
    return this.repo.findPlayers(teamId, options)
  }

  async getCalendar(teamId: string, options: TeamCalendarOptions) {
    await this.getById(teamId)
    return this.repo.findCalendar(teamId, options)
  }

  createWithCoach(input: CreateTeamWithCoachInput, coachUserId: string): Promise<{ team: Team; userTeam: UserTeam }> {
    return this.repo.createWithCoach(input, coachUserId)
  }
}
