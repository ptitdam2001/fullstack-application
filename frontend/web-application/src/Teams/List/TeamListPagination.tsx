import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@repo/design-system'

type TeamListPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageNumbers(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i)
  }

  const pages: (number | 'ellipsis')[] = [0]

  if (page > 2) pages.push('ellipsis')

  const start = Math.max(1, page - 1)
  const end = Math.min(totalPages - 2, page + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (page < totalPages - 3) pages.push('ellipsis')

  pages.push(totalPages - 1)

  return pages
}

export const TeamListPagination = ({ page, totalPages, onPageChange }: TeamListPaginationProps) => {
  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={e => {
              e.preventDefault()
              if (page > 0) onPageChange(page - 1)
            }}
            aria-disabled={page === 0}
            className={page === 0 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        {pageNumbers.map((p, i) =>
          p === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={e => {
                  e.preventDefault()
                  onPageChange(p)
                }}
              >
                {p + 1}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={e => {
              e.preventDefault()
              if (page < totalPages - 1) onPageChange(page + 1)
            }}
            aria-disabled={page === totalPages - 1}
            className={page === totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
