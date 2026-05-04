import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../../tests/test-utils'
import { RegisterForm } from './RegisterForm'

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }))

vi.mock('@Sdk/teams/teams', () => ({
  useGetTeams: vi.fn(() => ({ data: [{ id: 'team-1', name: 'Équipe Alpha' }] })),
}))

vi.mock('@repo/design-system', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@repo/design-system')>()
  return { ...actual, Toast: { useToast: () => mockToast } }
})

describe('RegisterForm', () => {
  it('renders all form fields', () => {
    renderWithProviders(<RegisterForm />)
    expect(screen.getByLabelText(/^team$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('renders team options from API', () => {
    renderWithProviders(<RegisterForm />)
    expect(screen.getByText('Équipe Alpha')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderWithProviders(<RegisterForm />)
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })
})
