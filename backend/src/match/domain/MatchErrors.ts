export class MatchNotFoundError extends Error {
  constructor(id: string) {
    super(`Match not found: ${id}`)
    this.name = 'MatchNotFoundError'
  }
}
