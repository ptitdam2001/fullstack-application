import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Dialog } from './Dialog'
import { DialogContent } from './DialogContent'
import { DialogDescription } from './DialogDescription'
import { DialogFooter } from './DialogFooter'
import { DialogHeader } from './DialogHeader'
import { DialogTitle } from './DialogTitle'
import { DialogTrigger } from './DialogTrigger'

const meta = {
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <DialogTrigger>
          <button className="rounded border px-4 py-2 text-sm">Open dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground text-sm">Dialog body content goes here.</p>
          </div>
          <DialogFooter>
            <button className="rounded border px-4 py-2 text-sm">Cancel</button>
            <button className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm">Save</button>
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
        <DialogTrigger>
          <button className="rounded border px-4 py-2 text-sm">Open dialog</button>
        </DialogTrigger>
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
