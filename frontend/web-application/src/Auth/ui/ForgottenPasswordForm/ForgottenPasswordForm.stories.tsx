import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { http, HttpResponse } from 'msw'
import { ForgottenPasswordForm } from './ForgottenPasswordForm'
import { ForgottenPasswordFormPage } from './ForgottenPasswordForm.page'

// Spies on the bodies received by the two email routes
const onForgotPassword = fn()
const onResendActivation = fn()

const handlers = [
  http.post('*/forgot-password', async ({ request }) => {
    onForgotPassword(await request.json())
    return new HttpResponse(null, { status: 200 })
  }),
  http.post('*/resend-activation', async ({ request }) => {
    onResendActivation(await request.json())
    return new HttpResponse(null, { status: 200 })
  }),
]

const meta = {
  component: ForgottenPasswordForm,
  title: 'Auth/ForgottenPasswordForm',
  decorators: [
    Story => (
      <div className="h-screen w-96 p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    msw: { handlers },
  },
  beforeEach: () => {
    onForgotPassword.mockClear()
    onResendActivation.mockClear()
  },
} satisfies Meta<typeof ForgottenPasswordForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Rendu initial',
}

export const SubmitSuccess: Story = {
  name: 'Soumission réussie — message de réinitialisation',
  play: async ({ canvasElement }) => {
    const page = new ForgottenPasswordFormPage(canvasElement)
    await page.fillEmail('user@example.com')
    await page.submit()

    await waitFor(() => expect(page.successMessage()).toBeInTheDocument())
    await expect(onForgotPassword).toHaveBeenCalledWith({ email: 'user@example.com' })
  },
}

export const ResendResetLink: Story = {
  name: 'Renvoi du lien de réinitialisation — même route, même adresse',
  play: async ({ canvasElement }) => {
    const page = new ForgottenPasswordFormPage(canvasElement)
    await page.fillEmail('user@example.com')
    await page.submit()
    await page.clickResendResetLink()

    await waitFor(() => expect(onForgotPassword).toHaveBeenCalledTimes(2))
    await expect(onForgotPassword).toHaveBeenLastCalledWith({ email: 'user@example.com' })
    await expect(onResendActivation).not.toHaveBeenCalled()
  },
}

export const ResendActivation: Story = {
  name: 'Compte pas encore activé — renvoi du lien d’activation',
  play: async ({ canvasElement }) => {
    const page = new ForgottenPasswordFormPage(canvasElement)
    await page.fillEmail('user@example.com')
    await page.submit()
    await page.clickResendActivation()

    await page.toast(/email sent if your account exists|email envoyé si votre compte existe/i)
    await expect(onResendActivation).toHaveBeenCalledWith({ email: 'user@example.com' })
  },
}

export const SubmitTooManyRequests: Story = {
  name: 'Soumission 429 — toast dédié',
  parameters: {
    msw: {
      handlers: [
        http.post('*/forgot-password', () =>
          HttpResponse.json({ status: 429, message: 'Too many requests' }, { status: 429 })
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new ForgottenPasswordFormPage(canvasElement)
    await page.fillEmail('user@example.com')
    await page.submit()

    await page.toast(/too many attempts|trop de tentatives/i)
  },
}

export const ResendActivationTooManyRequests: Story = {
  name: 'Renvoi d’activation 429 — toast dédié',
  parameters: {
    msw: {
      handlers: [
        handlers[0],
        http.post('*/resend-activation', () =>
          HttpResponse.json({ status: 429, message: 'Too many requests' }, { status: 429 })
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new ForgottenPasswordFormPage(canvasElement)
    await page.fillEmail('user@example.com')
    await page.submit()
    const tooManyRequests = /too many attempts|trop de tentatives/i
    const before = page.toasts(tooManyRequests).length
    await page.clickResendActivation()

    await waitFor(() => expect(page.toasts(tooManyRequests)).toHaveLength(before + 1))
  },
}
