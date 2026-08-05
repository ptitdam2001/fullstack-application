import type { IGroupRepository } from '../ports/IGroupRepository.js'
import type { IMatchRepository } from '../../match/ports/IMatchRepository.js'
import type { CreateGroupInput, UpdateGroupInput } from '../domain/Group.js'
import { GroupNotFoundError, GroupLockedError } from '../domain/GroupErrors.js'
import { roundRobin } from './roundRobin.js'

export class GroupUseCases {
  constructor(
    private readonly repo: IGroupRepository,
    private readonly matchRepo: IMatchRepository
  ) {}

  getByPhaseId(phaseId: string) {
    return this.repo.findByPhaseId(phaseId)
  }

  async getById(id: string) {
    const group = await this.repo.findById(id)
    if (!group) throw new GroupNotFoundError(id)
    return group
  }

  create(input: CreateGroupInput) {
    return this.repo.create(input)
  }

  async update(id: string, input: UpdateGroupInput) {
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

  async generateMatches(groupId: string) {
    const group = await this.getById(groupId)
    const locked = await this.repo.hasPlayedMatches(groupId)
    if (locked) {
      throw new GroupLockedError(groupId)
    }

    const existingMatches = await this.matchRepo.findByGroupId(groupId)
    await Promise.all(existingMatches.map(match => this.matchRepo.delete(match.id)))

    const pairs = roundRobin(group.teamIds, group.matchMode)
    return Promise.all(
      pairs.map(pair =>
        this.matchRepo.create({
          groupId,
          bracketId: null,
          round: null,
          bracketPosition: null,
          homeTeamId: pair.homeTeamId,
          awayTeamId: pair.awayTeamId,
          area: null,
          scheduledAt: null,
          homeGoals: null,
          awayGoals: null,
          forfeitedBy: null,
        })
      )
    )
  }
}
