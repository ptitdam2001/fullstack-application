import { JwtAuthService } from '../../src/auth/infrastructure/JwtAuthService'

/**
 * Forges a valid JWT directly via the production `IAuthService`, bypassing
 * `POST /login` — faster and avoids coupling every test to credential flow.
 * `JWT_SECRET` is provided by `vitest.functional.config.ts` (test.env), so
 * tokens are verifiable by `createApp`'s `jwtAuth` security handler.
 * `tokenVersion` must match the user's (0 for a fixture whose password never changed).
 */
export const authHeaderFor = (
  userId: string,
  isAdmin = false,
  isCoach = false,
  tokenVersion = 0
): { Authorization: string } => {
  const authService = new JwtAuthService()
  return { Authorization: `Bearer ${authService.generateToken(userId, isAdmin, isCoach, tokenVersion)}` }
}
