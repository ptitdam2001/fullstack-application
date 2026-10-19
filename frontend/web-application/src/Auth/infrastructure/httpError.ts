/** HTTP status of a failed API call (axios error), or undefined when no response came back. */
export const getHttpStatus = (err: unknown): number | undefined =>
  (err as { response?: { status?: number } } | null | undefined)?.response?.status

/** i18n key of a failed API call: the key of its status, or the fallback. */
export const getErrorKey = (err: unknown, keys: Partial<Record<number, string>>, fallback: string): string => {
  const status = getHttpStatus(err)
  return (status !== undefined && keys[status]) || fallback
}
