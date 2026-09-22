import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { http, HttpResponse } from 'msw'
import { getForgotPasswordMockHandler, getResendActivationMockHandler } from '@Sdk/authentication/authentication.msw'
import { ForgottenPasswordForm } from './ForgottenPasswordForm'
import { ForgottenPasswordFormPage } from './ForgottenPasswordForm.page'

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
    msw: {
      handlers: [getForgotPasswordMockHandler(), getResendActivationMockHandler()],
    },
  },
} satisfies Meta<typeof ForgottenPasswordForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Rendu initial',
}

export const SubmitSuccess: Story = {
  name: 'Soumission réussie — passe à l’écran de renvoi',
  play: async ({ canvasElement }) => {
    const page = new ForgottenPasswordFormPage(canvasElement)
    await page.fillEmail('user@example.com')
    await page.submit()

    await waitFor(() => expect(page.successMessage()).toBeInTheDocument())
  },
}

export const SubmitTooManyRequests: Story = {
  name: 'Soumission 429 — toast dédié',
  parameters: {
    msw: {
      handlers: [
        http.post('*/forgot-password', () => HttpResponse.json({ status: 429, message: 'Too many requests' }, { status: 429 })),
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

export const ResendTooManyRequests: Story = {
  name: 'Renvoi 429 — toast dédié',
  parameters: {
    msw: {
      handlers: [
        getForgotPasswordMockHandler(),
        http.post('*/resend-activation', () => HttpResponse.json({ status: 429, message: 'Too many requests' }, { status: 429 })),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new ForgottenPasswordFormPage(canvasElement)
    await page.fillEmail('user@example.com')
    await page.submit()
    await page.clickResend()

    await page.toast(/too many attempts|trop de tentatives/i)
  },
}