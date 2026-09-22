import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { IAuthService } from '../ports/IAuthService.js'
import type { TokenPayload } from '../domain/User.js'

const MIN_SECRET_LENGTH = 16
// The exact placeholder shipped in .env.sample — copying that file to .env without
// changing it must not produce a working, forgeable-JWT deployment.
const SAMPLE_PLACEHOLDER = 'mySecret'

export class JwtAuthService implements IAuthService {
  private readonly secret: string
  private readonly expiresIn: number

  constructor() {
    const secret = process.env.JWT_SECRET
    if (!secret || secret.length < MIN_SECRET_LENGTH || secret === SAMPLE_PLACEHOLDER) {
      throw new Error(
        `JWT_SECRET must be set to a value of at least ${MIN_SECRET_LENGTH} characters, other than the .env.sample placeholder`
      )
    }
    this.secret = secret
    this.expiresIn = Number(process.env.JWT_EXPIRE || 7200)
  }

  generateToken(userId: string, isAdmin: boolean, isCoach: boolean): string {
    return jwt.sign({ userId, isAdmin, isCoach }, this.secret, { expiresIn: this.expiresIn })
  }

  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, this.secret) as TokenPayload
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
