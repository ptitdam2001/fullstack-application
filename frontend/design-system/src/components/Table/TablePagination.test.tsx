import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TablePagination } from './TablePagination'

const defaultProps = {
  count: 100,
  page: 1,
  rowsPerPage: 10,
  onPageChange: vi.fn(),
}

describe('TablePagination', () => {
  it('sets data-slot', () => {
    const { container } = render(<TablePagination {...defaultProps} />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'table-pagination')
  })

  it('renders page range info', () => {
    render(<TablePagination {...defaultProps} />)
    expect(screen.getByText('11–20 / 100')).toBeInTheDocument()
  })

  it('disables prev button on first page', () => {
    render(<TablePagination {...defaultProps} page={0} />)
    const [prevBtn] = screen.getAllByRole('button')
    expect(prevBtn).toHaveAttribute('data-disabled')
  })

  it('disables next button on last page', () => {
    render(<TablePagination {...defaultProps} page={9} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[1]).toHaveAttribute('data-disabled')
  })

  it('calls onPageChange(page - 1) on prev click', () => {
    const onPageChange = vi.fn()
    render(<TablePagination {...defaultProps} page={2} onPageChange={onPageChange} />)
    const [prevBtn] = screen.getAllByRole('button')
    fireEvent.click(prevBtn)
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('calls onPageChange(page + 1) on next click', () => {
    const onPageChange = vi.fn()
    render(<TablePagination {...defaultProps} page={1} onPageChange={onPageChange} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1])
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('renders custom rowsPerPageOptions', () => {
    render(<TablePagination {...defaultProps} rowsPerPageOptions={[5, 20]} />)
    expect(screen.getByRole('option', { name: '5' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '20' })).toBeInTheDocument()
  })

  it('disables the rows-per-page select when onRowsPerPageChange is not provided', () => {
    render(<TablePagination {...defaultProps} />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('enables the rows-per-page select when onRowsPerPageChange is provided', () => {
    render(<TablePagination {...defaultProps} onRowsPerPageChange={vi.fn()} />)
    expect(screen.getByRole('combobox')).toBeEnabled()
  })

  it('calls onRowsPerPageChange when a new option is selected', () => {
    const onRowsPerPageChange = vi.fn()
    render(<TablePagination {...defaultProps} onRowsPerPageChange={onRowsPerPageChange} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '25' } })
    expect(onRowsPerPageChange).toHaveBeenCalled()
  })
})
