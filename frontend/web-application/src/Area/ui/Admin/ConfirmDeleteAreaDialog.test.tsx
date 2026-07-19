import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmDeleteAreaDialog } from './ConfirmDeleteAreaDialog'

describe('ConfirmDeleteAreaDialog', () => {
  const defaultProps = {
    name: 'Stade Pierre-Dupont',
    open: true,
    onOpenChange: vi.fn(),
    onConfirm: vi.fn(),
    isPending: false,
  }

  it('renders title and description', () => {
    render(<ConfirmDeleteAreaDialog {...defaultProps} />)
    expect(screen.getByText('adminAreas.delete.title')).toBeInTheDocument()
    expect(screen.getByText('adminAreas.delete.description')).toBeInTheDocument()
  })

  it('renders confirm and cancel buttons', () => {
    render(<ConfirmDeleteAreaDialog {...defaultProps} />)
    expect(screen.getByText('adminAreas.delete.confirm')).toBeInTheDocument()
    expect(screen.getByText('adminAreas.delete.cancel')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn()
    render(<ConfirmDeleteAreaDialog {...defaultProps} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('adminAreas.delete.confirm'))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('calls onOpenChange(false) when cancel is clicked', () => {
    const onOpenChange = vi.fn()
    render(<ConfirmDeleteAreaDialog {...defaultProps} onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByText('adminAreas.delete.cancel'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('disables confirm button when isPending', () => {
    render(<ConfirmDeleteAreaDialog {...defaultProps} isPending />)
    const button = screen.getByText('adminAreas.delete.confirm').closest('button')
    expect(button).toBeDisabled()
  })
})
