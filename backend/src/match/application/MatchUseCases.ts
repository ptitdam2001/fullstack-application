import type { IMatchRepository, PaginationOptions, MatchFilterOptions } from '../ports/IMatchRepository.js'
import type { CreateMatchInput, UpdateMatchInput, Match, MatchWithDisplayData } from '../domain/Match.js'
import { MatchStatus } from '../domain/Match.js'
import { MatchNotFoundError } from '../domain/MatchErrors.js'
import type { BracketUseCases } from '../../bracket/application/BracketUseCases.js'
import type { IGroupRepository } from '../../group/ports/IGroupRepository.js'
import type { IBracketRepository } from '../../bracket/ports/IBracketRepository.js'
import type { IPhaseRepository } from '../../phase/ports/IPhaseRepository.js'
import type { IChampionshipRepository } from '../../championship/ports/IChampionshipRepository.js'
import type { ITeamRepository } from '../../team/ports/ITeamRepository.js'

export class MatchUseCases {
  constructor(
    private readonly repo: IMatchRepository,
    private readonly bracketUseCases: BracketUseCases,
    private readonly groupRepo: IGroupRepository,
    private readonly bracketRepo: IBracketRepository,
    private readonly phaseRepo: IPhaseRepository,
    private readonly championshipRepo: IChampionshipRepository,
    private readonly teamRepo: ITeamRepository
  ) {}

  count(filters?: MatchFilterOptions) {
    return this.repo.count(filters)
  }

  async getAll(options: PaginationOptions, filters?: MatchFilterOptions) {
    const matches = await this.repo.findAll(options, filters)
    return Promise.all(matches.map(match => this.enrichMatch(match)))
  }

  async getById(id: string) {
    const match = await this.repo.findById(id)
    if (!match) {
      throw new MatchNotFoundError(id)
    }
    return this.enrichMatch(match)
  }

  private async enrichMatch(match: Match): Promise<MatchWithDisplayData> {
    const [stage, homeTeam, awayTeam] = await Promise.all([
      this.resolveStage(match),
      match.homeTeamId ? this.teamRepo.findById(match.homeTeamId) : null,
      match.awayTeamId ? this.teamRepo.findById(match.awayTeamId) : null,
    ])
    return {
      ...match,
      championshipName: stage?.championshipName ?? null,
      stageName: stage?.stageName ?? null,
      homeTeam: homeTeam ? { id: homeTeam.id, name: homeTeam.name, color: homeTeam.color } : null,
      awayTeam: awayTeam ? { id: awayTeam.id, name: awayTeam.name, color: awayTeam.color } : null,
    }
  }

  private async resolveStage(match: Match): Promise<{ championshipName: string; stageName: string } | null> {
    if (match.groupId) {
      const group = await this.groupRepo.findById(match.groupId)
      if (!group) {
        return null
      }
      const phase = await this.phaseRepo.findById(group.phaseId)
      if (!phase) {
        return null
      }
      const championship = await this.championshipRepo.findById(phase.championshipId)
      if (!championship) {
        return null
      }
      return { championshipName: championship.name, stageName: group.name }
    }
    if (match.bracketId) {
      const bracket = await this.bracketRepo.findById(match.bracketId)
      if (!bracket) {
        return null
      }
      const phase = await this.phaseRepo.findById(bracket.phaseId)
      if (!phase) {
        return null
      }
      const championship = await this.championshipRepo.findById(phase.championshipId)
      if (!championship) {
        return null
      }
      return { championshipName: championship.name, stageName: bracket.name }
    }
    return null
  }

  getByGroupId(groupId: string) {
    return this.repo.findByGroupId(groupId)
  }

  create(input: CreateMatchInput) {
    return this.repo.create(input)
  }

  async update(id: string, input: UpdateMatchInput) {
    await this.getById(id)
    const updated = await this.repo.update(id, input)
    if (updated.bracketId && (updated.status === MatchStatus.PLAYED || updated.status === MatchStatus.FORFEITED)) {
      await this.bracketUseCases.advanceWinner(updated)
    }
    return updated
  }

  async delete(id: string) {
    const match = await this.getById(id)
    if (match.status === MatchStatus.SCHEDULED || match.status === MatchStatus.CANCELLED) {
      return this.repo.delete(id)
    }
    return this.repo.softDelete(id)
  }
}
