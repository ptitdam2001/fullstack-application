import { describe, expect, it } from 'vitest'
import { parsePage, parsePageSize } from './pagination.js'

describe('parsePageSize', () => {
  it('returns the default when the value is missing', () => {
    expect(parsePageSize(undefined)).toBe(20)
  })

  it('returns the default when the value is not a number', () => {
    expect(parsePageSize('abc')).toBe(20)
  })

  it('returns the default when the value is zero or negative', () => {
    expect(parsePageSize('0')).toBe(20)
    expect(parsePageSize('-5')).toBe(20)
  })

  it('floors a fractional value', () => {
    expect(parsePageSize('3.7')).toBe(3)
  })

  it('clamps a value above the max to the max', () => {
    expect(parsePageSize('999999')).toBe(100)
  })

  it('clamps Infinity to the max instead of passing it through', () => {
    expect(parsePageSize('Infinity')).toBe(20)
  })

  it('honours a custom default and max', () => {
    expect(parsePageSize(undefined, 25, 50)).toBe(25)
    expect(parsePageSize('80', 25, 50)).toBe(50)
  })
})

describe('parsePage', () => {
  it('returns the min (default 1) when the value is missing', () => {
    expect(parsePage(undefined)).toBe(1)
  })

  it('returns the min when the value is not a number', () => {
    expect(parsePage('abc')).toBe(1)
  })

  it('returns the min when the value is below it', () => {
    expect(parsePage('-1')).toBe(1)
    expect(parsePage('0')).toBe(1)
  })

  it('floors a fractional value', () => {
    expect(parsePage('2.9')).toBe(2)
  })

  it('supports a 0-based min for offset-style pagination', () => {
    expect(parsePage(undefined, 0)).toBe(0)
    expect(parsePage('-1', 0)).toBe(0)
    expect(parsePage('0', 0)).toBe(0)
  })
})
