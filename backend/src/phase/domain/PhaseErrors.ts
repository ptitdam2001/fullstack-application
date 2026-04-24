export class PhaseNotFoundError extends Error {
  constructor(id: string) {
    super(`Phase not found: ${id}`)
    this.name = 'PhaseNotFoundError'
  }
}
