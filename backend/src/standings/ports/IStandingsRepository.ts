import type { Match } from '../../match/domain/Match.js'
import type { PointsConfig } from '../../championship/domain/Championship.js'

export type GroupContext = {
  teamIds: string[]
  pointsConfig: PointsConfig
}

export interface IStandingsRepository {
  findMatchesByGroupId(groupId: string): Promise<Match[]>
  findGroupContext(groupId: string): Promise<GroupContext>
}
