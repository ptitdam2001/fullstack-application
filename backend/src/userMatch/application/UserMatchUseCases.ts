import type { IUserMatchRepository } from '../ports/IUserMatchRepository.js'
import type { UserMatch } from '../domain/UserMatch.js'
import { UserMatchNotFoundError, UserMatchAlreadyExistsError } from '../domain/UserMatchErrors.js'

export class UserMatchUseCases {
  constructor(private readonly repo: IUserMatchRepository) {}

  async assign(userId: string, matchId: string): Promise<UserMatch> {
    const already = await this.repo.isReferee(userId, matchId)
    if (already) throw new UserMatchAlreadyExistsError(userId, matchId)
    return this.repo.assign(userId, matchId)
  }

  async remove(userId: string, matchId: string): Promise<void> {
    const exists = await this.repo.isReferee(userId, matchId)
    if (!exists) throw new UserMatchNotFoundError(userId, matchId)
    return this.repo.remove(userId, matchId)
  }

  getMatchReferees(matchId: string): Promise<UserMatch[]> {
    return this.repo.findByMatch(matchId)
  }

  getUserMatches(userId: string): Promise<UserMatch[]> {
    return this.repo.findByUser(userId)
  }
}
