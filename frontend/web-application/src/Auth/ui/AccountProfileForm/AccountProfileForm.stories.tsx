import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { http, HttpResponse } from 'msw'
import { getUpdateMyProfileMockHandler } from '@Sdk/authentication/authentication.msw'
import { AuthProvider } from '../../application/AuthProvider'
import { type UserWithoutPassword } from '../../domain/Account'
import { AccountProfileForm } from './AccountProfileForm'
import { AccountProfileFormPage } from './AccountProfileForm.page'

const user: UserWithoutPassword = {
  id: '000000000000000000000001',
  email: 'jane.doe@example.org',
  firstName: 'Jane',
  lastName: 'Doe',
  roles: ['COACH'],
}

// Spy on the body received by PATCH /me
const onPatchMe = fn()

const meta = {
  component: AccountProfileForm,
  title: 'Auth/AccountProfileForm',
  args: { user },
  decorators: [
    Story => (
      // The action hook writes the updated user to the auth context
      <AuthProvider.Provider>
        <div className="w-[32rem] p-6">
          <Story />
        </div>
      </AuthProvider.Provider>
    ),
  ],
  parameters: {
    localStorage: { user: { token: 'story-token', user } },
    msw: {
      handlers: [getUpdateMyProfileMockHandler({ ...user, firstName: 'Janet' })],
    },
  },
  beforeEach: () => {
    onPatchMe.mockClear()
  },
} satisfies Meta<typeof AccountProfileForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Rendu initial — bouton désactivé tant que rien ne change',
  play: async ({ canvasElement }) => {
    const page = new AccountProfileFormPage(canvasElement)

    await expect(await page.firstNameInput()).toHaveValue('Jane')
    await expect(page.lastNameInput()).toHaveValue('Doe')
    await expect(page.email()).toHaveTextContent('jane.doe@example.org')
    await expect(page.submitButton()).toBeDisabled()
  },
}

export const FirstNameRequired: Story = {
  name: 'Prénom vidé — erreur affichée, bouton désactivé',
  play: async ({ canvasElement }) => {
    const page = new AccountProfileFormPage(canvasElement)
    await page.setFirstName('')

    await waitFor(() => expect(page.firstNameError()).toBeInTheDocument())
    await expect(page.submitButton()).toBeDisabled()
  },
}

export const SubmitSuccess: Story = {
  name: 'Soumission — nom vidé envoyé à null, formulaire de nouveau vierge',
  parameters: {
    msw: {
      handlers: [
        http.patch('*/me', async ({ request }) => {
          onPatchMe(await request.json())
          return HttpResponse.json({ ...user, firstName: 'Janet', lastName: undefined })
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new AccountProfileFormPage(canvasElement)
    await page.setFirstName('Janet')
    await page.clearLastName()
    await waitFor(() => expect(page.submitButton()).toBeEnabled())
    await page.submit()

    await page.toast(/profile updated|profil mis à jour/i)
    await expect(onPatchMe).toHaveBeenCalledWith({ firstName: 'Janet', lastName: null })
    // Saved values are the new baseline: nothing left to save
    await waitFor(() => expect(page.submitButton()).toBeDisabled())
    await expect(await page.firstNameInput()).toHaveValue('Janet')
    await expect(JSON.parse(localStorage.getItem('user') ?? '{}').user.firstName).toBe('Janet')
  },
}

export const SubmitError: Story = {
  name: 'Soumission en erreur — toast, saisie conservée',
  parameters: {
    msw: {
      handlers: [http.patch('*/me', () => HttpResponse.json({ status: 500, message: 'Boom' }, { status: 500 }))],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new AccountProfileFormPage(canvasElement)
    await page.setFirstName('Janet')
    await waitFor(() => expect(page.submitButton()).toBeEnabled())
    await page.submit()

    await page.toast(/could not be saved|n'a pas pu être enregistré/i)
    await expect(await page.firstNameInput()).toHaveValue('Janet')
  },
}
