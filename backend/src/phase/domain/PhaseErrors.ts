export class PhaseNotFoundError extends Error {
  constructor(id: string) {
    super(`Phase not found: ${id}`)
    this.name = 'PhaseNotFoundError'
  }
}

export class PhaseDuplicateOrderError extends Error {
  constructor(championshipId: string, order: number) {
    super(`Phase with order ${order} already exists in championship ${championshipId}`)
    this.name = 'PhaseDuplicateOrderError'
  }
}
