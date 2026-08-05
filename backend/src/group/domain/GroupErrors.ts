export class GroupNotFoundError extends Error {
  constructor(id: string) {
    super(`Group not found: ${id}`)
    this.name = 'GroupNotFoundError'
  }
}

export class GroupLockedError extends Error {
  constructor(id: string) {
    super(`Group ${id} is locked: a match already has a score`)
    this.name = 'GroupLockedError'
  }
}
