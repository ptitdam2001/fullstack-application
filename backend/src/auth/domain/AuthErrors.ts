export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials')
    this.name = 'InvalidCredentialsError'
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super('Forbidden')
    this.name = 'ForbiddenError'
  }
}

export class EmailAlreadyInUseError extends Error {
  constructor() {
    super('Email already in use')
    this.name = 'EmailAlreadyInUseError'
  }
}

/** The current password given to change it is wrong. Not an authentication failure: the caller is signed in. */
export class WrongCurrentPasswordError extends Error {
  constructor() {
    super('Current password is incorrect')
    this.name = 'WrongCurrentPasswordError'
  }
}

/** The new password breaks the password rules (spec 10). */
export class WeakPasswordError extends Error {
  constructor() {
    super('Password does not meet the password rules')
    this.name = 'WeakPasswordError'
  }
}

export class AccountBlockedError extends Error {
  constructor() {
    super('Account is blocked')
    this.name = 'AccountBlockedError'
  }
}

export class AccountInactiveError extends Error {
  constructor() {
    super('Account is not active')
    this.name = 'AccountInactiveError'
  }
}
