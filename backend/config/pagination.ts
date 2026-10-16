// Unbounded `count`/`limit` on paginated list routes let a client request the whole collection
// in one query. `Number.isFinite` also rejects `Infinity` (e.g. `?count=Infinity`), which a plain
// `Number(value) || default` lets through since Infinity is truthy.
export const parsePageSize = (value: unknown, defaultValue = 20, max = 100): number => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return defaultValue
  }
  return Math.min(Math.floor(parsed), max)
}

// Pages start at 1 (specifications/07-technical-choices.md › Pagination des listes).
export const parsePage = (value: unknown): number => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }
  return Math.floor(parsed)
}
