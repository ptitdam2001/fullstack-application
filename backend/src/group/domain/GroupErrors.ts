export class GroupNotFoundError extends Error {
  constructor(id: string) {
    super(`Group not found: ${id}`)
    this.name = 'GroupNotFoundError'
  }
}
