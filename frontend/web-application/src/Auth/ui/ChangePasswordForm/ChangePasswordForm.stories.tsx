import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { http, HttpResponse } from 'msw'
import { getChangeMyPasswordMockHandler } from '@Sdk/authentication/authentication.msw'
import { AuthProvider } from '../../application/AuthProvider'
import { ChangePasswordForm } from './ChangePasswordForm'
import { ChangePasswordFormPage } from './ChangePasswordForm.page'

const session = {
  token: 'old-token',
  user: { id: '000000000000000000000001', email: 'jane.doe@example.org', firstName: 'Jane', lastName: 'Doe' },
}

// Spy on the body received by PUT /me/password
const onChangePassword = fn()

const meta = {
  component: ChangePasswordForm,
  title: 'Auth/ChangePasswordForm',
  decorators: [
    Story => (
      // The action hook writes the fresh token to the auth context
      <AuthProvider.Provider>
        <div className="w-[32rem] p-6">
          <Story />
        </div>
      </AuthProvider.Provider>
    ),
  ],
  parameters: {
    localStorage: { user: session },
    msw: {
      handlers: [getChangeMyPasswordMockHandler()],
    },
  },
  beforeEach: () => {
    onChangePassword.mockClear()
  },
} satisfies Meta<typeof ChangePasswordForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Rendu initial',
}

export const WeakNewPassword: Story = {
  name: 'Nouveau mot de passe sans chiffre ni majuscule — règles rappelées en erreur',
  play: async ({ canvasElement }) => {
    const page = new ChangePasswordFormPage(canvasElement)
    await page.fill('OldPassw0rd', 'password', 'password')
    await page.blur()

    await waitFor(() => expect(page.rulesError()).toBeInTheDocument())
    await expect(page.newPasswordInput()).toHaveAttribute('aria-invalid', 'true')
  },
}

export const PasswordMismatch: Story = {
  name: 'Confirmation différente — erreur de validation affichée',
  play: async ({ canvasElement }) => {
    const page = new ChangePasswordFormPage(canvasElement)
    await page.fill('OldPassw0rd', 'NewPassw0rd', 'NewPassw0rd2')
    await page.blur()

    await waitFor(() => expect(page.mismatchError()).toBeInTheDocument())
  },
}

export const InvalidFormIsNotSubmitted: Story = {
  name: 'Formulaire invalide — aucun appel API',
  parameters: {
    msw: {
      handlers: [
        http.put('*/me/password', async ({ request }) => {
          onChangePassword(await request.json())
          return HttpResponse.json({ ...session.user, userId: session.user.id, isAdmin: false, token: 'fresh-token' })
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new ChangePasswordFormPage(canvasElement)
    await page.fill('', 'NewPassw0rd', 'Different1')
    await page.submit()

    await waitFor(() => expect(page.mismatchError()).toBeInTheDocument())
    await expect(onChangePassword).not.toHaveBeenCalled()
    await expect(JSON.parse(localStorage.getItem('user') ?? '{}').token).toBe('old-token')
  },
}

export const SubmitSuccess: Story = {
  name: 'Soumission — jeton de session remplacé, formulaire vidé',
  parameters: {
    msw: {
      handlers: [
        http.put('*/me/password', async ({ request }) => {
          onChangePassword(await request.json())
          return HttpResponse.json({
            userId: session.user.id,
            email: session.user.email,
            isAdmin: false,
            token: 'fresh-token',
          })
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new ChangePasswordFormPage(canvasElement)
    await page.fill('OldPassw0rd', 'NewPassw0rd', 'NewPassw0rd')
    await page.submit()

    await page.toast(/password changed|mot de passe modifié/i)
    // confirmPassword is client-side only
    await expect(onChangePassword).toHaveBeenCalledWith({ currentPassword: 'OldPassw0rd', newPassword: 'NewPassw0rd' })
    // Previous tokens are revoked server-side: the stored one must be the fresh one, user untouched
    const stored = JSON.parse(localStorage.getItem('user') ?? '{}')
    await expect(stored.token).toBe('fresh-token')
    await expect(stored.user).toEqual(session.user)
    await waitFor(async () => expect(await page.currentPasswordInput()).toHaveValue(''))
    await expect(page.newPasswordInput()).toHaveValue('')
    await expect(page.confirmPasswordInput()).toHaveValue('')
  },
}

export const SubmitWrongCurrentPassword: Story = {
  name: 'Soumission 400 — erreur sur le formulaire, jeton conservé',
  parameters: {
    msw: {
      handlers: [
        http.put('*/me/password', () =>
          HttpResponse.json({ status: 400, message: 'Invalid current password' }, { status: 400 })
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new ChangePasswordFormPage(canvasElement)
    await page.fill('WrongPassw0rd', 'NewPassw0rd', 'NewPassw0rd')
    await page.submit()

    const alert = await page.submitError()
    await expect(alert).toHaveAttribute('data-error', 'invalid')
    await expect(alert).toHaveTextContent(/current password is incorrect|mot de passe actuel est incorrect/i)
    await expect(JSON.parse(localStorage.getItem('user') ?? '{}').token).toBe('old-token')
    // The typed values are kept so the user can fix them
    await expect(page.newPasswordInput()).toHaveValue('NewPassw0rd')
  },
}

export const SubmitTooManyRequests: Story = {
  name: 'Soumission 429 — erreur dédiée',
  parameters: {
    msw: {
      handlers: [
        http.put('*/me/password', () =>
          HttpResponse.json({ status: 429, message: 'Too many requests' }, { status: 429 })
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new ChangePasswordFormPage(canvasElement)
    await page.fill('OldPassw0rd', 'NewPassw0rd', 'NewPassw0rd')
    await page.submit()

    const alert = await page.submitError()
    await expect(alert).toHaveAttribute('data-error', 'tooManyRequests')
    await expect(alert).toHaveTextContent(/too many attempts|trop de tentatives/i)
  },
}
