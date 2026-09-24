import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { http, HttpResponse } from 'msw'
import { getUpdateUserMockHandler } from '@Sdk/users/users.msw'
import type { User } from '../../domain/User'
import { AdminUserForm } from './AdminUserForm'
import { AdminUserFormPage } from './AdminUserForm.page'

const user: User = {
  id: 'u-1',
  firstName: 'Jane',
  lastName: null,
  email: 'jane@example.com',
  avatar: null,
  isAdmin: false,
  isActive: true,
  isBlocked: false,
  isReferee: false,
  roles: [],
}

// Records the last PATCH body so plays can assert what was actually sent
let lastBody: unknown
const recordingUpdateHandler = http.patch('*/user/:id', async ({ request }) => {
  lastBody = await request.json()
  return HttpResponse.json({ ...user, ...(lastBody as object) })
})

const meta = {
  component: AdminUserForm,
  title: 'User/AdminUserForm',
  args: {
    user,
    isSelf: false,
    onFinish: fn(),
  },
  decorators: [
    Story => (
      <div className="h-screen w-96 p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    msw: { handlers: [getUpdateUserMockHandler()] },
  },
  beforeEach: () => {
    lastBody = undefined
  },
} satisfies Meta<typeof AdminUserForm>

export default meta
type Story = StoryObj<typeof meta>

export const SubmitDisabledInitially: Story = {
  name: 'Bouton désactivé tant que rien ne change',
  play: async ({ canvasElement }) => {
    const page = new AdminUserFormPage(canvasElement)
    await page.firstNameInput()
    await expect(page.submitButton()).toBeDisabled()
  },
}

export const ValidationError: Story = {
  name: 'Prénom vidé — soumission bloquée',
  play: async ({ canvasElement }) => {
    const page = new AdminUserFormPage(canvasElement)
    await page.clearFirstName()
    await waitFor(() => expect(page.submitButton()).toBeDisabled())
  },
}

export const SubmitOnlyChangedFields: Story = {
  name: 'Soumission — seuls les champs modifiés partent, onFinish appelé',
  parameters: { msw: { handlers: [recordingUpdateHandler] } },
  play: async ({ canvasElement, args }) => {
    const page = new AdminUserFormPage(canvasElement)
    await page.replaceFirstName('Janet')
    await page.toggleAdmin()
    await waitFor(() => expect(page.submitButton()).toBeEnabled())
    await page.submit()

    await waitFor(() => expect(args.onFinish).toHaveBeenCalled())
    await expect(lastBody).toEqual({ firstName: 'Janet', isAdmin: true })
  },
}

export const SelfLocksAdminSwitch: Story = {
  name: 'Son propre compte — switch admin verrouillé',
  args: { user: { ...user, isAdmin: true }, isSelf: true },
  play: async ({ canvasElement }) => {
    const page = new AdminUserFormPage(canvasElement)
    await page.firstNameInput()
    await expect(page.adminSwitch()).toBeDisabled()
    await expect(page.selfHint()).toBeInTheDocument()
  },
}

export const SubmitError: Story = {
  name: 'Erreur API — toast d’erreur, onFinish non appelé',
  parameters: {
    msw: {
      handlers: [http.patch('*/user/:id', () => HttpResponse.json({ message: 'boom', status: 500 }, { status: 500 }))],
    },
  },
  play: async ({ canvasElement, args }) => {
    const page = new AdminUserFormPage(canvasElement)
    await page.replaceFirstName('Janet')
    await waitFor(() => expect(page.submitButton()).toBeEnabled())
    await page.submit()

    await expect(await page.toast(/erreur lors de la modification|error while updating/i)).toBeInTheDocument()
    await expect(args.onFinish).not.toHaveBeenCalled()
  },
}
