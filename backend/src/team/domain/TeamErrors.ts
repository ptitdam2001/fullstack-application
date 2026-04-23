export class TeamNotFoundError extends Error {
  constructor(id: string) {
    super(`Team not found: ${id}`)
    this.name = 'TeamNotFoundError'
  }
}
