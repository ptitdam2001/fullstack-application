/**
 * The errors `express.json()` (body-parser, raw-body) raises for a request it cannot read, by their
 * `type`, with the answer each one gets. They are the caller's mistake, not a server failure.
 *
 * The status and the message come from this table, never from the error: `err.status` and
 * `err.message` are not trusted (a parse error message quotes the body it failed on).
 *
 * `entity.inflate.failed` is not a body-parser type: body-parser forwards the zlib error of a corrupt
 * gzip/deflate body without a `type` (see `isInflateError`).
 */
const BODY_PARSER_ERRORS = {
  'entity.parse.failed': { status: 400, message: 'Malformed request body' },
  'entity.inflate.failed': { status: 400, message: 'Malformed compressed request body' },
  'request.size.invalid': { status: 400, message: 'Request body does not match its content length' },
  'request.aborted': { status: 400, message: 'Request aborted' },
  'entity.too.large': { status: 413, message: 'Request body too large' },
  'charset.unsupported': { status: 415, message: 'Unsupported charset' },
  'encoding.unsupported': { status: 415, message: 'Unsupported content encoding' },
} as const

export type BodyParserErrorType = keyof typeof BODY_PARSER_ERRORS

/** Same shape as `ErrorOutput` in openapi.yml. */
export type BodyParserErrorResponse = { status: number; message: string }

/**
 * A zlib error (`Z_DATA_ERROR`, `Z_BUF_ERROR`, …) that body-parser raised while inflating the request
 * body. body-parser stamps it with status 400: the status only tells this error apart from a zlib
 * failure of our own code, which must stay a 500. It never sets the status of the answer.
 */
const isInflateError = (err: Error): boolean => {
  const { code, status } = err as { code?: unknown; status?: unknown }
  return typeof code === 'string' && code.startsWith('Z_') && status === 400
}

/** The body-parser `type` of an error, or `undefined` when it is not a known body-parser error. */
export const bodyParserErrorType = (err: unknown): BodyParserErrorType | undefined => {
  if (!(err instanceof Error)) {
    return undefined
  }
  const { type } = err as { type?: unknown }
  if (typeof type === 'string' && Object.hasOwn(BODY_PARSER_ERRORS, type)) {
    return type as BodyParserErrorType
  }
  return isInflateError(err) ? 'entity.inflate.failed' : undefined
}

export const bodyParserErrorResponse = (type: BodyParserErrorType): BodyParserErrorResponse => ({
  ...BODY_PARSER_ERRORS[type],
})
