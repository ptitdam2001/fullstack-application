import { vi } from 'vitest'
import { screen, fireEvent, act } from '@testing-library/react'
import { renderWithProviders } from '../../../tests/test-utils'
import { SigninForm } from './SigninForm'

const { mockProcess, mockUseLoginAction } = vi.hoisted(() => {
  const mockProcess = vi.fn()
  const mockUseLoginAction = vi.fn(() => ({ process: mockProcess, isPending: false, isError: false, isSuccess: false }))
  return { mockProcess, mockUseLoginAction }
})

vi.mock('../application/AuthProvider', () => ({
  AuthProvider: {
    useAuthValue: vi.fn(() => ({ user: undefined, token: undefined })),
    useAuthDispatch: vi.fn(() => vi.fn()),
  },
}))

vi.mock('../application/useLoginAction', () => ({
  useLoginAction: mockUseLoginAction,
}))

describe('SigninForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLoginAction.mockReturnValue({ process: mockProcess, isPending: false, isError: false, isSuccess: false })
  })

  it('renders email and password fields', () => {
    renderWithProviders(<SigninForm />)

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
  })

  it('renders forgot password link when prop provided', () => {
    renderWithProviders(<SigninForm forgotPasswordPath="/auth/forgotten-password" />)

    expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
  })

  it('does not render forgot password link by default', () => {
    renderWithProviders(<SigninForm />)

    expect(screen.queryByText(/forgot password/i)).not.toBeInTheDocument()
  })

  it('shows spinner when pending', () => {
    mockUseLoginAction.mockReturnValue({ process: mockProcess, isPending: true, isError: false, isSuccess: false })

    renderWithProviders(<SigninForm />)

    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
  })

  it('calls login on submit', async () => {
    renderWithProviders(<SigninForm />)

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@test.com' } })
      fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'secret123' } })
      fireEvent.submit(screen.getByTestId('signin-form'))
    })

    expect(mockProcess).toHaveBeenCalledWith('test@test.com', 'secret123')
  })
})
