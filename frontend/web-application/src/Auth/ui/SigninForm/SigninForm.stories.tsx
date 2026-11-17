import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { MemoryRouter } from 'react-router'
import { http, HttpResponse } from 'msw'
import { AuthProvider } from '../../application/AuthProvider'
import { SigninForm } from './SigninForm'
import { SigninFormPage } from './SigninForm.page'

const meta = {
  component: SigninForm,
  title: 'Auth/SigninForm',
  decorators: [
    Story => (
      // useLoginAction navigates after sign-in and writes the session to the auth context
      <MemoryRouter initialEntries={['/auth/signin']}>
        <AuthProvider.Provider>
          <div className="w-96 p-6">
            <Story />
          </div>
        </AuthProvider.Provider>
      </MemoryRouter>
    ),
  ],
  args: {
    forgotPasswordHref: '/auth/forgotten-password',
  },
} satisfies Meta<typeof SigninForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Rendu initial',
}

export const WrongCredentials: Story = {
  name: 'Identifiants incorrects (401) — toast affiché, page conservée',
  parameters: {
    msw: {
      handlers: [
        http.post('*/login', () => HttpResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 })),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new SigninFormPage(canvasElement)
    await page.signIn('jane.doe@example.org', 'WrongPassw0rd')

    await page.toast(/incorrect email or password|email ou mot de passe incorrect/i)
    // The 401 interceptor no longer reloads the page: the form is still there
    await expect(page.submitButton()).toBeInTheDocument()
  },
}

export const AccountInactive: Story = {
  name: 'Compte non activé (403) — toast « activez votre compte »',
  parameters: {
    msw: {
      handlers: [
        http.post('*/login', () => HttpResponse.json({ status: 403, message: 'Compte non activé' }, { status: 403 })),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new SigninFormPage(canvasElement)
    await page.signIn('jane.doe@example.org', 'Passw0rd')

    await page.toast(/account is not yet activated|compte n'est pas encore activé/i)
  },
}

export const TooManyRequests: Story = {
  name: 'Trop de tentatives (429) — toast « patientez », pas « identifiants incorrects »',
  parameters: {
    msw: {
      handlers: [
        http.post('*/login', () => HttpResponse.json({ status: 429, message: 'Too many requests' }, { status: 429 })),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new SigninFormPage(canvasElement)
    await page.signIn('jane.doe@example.org', 'Passw0rd')

    await page.toast(/too many attempts|trop de tentatives/i)
  },
}

export const EmptyFields: Story = {
  name: 'Champs vides — erreurs « requis » traduites',
  play: async ({ canvasElement }) => {
    const page = new SigninFormPage(canvasElement)
    await page.submit()

    // One message under the email field, one under the password field
    await expect(await page.requiredErrors()).toHaveLength(2)
  },
}

export const InvalidEmail: Story = {
  name: 'Email mal formé — erreur traduite',
  play: async ({ canvasElement }) => {
    const page = new SigninFormPage(canvasElement)
    await page.typeEmailAndBlur('jane.doe@')

    await expect(await page.invalidEmailError()).toBeInTheDocument()
  },
}
