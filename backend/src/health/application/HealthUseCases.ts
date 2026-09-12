import type { HealthStatus } from '../domain/HealthStatus.js'

export class HealthUseCases {
  check(): HealthStatus {
    return { status: 'ok' }
  }
}
