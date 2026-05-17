export class JoinRequestNotFoundError extends Error {
  constructor() {
    super('Join request not found')
    this.name = 'JoinRequestNotFoundError'
  }
}

export class JoinRequestNotPendingError extends Error {
  constructor() {
    super('Join request is not pending')
    this.name = 'JoinRequestNotPendingError'
  }
}

export class AlreadyMemberError extends Error {
  constructor() {
    super('User is already a member of this team')
    this.name = 'AlreadyMemberError'
  }
}