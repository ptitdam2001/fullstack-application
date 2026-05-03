import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('renders trigger children', () => {
    render(<Tooltip content="tip"><button>Trigger</button></Tooltip>)
    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument()
  })

  it('tooltip not visible by default', () => {
    render(<Tooltip content="tip"><button>Trigger</button></Tooltip>)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('renders string content (not visible until hover/focus)', () => {
    render(<Tooltip content="My tooltip text"><button>Trigger</button></Tooltip>)
    expect(screen.queryByText('My tooltip text')).not.toBeInTheDocument()
  })

  it('renders rich content (not visible until hover/focus)', () => {
    render(
      <Tooltip content={<span data-testid="rich">Rich content</span>}>
        <button>Trigger</button>
      </Tooltip>
    )
    expect(screen.queryByTestId('rich')).not.toBeInTheDocument()
  })
})
