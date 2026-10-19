/** HTTP status of a failed API call (axios error), or undefined when no response came back. */
export const getHttpStatus = (err: unknown): number | undefined =>
  (err as { response?: { status?: number } } | null | undefined)?.response?.status
