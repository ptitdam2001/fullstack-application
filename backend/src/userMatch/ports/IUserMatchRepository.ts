import type { UserMatch } from '../domain/UserMatch.js'

export interface IUserMatchRepository {
  assign(userId: string, matchId: string): Promise<UserMatch>
  remove(userId: string, matchId: string): Promise<void>
  findByMatch(matchId: string): Promise<UserMatch[]>
  findByUser(userId: string): Promise<UserMatch[]>
  isReferee(userId: string, matchId: string): Promise<boolean>
}
