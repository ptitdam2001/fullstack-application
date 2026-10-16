// Pagination of the list routes, shared by every repository port.
// `page` starts at 1, `count` is the page size (specifications/07-technical-choices.md › Pagination des listes).
export type PaginationOptions = { page: number; count: number }
