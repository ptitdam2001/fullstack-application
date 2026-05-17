export class EmailAlreadyUsedError extends Error {
  constructor() {
    super('Email already in use')
    this.name = 'EmailAlreadyUsedError'
  }
}

export class InvalidTokenError extends Error {
  constructor() {
    super('Token invalide ou expiré')
    this.name = 'InvalidTokenError'
  }
}

export class AccountInactiveError extends Error {
  constructor() {
    super('Account is not active')
    this.name = 'AccountInactiveError'
  }
}

export class AccountBlockedError extends Error {
  constructor() {
    super('Account is blocked')
    this.name = 'AccountBlockedError'
  }
}
