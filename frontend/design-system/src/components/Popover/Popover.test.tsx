import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Popover } from './Popover'
import { PopoverContent } from './PopoverContent'
import { PopoverTrigger } from './PopoverTrigger'

function Fixture({ open }: { open?: boolean }) {
  return (
    <Popover open={open}>
      <PopoverTrigger>
        {(triggerProps) => <button {...triggerProps}>Open</button>}
      </PopoverTrigger>
      <PopoverContent>Popover content</PopoverContent>
    </Popover>
  )
}

describe('Popover', () => {
  it('renders the trigger', () => {
    render(<Fixture />)
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('renders content when open=true', () => {
    render(<Fixture open={true} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Popover content')).toBeInTheDocument()
  })

  it('hides content when closed', () => {
    render(<Fixture open={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('PopoverContent', () => {
  it('has data-slot="popover-content"', () => {
    render(<Fixture open={true} />)
    expect(document.querySelector('[data-slot="popover-content"]')).toBeInTheDocument()
  })

  it('forwards className', () => {
    render(
      <Popover open={true}>
        <PopoverTrigger>
          {(triggerProps) => <button {...triggerProps}>Open</button>}
        </PopoverTrigger>
        <PopoverContent className="custom-class">Content</PopoverContent>
      </Popover>
    )
    expect(document.querySelector('[data-slot="popover-content"]')).toHaveClass('custom-class')
  })
})
