import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { MemoryRouter } from 'react-router'
import { http, HttpResponse } from 'msw'
import { getActivateAccountMockHandler } from '@Sdk/authentication/authentication.msw'
import { ActivateForm } from './ActivateForm'
import { ActivateFormPage } from './ActivateForm.page'

const meta = {
  component: ActivateForm,
  title: 'Auth/ActivateForm',
  decorators: [
    (Story, { parameters }) => (
      // useSearchParams() needs a router context — no route is matched, just a location
      <MemoryRouter initialEntries={[parameters.location]}>
        <div className="w-96 p-6">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    location: '/auth/activate?token=test-token',
    msw: {
      handlers: [getActivateAccountMockHandler()],
    },
  },
} satisfies Meta<typeof ActivateForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Rendu initial',
}

export const MissingToken: Story = {
  name: 'Lien sans token — lien invalide, pas de bouton',
  parameters: { location: '/auth/activate' },
  play: async ({ canvasElement }) => {
    const page = new ActivateFormPage(canvasElement)

    await page.invalidLinkMessage()
    await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument()
  },
}

export const ActivateSuccess: Story = {
  name: 'Activation réussie — invitation à se connecter',
  play: async ({ canvasElement }) => {
    const page = new ActivateFormPage(canvasElement)
    await page.activate()

    await page.successTitle()
  },
}

export const ActivateInvalidToken: Story = {
  name: 'Token invalide (400) — message traduit, jamais la clé brute',
  parameters: {
    msw: {
      handlers: [
        http.post('*/activate', () =>
          HttpResponse.json({ status: 400, message: 'Token invalide ou expiré' }, { status: 400 })
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new ActivateFormPage(canvasElement)
    await page.activate()

    await page.invalidLinkMessage()
    // The toast fires with the error: give it the time to show before asserting it is translated
    await waitFor(() => expect(within(document.body).getAllByText(/invalid|invalide/i).length).toBeGreaterThan(1))
    await expect(page.rawKey('activate.error.invalid')).not.toBeInTheDocument()
  },
}
