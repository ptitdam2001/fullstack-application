import type { IBracketRepository } from '../ports/IBracketRepository.js'
import type { CreateBracketInput } from '../domain/Bracket.js'
import { BracketNotFoundError, BracketLockedError } from '../domain/BracketErrors.js'
import { buildBracketMatches } from './buildBracketMatches.js'
import type { IMatchRepository } from '../../match/ports/IMatchRepository.js'
import type { Match, UpdateMatchInput } from '../../match/domain/Match.js'
import { MatchStatus } from '../../match/domain/Match.js'

export class BracketUseCases {
  constructor(
    private readonly repo: IBracketRepository,
    private readonly matchRepo: IMatchRepository
  ) {}

  create(input: CreateBracketInput) {
    return this.repo.create(input)
  }

  async getById(id: string) {
    const bracket = await this.repo.findById(id)
    if (!bracket) {
      throw new BracketNotFoundError(id)
    }
    return bracket
  }

  async generateMatches(bracketId: string) {
    const bracket = await this.getById(bracketId)
    const locked = await this.repo.hasPlayedMatches(bracketId)
    if (locked) {
      throw new BracketLockedError(bracketId)
    }

    const existingMatches = await this.matchRepo.findByBracketId(bracketId)
    await Promise.all(existingMatches.map((match) => this.matchRepo.delete(match.id)))

    const plans = buildBracketMatches(bracket.bracketTeams)
    return Promise.all(
      plans.map((plan) =>
        this.matchRepo.create({
          groupId: null,
          bracketId,
          round: plan.round,
          bracketPosition: plan.bracketPosition,
          homeTeamId: plan.homeTeamId,
          awayTeamId: plan.awayTeamId,
          area: null,
          scheduledAt: null,
          homeGoals: null,
          awayGoals: null,
          forfeitedBy: null,
        })
      )
    )
  }

  async advanceWinner(match: Match): Promise<void> {
    if (!match.bracketId || match.round === null || match.bracketPosition === null) {
      return
    }
    if (match.status !== MatchStatus.PLAYED && match.status !== MatchStatus.FORFEITED) {
      return
    }

    const winner = this.determineWinner(match)
    if (!winner) {
      return
    }

    const nextRound = match.round + 1
    const nextPosition = Math.ceil(match.bracketPosition / 2)
    const bracketMatches = await this.matchRepo.findByBracketId(match.bracketId)
    const nextMatch = bracketMatches.find((m) => m.round === nextRound && m.bracketPosition === nextPosition)
    if (!nextMatch) {
      return
    }

    const patch: UpdateMatchInput = match.bracketPosition % 2 === 1 ? { homeTeamId: winner } : { awayTeamId: winner }
    await this.matchRepo.update(nextMatch.id, patch)
  }

  private determineWinner(match: Match): string | null {
    if (match.status === MatchStatus.FORFEITED) {
      if (!match.forfeitedBy) {
        return null
      }
      return match.forfeitedBy === match.homeTeamId ? match.awayTeamId : match.homeTeamId
    }
    if (match.homeGoals === null || match.awayGoals === null) {
      return null
    }
    return match.homeGoals > match.awayGoals ? match.homeTeamId : match.awayTeamId
  }
}
