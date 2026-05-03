import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from './Alert'

describe('Alert', () => {
  it('sets data-slot="alert"', () => {
    const { container } = render(<Alert />)
    expect(container.querySelector('[data-slot="alert"]')).toBeInTheDocument()
  })

  it('has role="alert"', () => {
    render(<Alert>Message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<Alert className="custom" />)
    expect(container.querySelector('[data-slot="alert"]')).toHaveClass('custom')
  })

  it('renders children', () => {
    render(<Alert>Alert content</Alert>)
    expect(screen.getByText('Alert content')).toBeInTheDocument()
  })

  it('applies destructive variant', () => {
    const { container } = render(<Alert variant="destructive" />)
    expect(container.querySelector('[data-slot="alert"]')).toHaveClass('text-destructive')
  })
})

describe('AlertTitle', () => {
  it('sets data-slot="alert-title"', () => {
    const { container } = render(<Alert><AlertTitle>Title</AlertTitle></Alert>)
    expect(container.querySelector('[data-slot="alert-title"]')).toBeInTheDocument()
  })

  it('renders title text', () => {
    render(<Alert><AlertTitle>Erreur de connexion</AlertTitle></Alert>)
    expect(screen.getByText('Erreur de connexion')).toBeInTheDocument()
  })
})

describe('AlertDescription', () => {
  it('sets data-slot="alert-description"', () => {
    const { container } = render(<Alert><AlertDescription>Desc</AlertDescription></Alert>)
    expect(container.querySelector('[data-slot="alert-description"]')).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<Alert><AlertDescription>Détails de l&apos;erreur</AlertDescription></Alert>)
    expect(screen.getByText("Détails de l'erreur")).toBeInTheDocument()
  })
})
