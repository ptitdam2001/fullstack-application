import type { IStandingsRepository } from '../ports/IStandingsRepository.js'
import type { GroupStandings } from '../domain/Standing.js'
import { calculateStandings } from './StandingsCalculator.js'

export class StandingsUseCases {
  constructor(private readonly repo: IStandingsRepository) {}

  async getGroupStandings(groupId: string): Promise<GroupStandings> {
    const [matches, { teamIds, pointsConfig }] = await Promise.all([
      this.repo.findMatchesByGroupId(groupId),
      this.repo.findGroupContext(groupId),
    ])

    return {
      groupId,
      rows: calculateStandings(matches, teamIds, pointsConfig),
    }
  }
}
