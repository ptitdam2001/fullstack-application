import { screen, fireEvent, act } from '@testing-library/react'
import { renderWithProviders } from '../../../../tests/test-utils'
import { RegisterForm } from './RegisterForm'

// react-intl is mocked globally via __mocks__/react-intl.tsx
// FormattedMessage renders the id, useIntl().formatMessage returns the id
// → assert on i18n keys, not translated strings

const { mockToast, mockMutateAsync, mockUseRegister } = vi.hoisted(() => {
  const mockToast = vi.fn()
  const mockMutateAsync = vi.fn()
  const mockUseRegister = vi.fn(() => ({ mutateAsync: mockMutateAsync }))
  return { mockToast, mockMutateAsync, mockUseRegister }
})

vi.mock('@Sdk/teams/teams', () => ({
  useGetTeams: vi.fn(() => ({ data: [{ id: 'team-1', name: 'Équipe Alpha' }] })),
}))

vi.mock('@repo/design-system', async importOriginal => {
  const actual = await importOriginal<typeof import('@repo/design-system')>()
  return { ...actual, Toast: { useToast: () => mockToast } }
})

vi.mock('@Auth/infrastructure/useAuthApi', () => ({
  useRegister: mockUseRegister,
}))

const VALID_FIELDS = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!',
}

async function fillAndSubmit(overrides: Partial<typeof VALID_FIELDS> = {}) {
  const values = { ...VALID_FIELDS, ...overrides }
  await act(async () => {
    fireEvent.change(screen.getByLabelText('register.field.firstName'), { target: { value: values.firstName } })
    fireEvent.change(screen.getByLabelText('register.field.lastName'), { target: { value: values.lastName } })
    fireEvent.change(screen.getByLabelText('register.field.email'), { target: { value: values.email } })
    fireEvent.change(screen.getByLabelText('register.field.password'), { target: { value: values.password } })
    fireEvent.change(screen.getByLabelText('register.field.confirmPassword'), { target: { value: values.confirmPassword } })
    fireEvent.submit(screen.getByTestId('register-form'))
  })
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMutateAsync.mockResolvedValue({})
  })

  describe('rendering', () => {
    it('renders all form fields', () => {
      renderWithProviders(<RegisterForm />)
      expect(screen.getByLabelText('register.field.team')).toBeInTheDocument()
      expect(screen.getByLabelText('register.field.firstName')).toBeInTheDocument()
      expect(screen.getByLabelText('register.field.lastName')).toBeInTheDocument()
      expect(screen.getByLabelText('register.field.email')).toBeInTheDocument()
      expect(screen.getByLabelText('register.field.password')).toBeInTheDocument()
      expect(screen.getByLabelText('register.field.confirmPassword')).toBeInTheDocument()
    })

    it('renders team options from API', () => {
      renderWithProviders(<RegisterForm />)
      expect(screen.getByText('Équipe Alpha')).toBeInTheDocument()
    })

    it('renders submit button', () => {
      renderWithProviders(<RegisterForm />)
      expect(screen.getByRole('button', { name: 'register.submit' })).toBeInTheDocument()
    })
  })

  describe('submission', () => {
    it('calls register with correct data and triggers onSuccess', async () => {
      const onSuccess = vi.fn()
      renderWithProviders(<RegisterForm onSuccess={onSuccess} />)

      await fillAndSubmit()

      expect(mockMutateAsync).toHaveBeenCalledWith({
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'Password123!',
          teamId: undefined,
        },
      })
      expect(mockToast).toHaveBeenCalledWith('register.success')
      expect(onSuccess).toHaveBeenCalled()
    })

    it('shows emailInUse toast and does not call onSuccess on 409', async () => {
      mockMutateAsync.mockRejectedValueOnce(
        Object.assign(new Error('Conflict'), { isAxiosError: true, response: { status: 409 } })
      )
      const onSuccess = vi.fn()
      renderWithProviders(<RegisterForm onSuccess={onSuccess} />)

      await fillAndSubmit()

      expect(mockToast).toHaveBeenCalledWith('register.error.emailInUse')
      expect(onSuccess).not.toHaveBeenCalled()
    })

    it('shows generic toast and does not call onSuccess on other errors', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('Network error'))
      const onSuccess = vi.fn()
      renderWithProviders(<RegisterForm onSuccess={onSuccess} />)

      await fillAndSubmit()

      expect(mockToast).toHaveBeenCalledWith('register.error.generic')
      expect(onSuccess).not.toHaveBeenCalled()
    })
  })
})
