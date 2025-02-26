import { Meta, StoryObj } from '@storybook/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog'

const meta = {
  title: 'Common/Dialog',
  component: Dialog,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  args: {
    children: (
      <>
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    ),
  },
}
