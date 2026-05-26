import type { Group, CreateGroupInput, UpdateGroupInput } from '../domain/Group.js'

export interface IGroupRepository {
  findByPhaseId(phaseId: string): Promise<Group[]>
  findById(id: string): Promise<Group | null>
  create(input: CreateGroupInput): Promise<Group>
  update(id: string, input: UpdateGroupInput): Promise<Group>
  delete(id: string): Promise<void>
  softDelete(id: string): Promise<void>
  hasPlayedMatches(id: string): Promise<boolean>
}
