import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DialogContent } from './DialogContent'
import { DialogTitle } from './DialogTitle'

describe('DialogContent (controlled, no Dialog/DialogTrigger wrapper)', () => {
  it('renders content when open is true', () => {
    render(
      <DialogContent open onOpenChange={vi.fn()}>
        <DialogTitle>Delete area</DialogTitle>
      </DialogContent>
    )
    expect(screen.getByRole('dialog', { name: 'Delete area' })).toBeInTheDocument()
  })

  it('does not render content when open is false', () => {
    render(
      <DialogContent open={false} onOpenChange={vi.fn()}>
        <DialogTitle>Delete area</DialogTitle>
      </DialogContent>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onOpenChange(false) when the built-in close button is pressed', () => {
    const onOpenChange = vi.fn()
    render(
      <DialogContent open onOpenChange={onOpenChange}>
        <DialogTitle>Delete area</DialogTitle>
      </DialogContent>
    )
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
