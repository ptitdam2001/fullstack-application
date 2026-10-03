import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { http, HttpResponse } from 'msw'
import { getRemoveMyAvatarMockHandler } from '@Sdk/authentication/authentication.msw'
import { AuthProvider } from '../../application/AuthProvider'
import { type UploadAvatarInput, type UserWithoutPassword } from '../../domain/Account'
import { AccountPhoto } from './AccountPhoto'
import { AccountPhotoStoryPage } from './AccountPhoto.story.page'

const user: UserWithoutPassword = {
  id: '000000000000000000000001',
  email: 'jane.doe@example.org',
  firstName: 'Jane',
  lastName: 'Doe',
}

// 1 × 1 px JPEG — an absolute (data:) avatar url, used as is
const TINY_JPEG =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA='

// Spy on the body received by PUT /me/avatar
const onUploadAvatar = fn()

// A real picture, built in the browser: 600 × 400 px, landscape
const createPng = async (): Promise<File> => {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 400
  const context = canvas.getContext('2d')!
  context.fillStyle = '#c0392b'
  context.fillRect(0, 0, 600, 400)
  const blob = await new Promise<Blob>(resolve => canvas.toBlob(result => resolve(result!), 'image/png'))
  return new File([blob], 'me.png', { type: 'image/png' })
}

// The section reads its user from the auth context, like the account page does
const ConnectedAccountPhoto = () => {
  const { user: currentUser } = AuthProvider.useAuthValue()
  return currentUser ? <AccountPhoto user={currentUser} /> : null
}

const meta = {
  component: ConnectedAccountPhoto,
  title: 'Auth/AccountPhoto',
  decorators: [
    Story => (
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
      handlers: [
        http.put('*/me/avatar', async ({ request }) => {
          const body = (await request.json()) as UploadAvatarInput
          onUploadAvatar(body)
          // Echo the uploaded bytes back as the avatar: the picture shown is the one that was sent
          return HttpResponse.json({ ...user, avatar: `data:${body.contentType};base64,${body.data}` })
        }),
        getRemoveMyAvatarMockHandler(user),
      ],
    },
  },
  beforeEach: () => {
    onUploadAvatar.mockClear()
  },
} satisfies Meta<typeof ConnectedAccountPhoto>

export default meta
type Story = StoryObj<typeof meta>

export const WithoutPhoto: Story = {
  name: 'Sans photo — initiales, pas de bouton supprimer',
  play: async ({ canvasElement }) => {
    const page = new AccountPhotoStoryPage(canvasElement)

    await expect(await page.chooseButton()).toBeEnabled()
    await expect(page.avatar()).toHaveTextContent('JD')
    await expect(page.removeButton()).not.toBeInTheDocument()
  },
}

export const UploadPhoto: Story = {
  name: 'Choix d’un fichier — redimensionné en JPEG 256 × 256, affiché aussitôt',
  play: async ({ canvasElement }) => {
    const page = new AccountPhotoStoryPage(canvasElement)
    await page.upload(await createPng())

    await page.toast(/profile photo updated|photo de profil mise à jour/i)
    const body = onUploadAvatar.mock.calls[0][0] as UploadAvatarInput
    await expect(body.contentType).toBe('image/jpeg')
    // Raw base64 of a JPEG (magic bytes FF D8 FF → "/9j/"), without the data url prefix
    await expect(body.data.startsWith('/9j/')).toBe(true)
    // The echoed picture decodes to the resized square
    await waitFor(() => expect(page.picture()?.naturalWidth).toBe(256))
    await expect(page.picture()?.naturalHeight).toBe(256)
    await expect(page.removeButton()).toBeInTheDocument()
  },
}

export const RejectsNonImage: Story = {
  name: 'Fichier non image — erreur, aucun appel API',
  play: async ({ canvasElement }) => {
    const page = new AccountPhotoStoryPage(canvasElement)
    await page.uploadIgnoringAccept(new File(['%PDF-1.7'], 'cv.pdf', { type: 'application/pdf' }))

    const error = await page.error()
    await expect(error).toHaveAttribute('data-error', 'invalidType')
    await expect(error).toHaveTextContent(/not supported|pas pris en charge/i)
    await expect(onUploadAvatar).not.toHaveBeenCalled()
  },
}

export const ServerRejectsPhoto: Story = {
  name: 'Refus du serveur (400) — erreur dédiée',
  parameters: {
    msw: {
      handlers: [
        http.put('*/me/avatar', () => HttpResponse.json({ status: 400, message: 'Image too large' }, { status: 400 })),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const page = new AccountPhotoStoryPage(canvasElement)
    await page.upload(await createPng())

    const error = await page.error()
    await expect(error).toHaveAttribute('data-error', 'rejected')
    await expect(error).toHaveTextContent(/was rejected|a été refusée/i)
  },
}

export const RemovePhoto: Story = {
  name: 'Suppression — retour aux initiales',
  parameters: {
    localStorage: { user: { token: 'story-token', user: { ...user, avatar: TINY_JPEG } } },
  },
  play: async ({ canvasElement }) => {
    const page = new AccountPhotoStoryPage(canvasElement)
    await page.remove()

    await page.toast(/profile photo removed|photo de profil supprimée/i)
    await waitFor(() => expect(page.removeButton()).not.toBeInTheDocument())
    await expect(page.picture()).not.toBeInTheDocument()
    await expect(page.avatar()).toHaveTextContent('JD')
  },
}
