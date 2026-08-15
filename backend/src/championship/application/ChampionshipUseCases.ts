import type { IChampionshipRepository, PaginationOptions } from '../ports/IChampionshipRepository.js'
import type { CreateChampionshipInput, UpdateChampionshipInput } from '../domain/Championship.js'
import { ChampionshipNotFoundError } from '../domain/ChampionshipErrors.js'
import type { IPhaseRepository } from '../../phase/ports/IPhaseRepository.js'
import type { IGroupRepository } from '../../group/ports/IGroupRepository.js'
import type { IMatchRepository } from '../../match/ports/IMatchRepository.js'
import type { IBracketRepository } from '../../bracket/ports/IBracketRepository.js'
import { PhaseType, type Phase } from '../../phase/domain/Phase.js'
import { MatchStatus, type Match } from '../../match/domain/Match.js'

type CurrentPhaseStats = {
  currentPhaseType: PhaseType | null
  teamsCount: number
  matchesPlayed: number
  matchesTotal: number
  isFinished: boolean
}

export class ChampionshipUseCases {
  constructor(
    private readonly repo: IChampionshipRepository,
    private readonly phaseRepo: IPhaseRepository,
    private readonly groupRepo: IGroupRepository,
    private readonly matchRepo: IMatchRepository,
    private readonly bracketRepo: IBracketRepository
  ) {}

  async count(isDraft?: boolean) {
    if (isDraft === undefined) {
      return this.repo.count()
    }
    const total = await this.repo.count()
    const championships = await this.repo.findAll({ page: 1, count: total })
    const draftFlags = await Promise.all(championships.map(championship => this.computeIsDraft(championship.id)))
    return draftFlags.filter(flag => flag === isDraft).length
  }

  async getAll(options: PaginationOptions) {
    const championships = await this.repo.findAll(options)
    return Promise.all(championships.map(championship => this.enrichChampionship(championship)))
  }

  async getById(id: string) {
    const championship = await this.repo.findById(id)
    if (!championship) {
      throw new ChampionshipNotFoundError(id)
    }
    return this.enrichChampionship(championship)
  }

  private async enrichChampionship<T extends { id: string }>(championship: T) {
    const [isDraft, stats] = await Promise.all([
      this.computeIsDraft(championship.id),
      this.computeCurrentPhaseStats(championship.id),
    ])
    return { ...championship, isDraft, ...stats }
  }

  private async computeIsDraft(championshipId: string): Promise<boolean> {
    const phases = await this.phaseRepo.findByChampionshipId(championshipId)
    if (phases.length === 0) {
      return true
    }
    const [groups, brackets] = await Promise.all([
      this.groupRepo.findByPhaseId(phases[0].id),
      this.bracketRepo.findByPhaseId(phases[0].id),
    ])
    return groups.length === 0 && brackets.length === 0
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
    return (await this.computeCurrentPhaseStats(championshipId)).isFinished
  }

  private async getCurrentPhase(championshipId: string): Promise<Phase | undefined> {
    const phases = await this.phaseRepo.findByChampionshipId(championshipId)
    if (phases.length === 0) {
      return undefined
    }
    return phases.reduce((latest, phase) => (phase.order > latest.order ? phase : latest))
  }

  private async computeCurrentPhaseStats(championshipId: string): Promise<CurrentPhaseStats> {
    const phase = await this.getCurrentPhase(championshipId)
    if (!phase) {
      return { currentPhaseType: null, teamsCount: 0, matchesPlayed: 0, matchesTotal: 0, isFinished: false }
    }

    let teamIds: string[]
    let matches: Match[]
    if (phase.type === PhaseType.KNOCKOUT) {
      const brackets = await this.bracketRepo.findByPhaseId(phase.id)
      teamIds = brackets.flatMap(bracket => bracket.bracketTeams.map(bracketTeam => bracketTeam.teamId))
      matches = (await Promise.all(brackets.map(bracket => this.matchRepo.findByBracketId(bracket.id)))).flat()
    } else {
      const groups = await this.groupRepo.findByPhaseId(phase.id)
      teamIds = groups.flatMap(group => group.teamIds)
      matches = (await Promise.all(groups.map(group => this.matchRepo.findByGroupId(group.id)))).flat()
    }

    const matchesTotal = matches.length
    const matchesPlayed = matches.filter(match => match.status !== MatchStatus.SCHEDULED).length

    return {
      currentPhaseType: phase.type,
      teamsCount: new Set(teamIds).size,
      matchesPlayed,
      matchesTotal,
      isFinished: matchesTotal > 0 && matchesPlayed === matchesTotal,
    }
  }

  async hasUnfinishedChampionships(seasonId: string): Promise<boolean> {
    const championships = await this.repo.findBySeasonId(seasonId)
    const finishedFlags = await Promise.all(
      championships.map(championship => this.isChampionshipFinished(championship.id))
    )
    return finishedFlags.some(finished => !finished)
  }
}
