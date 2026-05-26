import type { Phase, CreatePhaseInput, UpdatePhaseInput } from '../domain/Phase.js'

export interface IPhaseRepository {
  findByChampionshipId(championshipId: string): Promise<Phase[]>
  findById(id: string): Promise<Phase | null>
  create(input: CreatePhaseInput): Promise<Phase>
  update(id: string, input: UpdatePhaseInput): Promise<Phase>
  delete(id: string): Promise<void>
  softDelete(id: string): Promise<void>
  hasPlayedMatches(id: string): Promise<boolean>
}
