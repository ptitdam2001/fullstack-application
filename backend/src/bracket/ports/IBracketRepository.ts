import type { Bracket, CreateBracketInput } from '../domain/Bracket.js'

export interface IBracketRepository {
  findByPhaseId(phaseId: string): Promise<Bracket[]>
  findById(id: string): Promise<Bracket | null>
  create(input: CreateBracketInput): Promise<Bracket>
  hasPlayedMatches(id: string): Promise<boolean>
}
