/**
 * The errors `express.json()` (body-parser, raw-body) raises for a request it cannot read, by their
 * `type`, with the answer each one gets. They are the caller's mistake, not a server failure.
 *
 * The status and the message come from this table, never from the error: `err.status` and
 * `err.message` are not trusted (a parse error message quotes the body it failed on).
 */
const BODY_PARSER_ERRORS = {
  'entity.parse.failed': { status: 400, message: 'Malformed request body' },
  'request.size.invalid': { status: 400, message: 'Request body does not match its content length' },
  'request.aborted': { status: 400, message: 'Request aborted' },
  'entity.too.large': { status: 413, message: 'Request body too large' },
  'charset.unsupported': { status: 415, message: 'Unsupported charset' },
  'encoding.unsupported': { status: 415, message: 'Unsupported content encoding' },
} as const

export type BodyParserErrorType = keyof typeof BODY_PARSER_ERRORS

/** Same shape as `ErrorOutput` in openapi.yml. */
export type BodyParserErrorResponse = { status: number; message: string }

/** The body-parser `type` of an error, or `undefined` when it is not a known body-parser error. */
export const bodyParserErrorType = (err: unknown): BodyParserErrorType | undefined => {
  if (!(err instanceof Error)) {
    return undefined
  }
  const { type } = err as { type?: unknown }
  return typeof type === 'string' && Object.hasOwn(BODY_PARSER_ERRORS, type) ? (type as BodyParserErrorType) : undefined
}

export const bodyParserErrorResponse = (type: BodyParserErrorType): BodyParserErrorResponse => ({
  ...BODY_PARSER_ERRORS[type],
})
