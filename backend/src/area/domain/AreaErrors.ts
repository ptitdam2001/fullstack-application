export class AreaNotFoundError extends Error {
  constructor(id: string) {
    super(`Area not found: ${id}`)
    this.name = 'AreaNotFoundError'
  }
}
