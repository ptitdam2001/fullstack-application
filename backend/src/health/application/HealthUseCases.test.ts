import { describe, it, expect } from 'vitest'
import { HealthUseCases } from './HealthUseCases.js'

describe('HealthUseCases.check', () => {
  it('returns ok status', () => {
    expect(new HealthUseCases().check()).toEqual({ status: 'ok' })
  })
})
