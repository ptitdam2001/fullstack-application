import type { IPhaseRepository } from '../ports/IPhaseRepository.js'
import type { IGroupRepository } from '../../group/ports/IGroupRepository.js'
import type { IMatchRepository } from '../../match/ports/IMatchRepository.js'
import type { IChampionshipRepository } from '../../championship/ports/IChampionshipRepository.js'
import type { CreatePhaseInput, UpdatePhaseInput, QualifiedTeam } from '../domain/Phase.js'
import {
  PhaseNotFoundError,
  PhaseDuplicateOrderError,
  PreviousPhaseNotFinishedError,
  PhaseNotFinishedError,
} from '../domain/PhaseErrors.js'
import { ChampionshipNotFoundError } from '../../championship/domain/ChampionshipErrors.js'
import { calculateStandings } from '../../standings/application/StandingsCalculator.js'

export class PhaseUseCases {
  constructor(
    private readonly repo: IPhaseRepository,
    private readonly groupRepo: IGroupRepository,
    private readonly matchRepo: IMatchRepository,
    private readonly championshipRepo: IChampionshipRepository
  ) {}

  getByChampionshipId(championshipId: string) {
    return this.repo.findByChampionshipId(championshipId)
  }

  async getById(id: string) {
    const phase = await this.repo.findById(id)
    if (!phase) {
      throw new PhaseNotFoundError(id)
    }
    return phase
  }

  async create(input: CreatePhaseInput) {
    const existing = await this.repo.findByChampionshipId(input.championshipId)
    if (existing.some(p => p.order === input.order)) {
      throw new PhaseDuplicateOrderError(input.championshipId, input.order)
    }
    if (input.order > 1) {
      const previousPhase = existing.find(p => p.order === input.order - 1)
      const previousFinished = previousPhase ? await this.repo.isFinished(previousPhase.id) : false
      if (!previousFinished) {
        throw new PreviousPhaseNotFinishedError(input.championshipId, input.order)
      }
    }
    return this.repo.create(input)
  }

  async update(id: string, input: UpdatePhaseInput) {
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

  async getQualifiedTeams(phaseId: string): Promise<QualifiedTeam[]> {
    const phase = await this.getById(phaseId)
    const finished = await this.repo.isFinished(phaseId)
    if (!finished) {
      throw new PhaseNotFinishedError(phaseId)
    }

    const championship = await this.championshipRepo.findById(phase.championshipId)
    if (!championship) {
      throw new ChampionshipNotFoundError(phase.championshipId)
    }

    const groups = await this.groupRepo.findByPhaseId(phaseId)
    const maxRank = phase.qualification?.maxRank
    const qualifiedByGroup = await Promise.all(
      groups.map(async group => {
        const matches = await this.matchRepo.findByGroupId(group.id)
        const rows = calculateStandings(matches, group.teamIds, championship.pointsConfig)
        return rows
          .filter(row => maxRank !== undefined && row.rank <= maxRank)
          .map(row => ({ teamId: row.teamId, groupId: group.id, rank: row.rank }))
      })
    )
    return qualifiedByGroup.flat()
  }
}
