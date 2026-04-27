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
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
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
    </Dialog>
  ),
}

export const WithoutFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded border px-4 py-2 text-sm">Open dialog</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Information</DialogTitle>
          <DialogDescription>This dialog has no footer.</DialogDescription>
        </DialogHeader>
        <p className="text-sm">Content here.</p>
      </DialogContent>
    </Dialog>
  ),
}
