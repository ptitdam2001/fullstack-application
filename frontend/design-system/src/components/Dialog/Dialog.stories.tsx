import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../Button/Button'
import { Dialog } from './Dialog'
import { DialogContent } from './DialogContent'
import { DialogDescription } from './DialogDescription'
import { DialogFooter } from './DialogFooter'
import { DialogHeader } from './DialogHeader'
import { DialogTitle } from './DialogTitle'

const meta = {
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <Button variant="outline">Open dialog</Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground text-sm">Dialog body content goes here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" slot="close">Cancel</Button>
            <Button slot="close">Save</Button>
          </DialogFooter>
        </DialogContent>
      </>
    ),
  },
}

export const WithoutFooter: Story = {
  args: {
    children: (
      <>
        <Button variant="outline">Open dialog</Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Information</DialogTitle>
            <DialogDescription>This dialog has no footer.</DialogDescription>
          </DialogHeader>
          <p className="text-sm">Content here.</p>
        </DialogContent>
      </>
    ),
  },
}

// ─── Interaction tests ────────────────────────────────────────────────────────

export const OpensOnClick: Story = {
  args: { ...Default.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /open dialog/i }))
    await expect(within(document.body).getByRole('dialog')).toBeVisible()
  },
}

export const ClosesOnEscape: Story = {
  args: { ...Default.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /open dialog/i }))
    await expect(within(document.body).getByRole('dialog')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}

export const ClosesOnOutsideClick: Story = {
  args: { ...Default.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /open dialog/i }))
    await expect(within(document.body).getByRole('dialog')).toBeVisible()
    await userEvent.click(document.body)
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}
