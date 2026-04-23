export class ChampionshipNotFoundError extends Error {
  constructor(id: string) {
    super(`Championship not found: ${id}`)
    this.name = 'ChampionshipNotFoundError'
  }
}
