/**
 * Password rules (specifications/10-inscription-et-authentification.md):
 * at least 8 characters, 1 digit and 1 uppercase letter.
 * Single source for the strength meter and for the client-side validation.
 */
export const PASSWORD_MIN_LENGTH = 8

export type PasswordStrength = 0 | 1 | 2 | 3

/** Number of password rules satisfied — 3 means the password is compliant. */
export const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0
  if (password.length >= PASSWORD_MIN_LENGTH) {
    score++
  }
  if (/[0-9]/.test(password)) {
    score++
  }
  if (/[A-Z]/.test(password)) {
    score++
  }
  return score as PasswordStrength
}

export const isPasswordCompliant = (password: string): boolean => getPasswordStrength(password) === 3
