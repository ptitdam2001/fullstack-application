import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { toast as sonnerToast } from 'sonner'
import { Toast } from './Toast'

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}))

vi.mock('sonner', async () => {
  const mockToast = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn(),
  })
  return {
    toast: mockToast,
    Toaster: () => <div data-testid="toaster" />,
  }
})

describe('Toast.Provider', () => {
  it('renders children', () => {
    render(
      <Toast.Provider>
        <span>hello</span>
      </Toast.Provider>,
    )
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('renders Toaster', () => {
    render(
      <Toast.Provider>
        <span />
      </Toast.Provider>,
    )
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })
})

describe('Toast.useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns sonner toast function', () => {
    expect(Toast.useToast()).toBe(sonnerToast)
  })

  it('calls toast with message', () => {
    const notify = Toast.useToast()
    notify('hello')
    expect(sonnerToast).toHaveBeenCalledWith('hello')
  })

  it('calls toast with message and options', () => {
    const notify = Toast.useToast()
    const options = { description: 'Details here' }
    notify('hello', options)
    expect(sonnerToast).toHaveBeenCalledWith('hello', options)
  })

  it('supports success variant', () => {
    const notify = Toast.useToast()
    notify.success('Saved!')
    expect(sonnerToast.success).toHaveBeenCalledWith('Saved!')
  })

  it('supports error variant', () => {
    const notify = Toast.useToast()
    notify.error('Failed!')
    expect(sonnerToast.error).toHaveBeenCalledWith('Failed!')
  })

  it('supports warning variant', () => {
    const notify = Toast.useToast()
    notify.warning('Watch out!')
    expect(sonnerToast.warning).toHaveBeenCalledWith('Watch out!')
  })

  it('supports loading variant', () => {
    const notify = Toast.useToast()
    notify.loading('Processing...')
    expect(sonnerToast.loading).toHaveBeenCalledWith('Processing...')
  })

  it('supports dismiss', () => {
    const notify = Toast.useToast()
    notify.dismiss()
    expect(sonnerToast.dismiss).toHaveBeenCalled()
  })
})
