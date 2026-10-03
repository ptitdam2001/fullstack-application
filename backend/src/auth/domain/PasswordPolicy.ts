/**
 * Password rules (spec 10, Règles de mot de passe): at least 8 characters, 1 digit and 1 uppercase letter.
 * Single place for the rule on the server — any route that sets a password should go through it.
 */
export const PASSWORD_MIN_LENGTH = 8

export const isPasswordValid = (password: string): boolean =>
  password.length >= PASSWORD_MIN_LENGTH && /\d/.test(password) && /\p{Lu}/u.test(password)
