export class UserNotFoundError extends Error {
  constructor() {
    super('User not found')
    this.name = 'UserNotFoundError'
  }
}

/** An admin cannot revoke their own admin role (spec 06) — avoids locking the platform out by mistake. */
export class CannotSelfDemoteError extends Error {
  constructor() {
    super('An admin cannot revoke their own admin role')
    this.name = 'CannotSelfDemoteError'
  }
}

/** An admin cannot delete their own account (spec 06) — same lockout risk as a self-demote. */
export class CannotSelfDeleteError extends Error {
  constructor() {
    super('An admin cannot delete their own account')
    this.name = 'CannotSelfDeleteError'
  }
}
