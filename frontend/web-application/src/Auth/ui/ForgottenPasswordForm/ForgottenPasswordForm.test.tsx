import { screen, fireEvent, act } from '@testing-library/react'
import { renderWithProviders } from '../../../../tests/test-utils'
import { ForgottenPasswordForm } from './ForgottenPasswordForm'

const { mockMutate, mockToast } = vi.hoisted(() => ({
  mockMutate: vi.fn(),
  mockToast: vi.fn(),
}))

vi.mock('../../infrastructure/useAuthApi', () => ({
  useForgotPassword: () => ({ mutate: mockMutate, isPending: false }),
}))

vi.mock('@repo/design-system', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@repo/design-system')>()
  return { ...actual, Toast: { useToast: () => mockToast } }
})

describe('ForgottenPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email field', () => {
    renderWithProviders(<ForgottenPasswordForm />)
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderWithProviders(<ForgottenPasswordForm />)
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
  })

  it('calls mutate with email on valid submit', async () => {
    renderWithProviders(<ForgottenPasswordForm />)

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@example.com' } })
      fireEvent.submit(screen.getByTestId('forgotten-password-form'))
    })

    expect(mockMutate).toHaveBeenCalledWith(
      { data: { email: 'user@example.com' } },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    )
  })

  it('calls onSent with email on success', async () => {
    mockMutate.mockImplementation((_: unknown, { onSuccess }: { onSuccess: () => void }) => onSuccess())
    const onSent = vi.fn()
    renderWithProviders(<ForgottenPasswordForm onSent={onSent} />)

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@example.com' } })
      fireEvent.submit(screen.getByTestId('forgotten-password-form'))
    })

    expect(onSent).toHaveBeenCalledWith('user@example.com')
  })

  it('shows error toast on mutation failure', async () => {
    mockMutate.mockImplementation((_: unknown, { onError }: { onError: () => void }) => onError())
    renderWithProviders(<ForgottenPasswordForm />)

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@example.com' } })
      fireEvent.submit(screen.getByTestId('forgotten-password-form'))
    })

    expect(mockToast).toHaveBeenCalledWith('Error sending password reset email')
  })
})
