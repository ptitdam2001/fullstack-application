import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { IAuthService } from '../ports/IAuthService.js'
import type { TokenPayload } from '../domain/User.js'

export class JwtAuthService implements IAuthService {
  private readonly secret: string
  private readonly expiresIn: number

  constructor() {
    this.secret = process.env.JWT_SECRET as string
    this.expiresIn = Number(process.env.JWT_EXPIRES || 7200)
  }

  generateToken(userId: string, role: string): string {
    return jwt.sign({ data: userId, role }, this.secret, { expiresIn: this.expiresIn })
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
