import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../../tests/test-utils'
import { RegisterForm } from './RegisterForm'

// react-intl is mocked globally via __mocks__/react-intl.tsx
// FormattedMessage renders the id, useIntl().formatMessage returns the id
// → assert on i18n keys, not translated strings

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }))

vi.mock('@Sdk/teams/teams', () => ({
  useGetTeams: vi.fn(() => ({ data: [{ id: 'team-1', name: 'Équipe Alpha' }] })),
}))

vi.mock('@repo/design-system', async importOriginal => {
  const actual = await importOriginal<typeof import('@repo/design-system')>()
  return { ...actual, Toast: { useToast: () => mockToast } }
})

describe('RegisterForm', () => {
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
