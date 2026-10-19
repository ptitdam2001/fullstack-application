import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { http, HttpResponse } from 'msw'
import { getRegisterMockHandler } from '@Sdk/authentication/authentication.msw'
import { getGetTeamsMockHandler } from '@Sdk/teams/teams.msw'
import { RegisterForm } from './RegisterForm'
import { RegisterFormPage } from './RegisterForm.page'

// Spy on the body received by POST /register
const onRegister = fn()

const meta = {
  component: RegisterForm,
  title: 'Auth/RegisterForm',
  decorators: [
    Story => (
      <div className="w-96 p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    msw: {
      handlers: [getGetTeamsMockHandler([]), getRegisterMockHandler()],
    },
  },
  beforeEach: () => {
    onRegister.mockClear()
  },
} satisfies Meta<typeof RegisterForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Rendu initial',
}

export const WeakPassword: Story = {
  name: 'Mot de passe sans chiffre ni majuscule — règles rappelées en erreur',
  play: async ({ canvasElement }) => {
    const page = new RegisterFormPage(canvasElement)
    await page.fill('password', 'password')
    await page.blurConfirmPassword()

    await waitFor(() => expect(page.rulesError()).toBeInTheDocument())
  },
}

export const PasswordMismatch: Story = {
  name: 'Confirmation différente — erreur de validation affichée',
  play: async ({ canvasElement }) => {
    const page = new RegisterFormPage(canvasElement)
    await page.fill('Password1', 'Password2')
    await page.blurConfirmPassword()

    await waitFor(() => expect(page.mismatchError()).toBeInTheDocument())
  },
}

export const WeakPasswordIsNotSubmitted: Story = {
  name: 'Mot de passe non conforme — aucun appel API',
  parameters: {
    msw: {
      handlers: [
        getGetTeamsMockHandler([]),
        http.post('*/register', async ({ request }) => {
          onRegister(await request.json())
          return HttpResponse.json({}, { status: 201 })
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new RegisterFormPage(canvasElement)
    await page.fill('nouppercase1', 'nouppercase1')
    await page.submit()

    await waitFor(() => expect(page.rulesError()).toBeInTheDocument())
    await expect(onRegister).not.toHaveBeenCalled()
  },
}

export const AccentedUppercaseIsAccepted: Story = {
  name: 'Majuscule accentuée — inscription envoyée',
  parameters: {
    msw: {
      handlers: [
        getGetTeamsMockHandler([]),
        http.post('*/register', async ({ request }) => {
          onRegister(await request.json())
          return HttpResponse.json({}, { status: 201 })
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new RegisterFormPage(canvasElement)
    await page.fill('Écureuil1', 'Écureuil1')
    await page.submit()

    await page.successMessage()
    await expect(onRegister).toHaveBeenCalledWith(expect.objectContaining({ password: 'Écureuil1' }))
  },
}
