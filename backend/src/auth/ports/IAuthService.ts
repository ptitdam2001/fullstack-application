import type { TokenPayload } from '../domain/User.js'

export interface IAuthService {
  generateToken(userId: string, isAdmin: boolean): string
  verifyToken(token: string): TokenPayload
  hashPassword(password: string): Promise<string>
  comparePassword(password: string, hash: string): Promise<boolean>
}
