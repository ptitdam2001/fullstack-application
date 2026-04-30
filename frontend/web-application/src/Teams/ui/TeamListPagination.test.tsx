import { render, screen, fireEvent } from '@testing-library/react'
import { TeamListPagination } from './TeamListPagination'

describe('TeamListPagination', () => {
  it('renders nothing when totalPages <= 1', () => {
    const { container } = render(
      <TeamListPagination page={0} totalPages={1} onPageChange={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders pagination when totalPages > 1', () => {
    render(<TeamListPagination page={0} totalPages={3} onPageChange={() => {}} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('disables Previous on first page', () => {
    render(<TeamListPagination page={0} totalPages={3} onPageChange={() => {}} />)
    expect(screen.getByRole('link', { name: /previous/i })).toHaveClass('pointer-events-none')
  })

  it('disables Next on last page', () => {
    render(<TeamListPagination page={2} totalPages={3} onPageChange={() => {}} />)
    expect(screen.getByRole('link', { name: /next/i })).toHaveClass('pointer-events-none')
  })

  it('calls onPageChange when clicking Next', () => {
    const onPageChange = vi.fn()
    render(<TeamListPagination page={0} totalPages={3} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByRole('link', { name: /next/i }))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('calls onPageChange when clicking Previous', () => {
    const onPageChange = vi.fn()
    render(<TeamListPagination page={1} totalPages={3} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByRole('link', { name: /previous/i }))
    expect(onPageChange).toHaveBeenCalledWith(0)
  })

  it('marks current page as active', () => {
    render(<TeamListPagination page={1} totalPages={3} onPageChange={() => {}} />)
    const page2 = screen.getByRole('link', { name: '2' })
    expect(page2).toHaveAttribute('aria-current', 'page')
  })
})
