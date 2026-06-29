import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDeleteAgeCategoryDialog } from './ConfirmDeleteAgeCategoryDialog'

describe('ConfirmDeleteAgeCategoryDialog', () => {
  const defaultProps = {
    label: 'U13',
    open: true,
    onOpenChange: vi.fn(),
    onConfirm: vi.fn(),
    isPending: false,
  }

  it('renders title and description', () => {
    render(<ConfirmDeleteAgeCategoryDialog {...defaultProps} />)
    expect(screen.getByText('adminAgeCategories.delete.title')).toBeInTheDocument()
    expect(screen.getByText('adminAgeCategories.delete.description')).toBeInTheDocument()
  })

  it('renders confirm and cancel buttons', () => {
    render(<ConfirmDeleteAgeCategoryDialog {...defaultProps} />)
    expect(screen.getByText('adminAgeCategories.delete.confirm')).toBeInTheDocument()
    expect(screen.getByText('adminAgeCategories.delete.cancel')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn()
    render(<ConfirmDeleteAgeCategoryDialog {...defaultProps} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('adminAgeCategories.delete.confirm'))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('calls onOpenChange(false) when cancel is clicked', () => {
    const onOpenChange = vi.fn()
    render(<ConfirmDeleteAgeCategoryDialog {...defaultProps} onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByText('adminAgeCategories.delete.cancel'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('disables confirm button when isPending', () => {
    render(<ConfirmDeleteAgeCategoryDialog {...defaultProps} isPending />)
    const button = screen.getByText('adminAgeCategories.delete.confirm').closest('button')
    expect(button).toBeDisabled()
  })
})
