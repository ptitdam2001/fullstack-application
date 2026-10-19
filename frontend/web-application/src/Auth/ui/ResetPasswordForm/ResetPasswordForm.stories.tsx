import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { MemoryRouter } from 'react-router'
import { http, HttpResponse } from 'msw'
import { getResetPasswordMockHandler } from '@Sdk/authentication/authentication.msw'
import { ResetPasswordForm } from './ResetPasswordForm'
import { ResetPasswordFormPage } from './ResetPasswordForm.page'

// Spy on the body received by POST /reset-password
const onResetPassword = fn()

const meta = {
  component: ResetPasswordForm,
  title: 'Auth/ResetPasswordForm',
  decorators: [
    Story => (
      // useSearchParams()/useNavigate() need a router context — no route is matched, just a location.
      <MemoryRouter initialEntries={['/reset-password?token=test-token']}>
        <div className="h-screen w-96 p-6">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    msw: {
      handlers: [getResetPasswordMockHandler()],
    },
  },
  beforeEach: () => {
    onResetPassword.mockClear()
  },
} satisfies Meta<typeof ResetPasswordForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Rendu initial',
}

export const WeakPassword: Story = {
  name: 'Mot de passe sans majuscule — règles rappelées en erreur',
  play: async ({ canvasElement }) => {
    const page = new ResetPasswordFormPage(canvasElement)
    await page.fillPasswords('password1', 'password1')
    await page.blurConfirmPassword()

    await waitFor(() => expect(page.rulesError()).toBeInTheDocument())
  },
}

export const WeakPasswordIsNotSubmitted: Story = {
  name: 'Mot de passe non conforme — aucun appel API',
  parameters: {
    msw: {
      handlers: [
        http.post('*/reset-password', async ({ request }) => {
          onResetPassword(await request.json())
          return new HttpResponse(null, { status: 200 })
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new ResetPasswordFormPage(canvasElement)
    await page.fillPasswords('NoDigitHere', 'NoDigitHere')
    await page.submit()

    await waitFor(() => expect(page.rulesError()).toBeInTheDocument())
    await expect(onResetPassword).not.toHaveBeenCalled()
  },
}

export const PasswordMismatch: Story = {
  name: 'Mots de passe différents — erreur de validation affichée',
  play: async ({ canvasElement }) => {
    const page = new ResetPasswordFormPage(canvasElement)
    await page.fillPasswords('Password1', 'Password2')
    await page.blurConfirmPassword()

    await waitFor(() => expect(page.mismatchError()).toBeInTheDocument())
  },
}

export const SubmitTooManyRequests: Story = {
  name: 'Soumission 429 — toast dédié',
  parameters: {
    msw: {
      handlers: [
        http.post('*/reset-password', () =>
          HttpResponse.json({ status: 429, message: 'Too many requests' }, { status: 429 })
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new ResetPasswordFormPage(canvasElement)
    await page.fillPasswords('Password1', 'Password1')
    await page.submit()

    await page.toast(/too many attempts|trop de tentatives/i)
  },
}
