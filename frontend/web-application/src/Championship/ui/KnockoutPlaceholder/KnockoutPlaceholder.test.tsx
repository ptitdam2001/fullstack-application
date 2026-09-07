import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KnockoutPlaceholder } from './KnockoutPlaceholder'

describe('KnockoutPlaceholder', () => {
  it('renders the title and placeholder message', () => {
    render(<KnockoutPlaceholder />)
    expect(screen.getByText('championshipDetail.knockout.title')).toBeInTheDocument()
    expect(screen.getByText('championshipDetail.knockout.placeholder')).toBeInTheDocument()
  })
})
