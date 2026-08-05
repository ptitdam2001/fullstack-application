import type { IChampionshipRepository, PaginationOptions } from '../ports/IChampionshipRepository.js'
import type { CreateChampionshipInput, UpdateChampionshipInput } from '../domain/Championship.js'
import { ChampionshipNotFoundError } from '../domain/ChampionshipErrors.js'
import type { IPhaseRepository } from '../../phase/ports/IPhaseRepository.js'
import type { IGroupRepository } from '../../group/ports/IGroupRepository.js'
import type { IMatchRepository } from '../../match/ports/IMatchRepository.js'
import type { IBracketRepository } from '../../bracket/ports/IBracketRepository.js'
import { PhaseType } from '../../phase/domain/Phase.js'
import { MatchStatus } from '../../match/domain/Match.js'

export class ChampionshipUseCases {
  constructor(
    private readonly repo: IChampionshipRepository,
    private readonly phaseRepo: IPhaseRepository,
    private readonly groupRepo: IGroupRepository,
    private readonly matchRepo: IMatchRepository,
    private readonly bracketRepo: IBracketRepository
  ) {}

  count() {
    return this.repo.count()
  }

  getAll(options: PaginationOptions) {
    return this.repo.findAll(options)
  }

  async getById(id: string) {
    const championship = await this.repo.findById(id)
    if (!championship) throw new ChampionshipNotFoundError(id)
    return championship
  }

  create(input: CreateChampionshipInput) {
    return this.repo.create(input)
  }

  async update(id: string, input: UpdateChampionshipInput) {
    await this.getById(id)
    return this.repo.update(id, input)
  }

  async delete(id: string) {
    await this.getById(id)
    const hasHistory = await this.repo.hasPlayedMatches(id)
    if (hasHistory) {
      return this.repo.softDelete(id)
    }
    return this.repo.delete(id)
  }

  async isChampionshipFinished(championshipId: string): Promise<boolean> {
    const phases = await this.phaseRepo.findByChampionshipId(championshipId)
    if (phases.length === 0) {
      return false
    }
    const lastPhase = phases.reduce((latest, phase) => (phase.order > latest.order ? phase : latest))

    if (lastPhase.type === PhaseType.KNOCKOUT) {
      const brackets = await this.bracketRepo.findByPhaseId(lastPhase.id)
      const matchesByBracket = await Promise.all(brackets.map((bracket) => this.matchRepo.findByBracketId(bracket.id)))
      const matches = matchesByBracket.flat()
      return matches.length > 0 && matches.every((match) => match.status !== MatchStatus.SCHEDULED)
    }

    const groups = await this.groupRepo.findByPhaseId(lastPhase.id)
    const matchesByGroup = await Promise.all(groups.map((group) => this.matchRepo.findByGroupId(group.id)))
    const groupMatches = matchesByGroup.flat()
    return groupMatches.length > 0 && groupMatches.every((match) => match.status !== MatchStatus.SCHEDULED)
  }

  async hasUnfinishedChampionships(seasonId: string): Promise<boolean> {
    const championships = await this.repo.findBySeasonId(seasonId)
    const finishedFlags = await Promise.all(championships.map((championship) => this.isChampionshipFinished(championship.id)))
    return finishedFlags.some((finished) => !finished)
  }
}
