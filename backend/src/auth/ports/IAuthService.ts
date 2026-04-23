import type { TokenPayload } from '../domain/User.js'

export interface IAuthService {
  generateToken(userId: string, role: string): string
  verifyToken(token: string): TokenPayload
  hashPassword(password: string): Promise<string>
  comparePassword(password: string, hash: string): Promise<boolean>
}
