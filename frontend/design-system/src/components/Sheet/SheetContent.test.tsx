import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SheetContent } from './SheetContent'
import { SheetTitle } from './SheetTitle'

describe('SheetContent (controlled, no Sheet/DialogTrigger wrapper)', () => {
  it('renders content when open is true', () => {
    render(
      <SheetContent open onOpenChange={vi.fn()}>
        <SheetTitle>Edit team</SheetTitle>
      </SheetContent>
    )
    expect(screen.getByText('Edit team')).toBeInTheDocument()
  })

  it('does not render content when open is false', () => {
    render(
      <SheetContent open={false} onOpenChange={vi.fn()}>
        <SheetTitle>Edit team</SheetTitle>
      </SheetContent>
    )
    expect(screen.queryByText('Edit team')).not.toBeInTheDocument()
  })

  it('calls onOpenChange(false) when the built-in close button is pressed', () => {
    const onOpenChange = vi.fn()
    render(
      <SheetContent open onOpenChange={onOpenChange}>
        <SheetTitle>Edit team</SheetTitle>
      </SheetContent>
    )
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})