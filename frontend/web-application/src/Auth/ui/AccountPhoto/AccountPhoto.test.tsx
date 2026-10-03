import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AccountPhotoPage } from './AccountPhoto.page'
import { useMyAvatarActions } from '../../application/useMyAvatarActions'

vi.mock('@Config/axios-instance', () => ({ getBaseUrl: () => 'http://api.test/' }))
vi.mock('../../application/useMyAvatarActions', () => ({ useMyAvatarActions: vi.fn() }))

const upload = vi.fn()
const remove = vi.fn()

const mockActions = (overrides: Partial<ReturnType<typeof useMyAvatarActions>> = {}) =>
  vi.mocked(useMyAvatarActions).mockReturnValue({
    upload,
    remove,
    error: null,
    isUploading: false,
    isRemoving: false,
    ...overrides,
  })

describe('AccountPhoto', () => {
  beforeEach(() => {
    upload.mockResolvedValue(true)
    remove.mockResolvedValue(true)
    mockActions()
  })

  it('renders the section with the initials when the user has no picture', () => {
    const page = new AccountPhotoPage().render()

    expect(page.section()).toBeInTheDocument()
    expect(page.avatar()).toHaveAttribute('data-has-image', 'false')
    expect(page.avatar()).toHaveTextContent('JD')
  })

  it('only accepts JPEG, PNG and WebP files', () => {
    const page = new AccountPhotoPage().render()

    expect(page.fileInput()).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp')
  })

  it('opens the file picker from the choose button', () => {
    const page = new AccountPhotoPage().render()
    const click = vi.spyOn(page.fileInput(), 'click')

    page.clickChoose()

    expect(click).toHaveBeenCalledOnce()
  })

  it('uploads the chosen file', () => {
    const file = new File(['binary'], 'me.png', { type: 'image/png' })
    const page = new AccountPhotoPage().render()

    page.selectFile(file)

    expect(upload).toHaveBeenCalledWith(file)
  })

  it('has no remove button without a picture', () => {
    const page = new AccountPhotoPage().render()

    expect(page.removeButton()).not.toBeInTheDocument()
  })

  it('removes the current picture from the remove button', () => {
    const page = new AccountPhotoPage({ avatar: '/images/abc123' }).render()

    expect(page.avatar()).toHaveAttribute('data-has-image', 'true')
    page.clickRemove()

    expect(remove).toHaveBeenCalledOnce()
  })

  it.each(['invalidType', 'unreadable', 'rejected', 'generic'] as const)('shows the "%s" error', code => {
    mockActions({ error: code })
    const page = new AccountPhotoPage().render()

    expect(page.error()).toHaveTextContent(`account.photo.error.${code}`)
    expect(page.error()).toHaveAttribute('data-error', code)
  })

  it('shows no error by default', () => {
    const page = new AccountPhotoPage().render()

    expect(page.error()).not.toBeInTheDocument()
  })

  it('disables both actions while a picture is being uploaded', () => {
    mockActions({ isUploading: true })
    const page = new AccountPhotoPage({ avatar: '/images/abc123' }).render()

    expect(page.chooseButton()).toBeDisabled()
    expect(page.removeButton()).toBeDisabled()
    expect(page.section()).toHaveAttribute('aria-busy', 'true')
  })

  it('disables both actions while the picture is being removed', () => {
    mockActions({ isRemoving: true })
    const page = new AccountPhotoPage({ avatar: '/images/abc123' }).render()

    expect(page.chooseButton()).toBeDisabled()
    expect(page.removeButton()).toBeDisabled()
  })
})
