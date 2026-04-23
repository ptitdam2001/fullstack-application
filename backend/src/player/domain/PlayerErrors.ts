export class PlayerNotFoundError extends Error {
  constructor(id: string) {
    super(`Player not found: ${id}`)
    this.name = 'PlayerNotFoundError'
  }
}
