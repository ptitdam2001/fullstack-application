import { describe, expect, it } from 'vitest'
import { bodyParserErrorResponse, bodyParserErrorType } from './bodyParserErrors'

const errorOfType = (type: unknown, extra: object = {}): Error => Object.assign(new Error('boom'), { type, ...extra })

describe('bodyParserErrorType', () => {
  it.each([
    'entity.parse.failed',
    'entity.too.large',
    'charset.unsupported',
    'encoding.unsupported',
    'request.size.invalid',
    'request.aborted',
  ])('recognises %s', type => {
    expect(bodyParserErrorType(errorOfType(type))).toBe(type)
  })

  it.each(['Z_DATA_ERROR', 'Z_BUF_ERROR'])('recognises the zlib error %s of a corrupt compressed body', code => {
    const err = Object.assign(new Error('incorrect header check'), { code, errno: -3, status: 400 })

    expect(bodyParserErrorType(err)).toBe('entity.inflate.failed')
  })

  it.each([
    ['an error without a type', new Error('boom')],
    ['a zlib error raised outside the body parser', Object.assign(new Error('boom'), { code: 'Z_DATA_ERROR' })],
    ['a non-zlib error code with a 400 status', Object.assign(new Error('boom'), { code: 'ECONNRESET', status: 400 })],
    ['an error with an unknown type', errorOfType('entity.verify.failed', { status: 403 })],
    ['an error whose type is an Object.prototype key', errorOfType('toString')],
    ['an error with a non-string type', errorOfType(413)],
    ['an error carrying only a status', Object.assign(new Error('boom'), { status: 400 })],
    ['a plain object', { type: 'entity.too.large' }],
    ['null', null],
    ['a string', 'entity.too.large'],
  ])('ignores %s', (_label, err) => {
    expect(bodyParserErrorType(err)).toBeUndefined()
  })
})

describe('bodyParserErrorResponse', () => {
  it.each([
    ['entity.parse.failed', 400],
    ['entity.inflate.failed', 400],
    ['request.size.invalid', 400],
    ['request.aborted', 400],
    ['entity.too.large', 413],
    ['charset.unsupported', 415],
    ['encoding.unsupported', 415],
  ] as const)('answers %s with %d', (type, status) => {
    const response = bodyParserErrorResponse(type)
    expect(response.status).toBe(status)
    expect(response.message).toEqual(expect.any(String))
    expect(Object.keys(response)).toEqual(['status', 'message'])
  })
})
