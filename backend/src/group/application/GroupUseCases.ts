import type { IGroupRepository } from '../ports/IGroupRepository.js'
import type { CreateGroupInput, UpdateGroupInput } from '../domain/Group.js'
import { GroupNotFoundError } from '../domain/GroupErrors.js'

export class GroupUseCases {
  constructor(private readonly repo: IGroupRepository) {}

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
    return this.repo.delete(id)
  }
}
