import { describe, expect, it } from 'vitest'
import { AdminUserPhotoPage } from './AdminUserPhoto.page'

describe('AdminUserPhoto', () => {
  it('shows the photo and a remove button when the user has a photo', () => {
    const page = new AdminUserPhotoPage().render()

    expect(page.avatar()).toHaveAttribute('data-has-image', 'true')
    expect(page.removeButton()).toBeInTheDocument()
  })

  it('shows the initials and no remove button when the user has no photo', () => {
    const page = new AdminUserPhotoPage({ avatar: null }).render()

    expect(page.avatar()).toHaveAttribute('data-has-image', 'false')
    expect(page.avatar()).toHaveTextContent('JD')
    expect(page.removeButton()).not.toBeInTheDocument()
  })

  it('asks for confirmation before removing: nothing is sent on the first click', () => {
    const page = new AdminUserPhotoPage().render().clickRemove()

    expect(page.dialogTitle()).toBeInTheDocument()
    expect(page.removeUserAvatar).not.toHaveBeenCalled()
  })

  it('removes the photo of this user on confirm, then shows the initials and hides the button', async () => {
    const page = new AdminUserPhotoPage().render().clickRemove().clickConfirm()
    await page.waitForRemovalSettled()

    expect(page.removeUserAvatar).toHaveBeenCalledWith('u-1')
    expect(page.avatar()).toHaveAttribute('data-has-image', 'false')
    expect(page.removeButton()).not.toBeInTheDocument()
  })

  it('keeps the photo and the button when the removal fails', async () => {
    const page = new AdminUserPhotoPage().failRemoval().render().clickRemove().clickConfirm()
    await page.waitForRemovalSettled()

    expect(page.avatar()).toHaveAttribute('data-has-image', 'true')
    expect(page.removeButton()).toBeInTheDocument()
  })
})
