export class BracketNotFoundError extends Error {
  constructor(id: string) {
    super(`Bracket not found: ${id}`)
    this.name = 'BracketNotFoundError'
  }
}

export class BracketLockedError extends Error {
  constructor(id: string) {
    super(`Bracket ${id} is locked: a match already has a score`)
    this.name = 'BracketLockedError'
  }
}

export class BracketInvalidShapeError extends Error {
  constructor(message: string) {
    super(`Invalid bracket shape: ${message}`)
    this.name = 'BracketInvalidShapeError'
  }
}
