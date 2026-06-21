import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'

describe('ConfirmDeleteDialog', () => {
  const defaultProps = {
    teamName: 'Les Rouges',
    open: true,
    onOpenChange: vi.fn(),
    onConfirm: vi.fn(),
    isPending: false,
  }

  it('renders the dialog title and description', () => {
    render(<ConfirmDeleteDialog {...defaultProps} />)
    expect(screen.getByText('adminTeams.delete.title')).toBeInTheDocument()
    expect(screen.getByText('adminTeams.delete.description')).toBeInTheDocument()
  })

  it('renders confirm and cancel buttons', () => {
    render(<ConfirmDeleteDialog {...defaultProps} />)
    expect(screen.getByText('adminTeams.delete.confirm')).toBeInTheDocument()
    expect(screen.getByText('adminTeams.delete.cancel')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn()
    render(<ConfirmDeleteDialog {...defaultProps} onConfirm={onConfirm} />)

    fireEvent.click(screen.getByText('adminTeams.delete.confirm'))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('calls onOpenChange when cancel button is clicked', () => {
    const onOpenChange = vi.fn()
    render(<ConfirmDeleteDialog {...defaultProps} onOpenChange={onOpenChange} />)

    fireEvent.click(screen.getByText('adminTeams.delete.cancel'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('disables confirm button when isPending', () => {
    render(<ConfirmDeleteDialog {...defaultProps} isPending={true} />)
    const confirmButton = screen.getByText('adminTeams.delete.confirm').closest('button')
    expect(confirmButton).toBeDisabled()
  })
})
